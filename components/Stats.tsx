"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type StatsProps = {
    steps: number;
    spo2: number;
    stress: number; // 0–100
    water: number; // liters
    calories: number;
    inactivity: number; // 0-100
    cumulativeScore: number; // user score
    avgScore: number;        // average of all users
    idealScore: number;      // ideal score
};

type ScoreData = {
    day: string;
    userScore: number;
    avgScore: number;
    idealScore: number;
};

// Function to generate weekly score data with slight variations
const generateWeeklyData = (userScore: number, avgScore: number, idealScore: number) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
        day,
        userScore: Math.round(userScore + (Math.random() * 4 - 2)), // ±2 variation
        avgScore: Math.round(avgScore + (Math.random() * 4 - 2)),
        idealScore: Math.round(idealScore + (Math.random() * 2 - 1)),
    }));
};

function Stats({
                   steps,
                   spo2,
                   stress,
                   water,
                   calories,
                   inactivity,
                   cumulativeScore,
                   avgScore,
                   idealScore,
               }: StatsProps) {
    const tips: string[] = [];

    if (steps < 5000)
        tips.push("Try to walk at least 5,000–10,000 steps daily 🚶‍♂️");
    else tips.push("Great job staying active! Keep it up 💪");

    if (spo2 < 95)
        tips.push(
            "Your SPO₂ seems low. Practice deep breathing 🌬️ and consult a doctor if needed."
        );
    else tips.push("Your oxygen levels look healthy! 🌿");

    if (stress > 70)
        tips.push("Consider meditation, yoga 🧘, or short breaks to reduce stress.");
    else tips.push("Your stress levels are in control — keep maintaining balance!");

    if (water < 2)
        tips.push("Drink more water 💧. Aim for at least 2–3 liters daily.");
    else tips.push("Good hydration! Keep sipping water throughout the day.");

    if (calories < 1500)
        tips.push("Make sure you're eating enough calories for your daily needs 🍎");
    else tips.push("Good calorie intake! Keep maintaining a balanced diet.");

    if (inactivity > 60)
        tips.push("Try to reduce sedentary time. Take breaks every hour 🏃‍♀️");
    else tips.push("Great job staying active throughout the day!");

    // Generate weekly chart data
    const weeklyData = generateWeeklyData(cumulativeScore, avgScore, idealScore);

    return (
        <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Steps Walked</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{steps}</CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>SPO₂</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{spo2}%</CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Stress Levels</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{stress}/100</CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Water Intake</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{water} mL</CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Calories</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{calories}</CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Inactivity</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">{inactivity}%</CardContent>
                </Card>
            </div>

            {/* Score Chart + Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Weekly Cumulative Score</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 20, left: 12, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="day" tick={{ fill: "#fff" }} />
                                <YAxis tick={{ fill: "#fff" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        borderColor: "#27272a",
                                        color: "#e4e4e7",
                                        borderRadius: "0.75rem",
                                        padding: "0.75rem",
                                    }}
                                    formatter={(value: number, name: string) => {
                                        if (name === "userScore") return [value, "Your Score"];
                                        if (name === "avgScore") return [value, "Average Score"];
                                        if (name === "idealScore") return [value, "Ideal Score"];
                                        return [value, name];
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="userScore"
                                    stroke="#00ff88"    // neon green
                                    fill="#00ff8855"    // semi-transparent neon green
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="avgScore"
                                    stroke="#00cfff"    // electric cyan
                                    fill="#00cfff55"    // semi-transparent cyan
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="idealScore"
                                    stroke="#ff9f00"    // bright neon orange
                                    fill="#ff9f0055"    // semi-transparent orange
                                    strokeWidth={2}
                                />



                            </AreaChart>
                        </ResponsiveContainer>

                    </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md text-zinc-100">
                    <CardHeader>
                        <CardTitle>Tips for a Healthier You</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-zinc-300">
                            {tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Stats;
