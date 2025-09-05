"use client";
import { useEffect, useRef, useState } from "react";

export default function NeckExercise() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [running, setRunning] = useState(true);

    const pattern: ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"];
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [overallScore, setOverallScore] = useState(
        typeof window !== "undefined" ? Number(localStorage.getItem("overallScore") || 0) : 0
    );
    const [status, setStatus] = useState("Initializing...");
    const stepTimeoutRef = useRef<number | null>(null);
    const holdTimeoutRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const lastCorrectRef = useRef(false);
    const smoothedPitchRef = useRef<number | null>(null);
    const smoothedYawRef = useRef<number | null>(null);
    const baselinePitchRef = useRef<number | null>(null);

    const EMA_ALPHA = 0.15;
    const CALIBRATION_FRAMES = 30;
    const DELTA_PITCH_THRES = 2;
    const DELTA_YAW_THRES = 6;
    const REQUIRED_HOLD_MS = 2000;

    useEffect(() => {
        if (!running) {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
            setStatus("Stopped");
            return;
        }

        let calibrationCount = 0;

        async function startPose() {
            if (!videoRef.current || !canvasRef.current) return;

            if (!(window as any).Pose) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js";
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => reject();
                    document.body.appendChild(script);
                });
            }

            const Pose = (window as any).Pose;
            if (!Pose) {
                setStatus("Failed to load MediaPipe Pose");
                return;
            }

            const pose = new Pose({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
            });

            pose.setOptions({
                modelComplexity: 0,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")!;

            let calibrationDone = false;

            pose.onResults((results: any) => {
                if (!running) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();

                if (!results.poseLandmarks || results.poseLandmarks.length === 0) {
                    setStatus("Face/Body not detected");
                    lastCorrectRef.current = false;
                    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
                    return;
                }

                ctx.fillStyle = "#00FF00";
                results.poseLandmarks.forEach((lm: any) => {
                    const x = canvas.width * (1 - lm.x);
                    const y = canvas.height * lm.y;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                const leftShoulder = results.poseLandmarks[11];
                const rightShoulder = results.poseLandmarks[12];
                const nose = results.poseLandmarks[0];
                if (!leftShoulder || !rightShoulder || !nose) return;

                const noseX = 1 - nose.x;
                const leftShoulderX = 1 - leftShoulder.x;
                const rightShoulderX = 1 - rightShoulder.x;

                const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
                let headPitch = (nose.y - shoulderMidY) * 100;

                const shoulderMidX = (leftShoulderX + rightShoulderX) / 2;
                let headYaw = (noseX - shoulderMidX) * 100;

                smoothedPitchRef.current =
                    smoothedPitchRef.current === null
                        ? headPitch
                        : EMA_ALPHA * headPitch + (1 - EMA_ALPHA) * smoothedPitchRef.current;
                smoothedYawRef.current =
                    smoothedYawRef.current === null
                        ? headYaw
                        : EMA_ALPHA * headYaw + (1 - EMA_ALPHA) * smoothedYawRef.current;

                headPitch = smoothedPitchRef.current;
                headYaw = smoothedYawRef.current;

                if (!calibrationDone) {
                    if (calibrationCount < CALIBRATION_FRAMES) {
                        baselinePitchRef.current =
                            baselinePitchRef.current === null
                                ? headPitch
                                : (baselinePitchRef.current * calibrationCount + headPitch) / (calibrationCount + 1);
                        calibrationCount++;
                        setStatus(`Calibrating... Hold still (${calibrationCount}/${CALIBRATION_FRAMES})`);
                        return;
                    } else {
                        calibrationDone = true;
                        setStatus("Calibration complete. Start moving your neck!");
                        return;
                    }
                }

                if (baselinePitchRef.current === null) return;

                const deltaPitch = headPitch - baselinePitchRef.current;
                const deltaYaw = headYaw;
                const exercise = pattern[currentStep];
                let correct = false;

                switch (exercise) {
                    case "up":
                        if (deltaPitch < -DELTA_PITCH_THRES) correct = true;
                        break;
                    case "down":
                        if (deltaPitch > DELTA_PITCH_THRES) correct = true;
                        break;
                    case "left":
                        if (deltaYaw < -DELTA_YAW_THRES) correct = true;
                        break;
                    case "right":
                        if (deltaYaw > DELTA_YAW_THRES) correct = true;
                        break;
                }

                setStatus(`Move: ${exercise.toUpperCase()} | ${correct ? "✅ Hold steady..." : "❌ Please move"} | Score: ${score}`);

                if (correct && !lastCorrectRef.current) {
                    if (!holdTimeoutRef.current) {
                        holdTimeoutRef.current = window.setTimeout(() => {
                            // Update score
                            setScore((prev) => prev + 1);

                            // Update overall score in localStorage
                            const newOverall = overallScore + 1;
                            localStorage.setItem("overallScore", newOverall.toString());
                            setOverallScore(newOverall);

                            setCurrentStep((prev) => (prev + 1) % pattern.length);
                            lastCorrectRef.current = false;
                            holdTimeoutRef.current = null;
                        }, REQUIRED_HOLD_MS);
                    }
                    lastCorrectRef.current = true;
                } else if (!correct) {
                    lastCorrectRef.current = false;
                    if (holdTimeoutRef.current) {
                        clearTimeout(holdTimeoutRef.current);
                        holdTimeoutRef.current = null;
                    }
                }
            });

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                video.srcObject = stream;
                await video.play();
                animationFrameIdRef.current = requestAnimationFrame(onFrame);
            } catch {
                setStatus("Camera access denied or unavailable");
            }

            async function onFrame() {
                if (!video) return;
                await pose.send({ image: video });
                animationFrameIdRef.current = requestAnimationFrame(onFrame);
            }
        }

        if (running) startPose();

        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        };
    }, [currentStep, score, running, overallScore]);

    return (
        <div className="flex items-center justify-center w-[700px] h-[700px] overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className=" inset-0 w-full h-full object-cover"
            />
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full"
            />
            <div className="absolute top-[75px] left-1/2 -translate-x-1/2 mt-8 w-[90%] max-w-2xl p-4 rounded-2xl bg-zinc-800/50 backdrop-blur-md border border-zinc-700 shadow-lg text-center text-white font-bold text-lg">
                <div>{status}</div>
                <div className="mt-2 text-cyan-300 text-xl">Score: {score}</div>
            </div>
            <button
                onClick={() => setRunning((prev) => !prev)}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl bg-cyan-600/70 hover:bg-cyan-600/90 text-white font-bold shadow-lg transition-colors"
            >
                {running ? "Stop" : "Start"}
            </button>
        </div>
    );
}