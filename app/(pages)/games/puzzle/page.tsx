"use client";

import React, { useState, useRef, useEffect } from "react";

type Tile = {
    id: number;
    row: number;
    col: number;
    correctRow: number;
    correctCol: number;
    img?: HTMLCanvasElement;
};

const PuzzleGame = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [emptyPos, setEmptyPos] = useState({ row: 0, col: 0 });
    const [snapshotTaken, setSnapshotTaken] = useState(false);
    const [points, setPoints] = useState(0);
    const [cameraError, setCameraError] = useState(false);
    const [gridSize, setGridSize] = useState(3);
    const [puzzleCompleted, setPuzzleCompleted] = useState(false);
    const [overallScore, setOverallScore] = useState(
        typeof window !== "undefined" ? Number(localStorage.getItem("overallScore") || 0) : 0
    );

    const VIDEO_SIZE = 512; // bigger canvas

    // Start webcam
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: VIDEO_SIZE, height: VIDEO_SIZE },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                setCameraError(true);
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const captureSnapshot = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = VIDEO_SIZE;
        canvas.height = VIDEO_SIZE;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const tileWidth = canvas.width / gridSize;
        const tileHeight = canvas.height / gridSize;

        const newTiles: Tile[] = [];

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (row === gridSize - 1 && col === gridSize - 1) continue;

                const tileCanvas = document.createElement("canvas");
                tileCanvas.width = tileWidth;
                tileCanvas.height = tileHeight;
                const tileCtx = tileCanvas.getContext("2d");

                if (tileCtx) {
                    tileCtx.drawImage(
                        canvas,
                        col * tileWidth,
                        row * tileHeight,
                        tileWidth,
                        tileHeight,
                        0,
                        0,
                        tileWidth,
                        tileHeight
                    );
                }

                newTiles.push({
                    id: row * gridSize + col,
                    row,
                    col,
                    correctRow: row,
                    correctCol: col,
                    img: tileCanvas,
                });
            }
        }

        shuffleTiles(newTiles);
        setTiles(newTiles);
        setSnapshotTaken(true);
        setPuzzleCompleted(false);
    };

    // Shuffle tiles
    const shuffleTiles = (tileArray: Tile[]) => {
        let currentEmpty = { row: gridSize - 1, col: gridSize - 1 };

        for (let i = 0; i < 100; i++) {
            const possibleMoves = [];

            for (const tile of tileArray) {
                const { row, col } = tile;
                const { row: erow, col: ecol } = currentEmpty;

                const canMove =
                    (row === erow && Math.abs(col - ecol) === 1) ||
                    (col === ecol && Math.abs(row - erow) === 1);

                if (canMove) possibleMoves.push(tile);
            }

            if (possibleMoves.length > 0) {
                const randomTile = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const oldRow = randomTile.row;
                const oldCol = randomTile.col;

                randomTile.row = currentEmpty.row;
                randomTile.col = currentEmpty.col;

                currentEmpty = { row: oldRow, col: oldCol };
            }
        }

        setEmptyPos(currentEmpty);
    };

    const moveTile = (tile: Tile) => {
        if (puzzleCompleted) return;

        const { row, col } = tile;
        const { row: erow, col: ecol } = emptyPos;

        const canMove =
            (row === erow && Math.abs(col - ecol) === 1) ||
            (col === ecol && Math.abs(row - erow) === 1);

        if (!canMove) return;

        setTiles((prev) =>
            prev.map((t) => {
                if (t.id === tile.id) return { ...t, row: erow, col: ecol };
                return t;
            })
        );
        setEmptyPos({ row, col });

        setTimeout(() => checkSolved(), 100);
    };

    const checkSolved = () => {
        const isSolved = tiles.every((tile) => tile.row === tile.correctRow && tile.col === tile.correctCol);

        if (isSolved && !puzzleCompleted) {
            const pointsEarned = gridSize * gridSize * 10;
            setPoints((prev) => prev + pointsEarned);
            setPuzzleCompleted(true);

            // Update overall score in localStorage
            const newOverall = overallScore + pointsEarned;
            localStorage.setItem("overallScore", newOverall.toString());
            setOverallScore(newOverall);

            alert(`🎉 Puzzle Solved! +${pointsEarned} points`);
        }
    };

    const resetGame = () => {
        setSnapshotTaken(false);
        setTiles([]);
        setEmptyPos({ row: gridSize - 1, col: gridSize - 1 });
        setPuzzleCompleted(false);
    };

    if (cameraError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 p-4">
                <h2 className="text-2xl text-white mb-4">Camera Access Required</h2>
                <p className="text-zinc-400 text-center">Please allow camera permissions and refresh the page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  p-4 gap-4">
            {!snapshotTaken ? (
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-white text-2xl mb-4">Sliding Puzzle Game</h1>

                    <label className="text-white mb-2">
                        Select Puzzle Size:
                        <select
                            className="ml-2 rounded px-2 py-1 bg-zinc-800 text-white"
                            value={gridSize}
                            onChange={(e) => setGridSize(parseInt(e.target.value))}
                        >
                            <option value={2}>2x2</option>
                            <option value={3}>3x3</option>
                            <option value={4}>4x4</option>
                        </select>
                    </label>

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-96 h-96 object-cover rounded-lg border-2 border-zinc-700"
                    />
                    <button
                        onClick={captureSnapshot}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        📸 Capture & Start Puzzle
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-white text-xl">Arrange the tiles to complete the picture!</h2>
                    <div
                        className="relative bg-zinc-800 rounded-lg border-2 border-zinc-700 grid gap-1 p-1"
                        style={{
                            width: VIDEO_SIZE,
                            height: VIDEO_SIZE,
                            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        }}
                    >
                        {tiles.map((tile) => (
                            <div
                                key={tile.id}
                                className="cursor-pointer hover:opacity-80 transition-opacity rounded"
                                style={{
                                    gridRowStart: tile.row + 1,
                                    gridColumnStart: tile.col + 1,
                                }}
                                onClick={() => moveTile(tile)}
                            >
                                {tile.img && (
                                    <img
                                        src={tile.img.toDataURL()}
                                        alt={`tile-${tile.id}`}
                                        className="w-full h-full object-cover rounded"
                                        draggable={false}
                                    />
                                )}
                            </div>
                        ))}
                        <div
                            className="bg-zinc-700 rounded border-2 border-dashed border-zinc-500"
                            style={{
                                gridRowStart: emptyPos.row + 1,
                                gridColumnStart: emptyPos.col + 1,
                            }}
                        />
                    </div>

                    <div className="flex gap-4 items-center mt-2">
                        <div className="text-white text-lg">Points: {points}</div>
                        <div className="text-white text-lg">Overall: {overallScore}</div>
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            🔄 New Game
                        </button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default PuzzleGame;