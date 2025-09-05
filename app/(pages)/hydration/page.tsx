"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {useAtom} from "jotai";
import {StatsAtom} from "@/store/ReminderStore";

function Page() {
    const [stats,setStats] = useAtom(StatsAtom);
    const [waterIntake, setWaterIntake] = useState(250); // ml
    const [submitted, setSubmitted] = useState(false);

    // Mock data for comparison
    const othersData = [
        { name: "Alice", intake: 1800 },
        { name: "Bob", intake: 2200 },
        { name: "Charlie", intake: 1500 },
        { name: "You", intake: waterIntake },
    ];

    const handleSave = () => {
        setSubmitted(true);

        // Update the Jotai atom
        setStats({ ...(stats || {}), waterIntake: Number(waterIntake) });

        // Persist to localStorage
        localStorage.setItem("waterIntake", waterIntake.toString());
    };


    return (
        <div className="min-h-screen text-zinc-200 flex flex-col items-center py-12 px-4">
            <Card className="w-full max-w-6xl bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md">
                <CardHeader className="flex items-center gap-2">
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <CardTitle className="text-xl font-semibold text-zinc-100">Water Tracker</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Slider */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">
                            How much water did you drink? (ml)
                        </label>
                        <Slider
                            value={[waterIntake]}
                            onValueChange={(val) => setWaterIntake(val[0])}
                            min={100}
                            max={3000}
                            step={50}
                            className="w-full"
                        />
                        <p className="mt-2 text-center text-lg font-medium text-blue-400">
                            {waterIntake} ml
                        </p>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        Save Intake
                    </Button>

                    {/* Chart */}
                    {submitted && (
                        <div className="mt-6 w-full h-80 bg-zinc-900/40 border border-zinc-800 rounded-xl backdrop-blur-md p-4">
                            <h2 className="text-md text-zinc-400 mb-3">
                                Comparison with others
                            </h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={othersData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#a1a1aa"
                                        tick={{ fill: "#a1a1aa" }}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        tick={{ fill: "#a1a1aa" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(24,24,27,0.95)",
                                            border: "1px solid #27272a",
                                            borderRadius: "8px",
                                            color: "#e4e4e7",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="intake"
                                        stroke="#22c55e" // green
                                        strokeWidth={3}
                                        dot={{ fill: "#22c55e" }}
                                        activeDot={{ r: 6, fill: "#22c55e" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Page;
