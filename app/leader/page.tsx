"use client";

import React from "react";
import {Card} from "@/components/ui/card";
import { FaCrown } from "react-icons/fa";

const leaderboardData = [
    { id: 1, name: "Alice", score: 980 },
    { id: 2, name: "Bob", score: 870 },
    { id: 3, name: "Charlie", score: 820 },
    { id: 4, name: "David", score: 760 },
    { id: 5, name: "Ella", score: 700 },
    { id: 6, name: "Frank", score: 650 },
    { id: 7, name: "Grace", score: 620 },
    { id: 8, name: "Hannah", score: 590 },
    { id: 9, name: "Ian", score: 560 },
    { id: 10, name: "Jack", score: 540 },
    { id: 11, name: "Kate", score: 520 },
];

const Leaderboard = () => {
    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">🏆 Leaderboard</h1>

            {/* Top 3 Section */}
            <div className="flex justify-center items-end gap-8 mb-12">
                {/* 2nd Place */}
                <Card className="p-6 w-40 text-center">
                    <div className="text-lg font-bold">🥈 {leaderboardData[1].name}</div>
                    <p className="text-gray-600">Score: {leaderboardData[1].score}</p>
                </Card>

                {/* 1st Place */}
                <Card className="p-8 w-52 text-center relative">
                    <FaCrown className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 text-3xl" />
                    <div className="text-xl font-bold">🥇 {leaderboardData[0].name}</div>
                    <p className="text-gray-600">Score: {leaderboardData[0].score}</p>
                </Card>

                {/* 3rd Place */}
                <Card className="p-6 w-40 text-center">
                    <div className="text-lg font-bold">🥉 {leaderboardData[2].name}</div>
                    <p className="text-gray-600">Score: {leaderboardData[2].score}</p>
                </Card>
            </div>

            {/* Remaining Entries */}
            <div className="w-full max-w-lg flex flex-col gap-4">
                {leaderboardData.slice(3).map((user, index) => (
                    <Card key={user.id} className="p-4 flex justify-between items-center">
                        <span className="font-bold">{index + 4}. {user.name}</span>
                        <span className="text-gray-600">Score: {user.score}</span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
