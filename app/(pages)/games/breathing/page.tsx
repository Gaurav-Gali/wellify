"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CLOSED_T = 0.04;
const OPEN_T = 0.065;
const EMA_ALPHA = 0.2;
const FEEDBACK_MIN_HOLD_MS = 250;

export default function BreathingExercise() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"] as const;
    const durations = [4000, 3000, 4000, 3000];
    const totalCycle = durations.reduce((a, b) => a + b, 0);

    const [phaseIndex, setPhaseIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [overallScore, setOverallScore] = useState(
        typeof window !== "undefined" ? Number(localStorage.getItem("overallScore") || 0) : 0
    );
    const [isRunning, setIsRunning] = useState(false);

    const startTimeRef = useRef<number>(0);
    const lastCycleRef = useRef(0);
    const rafIdRef = useRef<number>(0);

    const [feedback, setFeedback] = useState("Get ready...");
    const [isCorrect, setIsCorrect] = useState(true);

    const emaMouthRef = useRef(0);
    const lastFlipRef = useRef<number>(0);
    const phaseIndexRef = useRef(0);
    const lastMsgRef = useRef<string>("");

    const faceMeshRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);

    // Phase clock + score calculation
    useEffect(() => {
        if (!isRunning) return;

        if (!startTimeRef.current) startTimeRef.current = performance.now();

        const tick = (t: number) => {
            if (!isRunning) return;

            const elapsed = (t - startTimeRef.current) % totalCycle;
            let acc = 0;
            let idx = 0;
            for (let i = 0; i < durations.length; i++) {
                acc += durations[i];
                if (elapsed < acc) {
                    idx = i;
                    break;
                }
            }

            if (idx !== phaseIndexRef.current) {
                phaseIndexRef.current = idx;
                setPhaseIndex(idx);
            }

            // Calculate cycles completed and update score
            const elapsedTotal = t - startTimeRef.current;
            const cyclesCompleted = Math.floor(elapsedTotal / totalCycle);
            if (cyclesCompleted > lastCycleRef.current) {
                const increment = 2;
                setScore((prev) => prev + increment);

                const newOverall = overallScore + increment;
                localStorage.setItem("overallScore", newOverall.toString());
                setOverallScore(newOverall);

                lastCycleRef.current = cyclesCompleted;
            }

            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafIdRef.current);
    }, [isRunning, overallScore]);

    // Load Mediapipe Face Mesh
    useEffect(() => {
        if (!isRunning) return;

        let initialized = false;

        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const s = document.createElement("script");
                s.src = src;
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => reject(`Failed to load ${src}`);
                document.body.appendChild(s);
            });

        async function init() {
            try {
                if (initialized) return;
                initialized = true;

                await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");
                await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
                await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");

                // @ts-ignore
                const FaceMesh = (window as any).FaceMesh;
                // @ts-ignore
                const Camera = (window as any).Camera;

                if (!FaceMesh || !Camera) return;

                const faceMeshInstance = new FaceMesh({
                    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });

                faceMeshInstance.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                faceMeshInstance.onResults(onResults);
                faceMeshRef.current = faceMeshInstance;

                if (videoRef.current) {
                    cameraRef.current = new Camera(videoRef.current, {
                        onFrame: async () => {
                            if (isRunning) await faceMeshInstance.send({ image: videoRef.current! });
                        },
                        width: 480,
                        height: 480,
                    });
                    cameraRef.current.start();
                }
            } catch (err) {
                console.error("Mediapipe load error:", err);
            }
        }

        init();

        return () => {
            try {
                const stream = videoRef.current?.srcObject as MediaStream | undefined;
                stream?.getTracks().forEach((t) => t.stop());
                cameraRef.current?.stop();
            } catch {}
        };
    }, [isRunning]);

    function onResults(results: any) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

        const landmarks = results.multiFaceLandmarks[0];

        // @ts-ignore
        const drawConnectors = (window as any).drawConnectors;
        // @ts-ignore
        const drawLandmarks = (window as any).drawLandmarks;
        // @ts-ignore
        const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;

        if (drawConnectors && drawLandmarks) {
            drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: "#22D3EE", lineWidth: 1 });
            drawLandmarks(ctx, landmarks, { color: "#38BDF8", radius: 2 });
        }

        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        const topFace = landmarks[10];
        const chin = landmarks[152];

        if (!(upperLip && lowerLip && topFace && chin)) return;

        const faceH = Math.abs(chin.y - topFace.y) * canvas.height || 1;
        const rawMouth = Math.abs(lowerLip.y - upperLip.y) * canvas.height;
        const mouthNorm = rawMouth / faceH;

        const prev = emaMouthRef.current || mouthNorm;
        const ema = EMA_ALPHA * mouthNorm + (1 - EMA_ALPHA) * prev;
        emaMouthRef.current = ema;

        const now = performance.now();
        const elapsed = (now - startTimeRef.current) % totalCycle;
        let acc = 0;
        let idx = 0;
        for (let i = 0; i < durations.length; i++) {
            acc += durations[i];
            if (elapsed < acc) {
                idx = i;
                break;
            }
        }
        if (idx !== phaseIndexRef.current) {
            phaseIndexRef.current = idx;
            setPhaseIndex(idx);
        }

        let correct = true;
        let msg = "";

        if (idx === 0) {
            correct = ema < CLOSED_T;
            msg = correct ? "Inhale through nose" : "Keep mouth closed while inhaling";
        } else if (idx === 1) {
            correct = ema < CLOSED_T;
            msg = correct ? "Hold steady" : "Close mouth during hold";
        } else if (idx === 2) {
            correct = ema > OPEN_T;
            msg = correct ? "Exhale through mouth" : "Open mouth and exhale slowly";
        } else {
            correct = ema < CLOSED_T;
            msg = correct ? "Hold after exhale" : "Close mouth for the hold";
        }

        const since = now - (lastFlipRef.current || 0);
        if (msg !== lastMsgRef.current) {
            lastMsgRef.current = msg;
            setFeedback(msg);
        }
        if (since > FEEDBACK_MIN_HOLD_MS) {
            lastFlipRef.current = now;
            setIsCorrect(correct);
        }
    }

    const targetScale = phaseIndex === 0 || phaseIndex === 1 ? 1.4 : 0.6;

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-zinc-900 p-6">
            <div className="mb-12 relative bottom-20 text-center text-3xl font-bold text-zinc-100 drop-shadow-lg">
                {phases[phaseIndex]}
            </div>

            <div className="relative flex items-center justify-center">
                <motion.div
                    animate={{ scale: targetScale }}
                    transition={{ duration: durations[phaseIndex] / 1000, ease: "easeInOut" }}
                    className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full bg-cyan-500/30 backdrop-blur-lg"
                />
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full rounded-full object-cover" />
                    <canvas ref={canvasRef} width={480} height={480} className="absolute top-0 left-0 w-full h-full" />
                </div>
            </div>

            {/* Feedback + Buttons Row */}
            <div className="mt-24 flex items-center justify-center space-x-6">
                <button
                    onClick={() => setIsRunning((prev) => !prev)}
                    className="px-6 py-3 rounded-xl bg-red-700 text-white font-bold shadow-lg hover:bg-red-800 transition-colors w-32"
                >
                    {isRunning ? "Stop" : "Start"}
                </button>

                <div
                    className={`px-10 py-3 rounded-2xl text-xl font-bold shadow-lg transition-colors text-center w-96 ${
                        isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                >
                    {feedback}
                </div>

                <div className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold shadow-lg w-32 text-center">
                    Score: {score}
                </div>
            </div>
        </div>
    );
}