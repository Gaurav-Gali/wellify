"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Player = {
    id: string | number;
    name: string;
    score: number;
};

// Mock other players
const players: Player[] = [
    { id: 1, name: "Alice", score: 48 },
    { id: 2, name: "Bob", score: 45 },
    { id: 3, name: "Carol", score: 40 },
    { id: 4, name: "David", score: 38 },
    { id: 5, name: "Eve", score: 66 },
    { id: 6, name: "Frank", score: 33 },
    { id: 7, name: "Grace", score: 30 },
    { id: 8, name: "Hank", score: 28 },
    { id: 9, name: "Ivy", score: 25 },
    { id: 10, name: "Jack", score: 22 },
    { id: 11, name: "Kara", score: 72 },
    { id: 12, name: "Leo", score: 18 },
    { id: 13, name: "Mia", score: 55 },
    { id: 14, name: "Nina", score: 62 },
    { id: 15, name: "Oscar", score: 10 },
    { id: 16, name: "Paul", score: 8 },
    { id: 17, name: "Quinn", score: 5 },
    { id: 18, name: "Rita", score: 3 },
    { id: 19, name: "Sam", score: 2 },
    { id: 20, name: "Tina", score: 1 },
];

export default function Leaderboard() {
    const { user } = useUser();
    const [overallScore, setOverallScore] = useState(0);

    useEffect(() => {
        const storedScore = Number(localStorage.getItem("overallScore") || 0);
        setOverallScore(storedScore);
    }, []);

    const currentUser: Player = user
        ? { id: user.id, name: user.firstName || "You", score: overallScore }
        : { id: "guest", name: "You", score: overallScore };

    const sortedPlayers = [currentUser, ...players].sort((a, b) => b.score - a.score);
    const currentUserRank = sortedPlayers.findIndex((p) => p.id === currentUser.id) + 1;
    const topThree = sortedPlayers.slice(0, 3);
    const others = sortedPlayers.slice(3);

    const podiumColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Gold, Silver, Bronze
    const podiumHeights = [60, 50, 40]; // Heights for 1st, 2nd, 3rd

    return (
        <div className="flex justify-center items-start p-6">
            <div className="w-full  max-w-5xl  backdrop-blur-xl border border-zinc-700 rounded-3xl">
                <h1 className="text-4xl font-extrabold text-center text-zinc-100 mb-6 tracking-wide p-4">
                    Leaderboard
                </h1>

                {/* Podium Top 3 Sticky */}
                <div className="sticky top-0 z-10 backdrop-blur-xl p-6 border-b border-zinc-700 flex justify-center items-end gap-8">
                    {topThree.map((player, idx) => {
                        const isCurrentUser = player.id === currentUser.id;

                        // gradient colors for podium
                        const podiumGradient =
                            idx === 0
                                ? "bg-gradient-to-t from-yellow-400 via-yellow-300 to-yellow-500"
                                : idx === 1
                                    ? "bg-gradient-to-t from-gray-300 via-gray-200 to-gray-400"
                                    : "bg-gradient-to-t from-amber-600 via-amber-500 to-orange-700";

                        const glow =
                            idx === 0
                                ? "shadow-[0_0_15px_rgba(255,215,0,0.7)]"
                                : idx === 1
                                    ? "shadow-[0_0_12px_rgba(192,192,192,0.6)]"
                                    : "shadow-[0_0_12px_rgba(205,127,50,0.6)]";

                        return (
                            <div key={player.id} className="flex flex-col items-center relative hover:scale-105 transition-transform duration-300">
                                {/* Medal */}
                                <div
                                    className={`absolute -top-10 text-3xl animate-bounce`}
                                    style={{ color: podiumColors[idx] }}
                                >
                                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                </div>

                                {/* Player Card */}
                                <div
                                    className={`w-36 p-5 rounded-2xl backdrop-blur-md border border-zinc-700 flex flex-col items-center transition-transform duration-300 ${
                                        isCurrentUser
                                            ? "bg-cyan-800/60 border-cyan-400 text-yellow-200 scale-105 animate-pulse"
                                            : "bg-zinc-800/60 text-zinc-100"
                                    }`}
                                >
                                    {isCurrentUser && (
                                        <span className="absolute -top-4 right-2 bg-cyan-500 text-zinc-950 font-bold px-2 py-0.5 rounded-xl text-xs">
              YOU
            </span>
                                    )}
                                    <p className="font-extrabold text-lg">{player.name}</p>
                                    <p className="text-sm mt-1">{player.score} pts</p>
                                    {isCurrentUser && (
                                        <p className="text-xs text-yellow-200 mt-1">Rank #{currentUserRank}</p>
                                    )}
                                </div>

                                {/* Podium Block */}
                                <div
                                    className={`w-36 rounded-t-3xl flex items-center justify-center mt-3 ${podiumGradient} ${glow}`}
                                    style={{
                                        height: `${podiumHeights[idx] + 20}px`, // slightly higher for gamey feel
                                        clipPath: "polygon(15% 100%, 85% 100%, 100% 0, 0 0)", // trapezoid
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>


                {/* Scrollable Other Players */}
                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3">
                    {others.map((player, idx) => {
                        const isCurrentUser = player.id === currentUser.id;
                        return (
                            <div
                                key={player.id}
                                className={`flex justify-between items-center px-6 py-3 rounded-2xl border border-zinc-700 backdrop-blur-md transition-all duration-300 transform ${
                                    isCurrentUser
                                        ? "bg-cyan-800/40 text-yellow-200 font-semibold"
                                        : "bg-zinc-800/40 text-zinc-200 hover:bg-zinc-700/40"
                                }`}
                            >
                                <span className="font-medium">{idx + 4}. {player.name}</span>
                                <span className="font-medium">{player.score} pts</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
