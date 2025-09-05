"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { StatsAtom } from "@/store/ReminderStore";

type Quest = {
    id: number;
    title: string;
    agenda: string;
    reward: number;
    completed: boolean;
};

export default function QuestsPage() {
    const [stats] = useAtom(StatsAtom);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loadingQuest, setLoadingQuest] = useState<number | null>(null);
    const [overallScore, setOverallScore] = useState<number>(0);

    // Initialize overallScore from localStorage
    useEffect(() => {
        const storedScore = Number(localStorage.getItem("overallScore") || 0);
        setOverallScore(storedScore);
    }, []);

    // Load quests from localStorage or generate new
    useEffect(() => {
        const storedQuests = localStorage.getItem("quests");
        if (storedQuests) {
            setQuests(JSON.parse(storedQuests));
        } else {
            const fetchQuests = async () => {
                try {
                    const prompt = `
You are a quest generator for a gamified health app.
User stats: ${JSON.stringify(stats)}

Generate 3-4 health or fitness quests based on these stats.
Each quest should have:
- id: unique number
- title: short descriptive title
- agenda: task description
- reward: points (1-50)
- completed: false
**NOTE : ** ONLY CREATE THE TASKS THAT CAN BE EASILY DO ABLE AND EVALUATED BY THE USER SOLELY BASED OF THE USERS STATS!!!

Return ONLY a JSON array of quests. No extra text.
`;

                    const response = await fetch("/api/ai-chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_input: prompt }),
                    });

                    const data = await response.json();
                    const aiQuests: Quest[] = JSON.parse(data?.response || "[]");
                    setQuests(aiQuests);
                    localStorage.setItem("quests", JSON.stringify(aiQuests));
                } catch (err) {
                    console.error("Failed to fetch AI-generated quests:", err);
                }
            };

            fetchQuests();
        }
    }, [stats]);

    const handleToggleQuest = async (quest: Quest) => {
        if (quest.completed) return;

        setLoadingQuest(quest.id);

        try {
            const prompt = `
You are a virtual quest validator. 
User stats: ${JSON.stringify(stats)}
Quest to validate: ${JSON.stringify(quest.agenda)}

Based on the user's stats, should this quest be marked as completed? 
Answer ONLY with "yes" or "no". If unsure, always respond "yes".
`;

            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: prompt }),
            });

            const data = await response.json();
            const aiAnswer = (data?.response || "").trim().toLowerCase();

            if (aiAnswer === "yes") {
                const updatedQuests = quests.map((q) =>
                    q.id === quest.id ? { ...q, completed: true } : q
                );
                setQuests(updatedQuests);
                localStorage.setItem("quests", JSON.stringify(updatedQuests));

                setOverallScore((prevScore) => {
                    const newScore = prevScore + quest.reward;
                    localStorage.setItem("overallScore", newScore.toString());
                    return newScore;
                });
            } else {
                alert("Quest not completed yet! ❌");
            }
        } catch (err) {
            console.error("AI validation failed:", err);
            alert("Failed to validate quest. Try again later.");
        }

        setLoadingQuest(null);
    };

    if (!quests.length) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-200">
                Loading quests...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-6 sm:p-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extralight text-zinc-100 mb-6">
                AI-Suggested Quests
            </h1>

            <div className="text-lg text-cyan-400 font-bold mb-4">
                Overall Score: {overallScore} pts
            </div>

            <div className="w-full max-w-3xl space-y-4">
                {quests.map((quest) => (
                    <div
                        key={quest.id}
                        className={`flex justify-between items-center p-4 bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-700 shadow-lg transition-colors hover:bg-zinc-800/70 ${
                            quest.completed ? "opacity-70" : ""
                        }`}
                    >
                        <div className="flex flex-col">
                            <div
                                className={`text-lg font-semibold ${
                                    quest.completed ? "line-through text-zinc-400" : "text-zinc-100"
                                }`}
                            >
                                {quest.title}
                            </div>
                            <div
                                className={`text-sm text-zinc-400 ${
                                    quest.completed ? "line-through" : ""
                                }`}
                            >
                                {quest.agenda}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-cyan-400 font-bold">{quest.reward} pts</div>
                            <button
                                onClick={() => handleToggleQuest(quest)}
                                disabled={loadingQuest === quest.id}
                                className={`px-4 py-2 rounded-xl text-white transition-colors ${
                                    quest.completed
                                        ? "bg-green-600 cursor-not-allowed"
                                        : "bg-cyan-600 hover:bg-cyan-700"
                                }`}
                            >
                                {loadingQuest === quest.id
                                    ? "Checking..."
                                    : quest.completed
                                        ? "Completed"
                                        : "Complete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
