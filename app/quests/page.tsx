"use client";
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const DailyQuestsPage = () => {
    const [tasks, setTasks] = useState([]);
    const [completed, setCompleted] = useState({});

    useEffect(() => {
        // generate 4 random tasks daily
        const generatedTasks = [
            "Practice 5 minutes of deep breathing 🧘‍♂️",
            "Write down 3 things you’re grateful for ✨",
            "Take a 10-minute mindful walk 🚶‍♀️",
            "Drink 8 glasses of water today 💧",
        ];
        setTasks(generatedTasks);
    }, []);

    const toggleTask = (index) => {
        setCompleted((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="flex flex-col items-center px-5 mt-5">
            <Card className="w-full max-w-xl border-4 border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-white">
                <CardHeader className="border-b-4 border-black pb-4">
                    <CardTitle className="text-3xl font-bold text-center">
                        🌟 Daily Quests 🌟
                    </CardTitle>
                </CardHeader>
                <CardContent className="mt-6">
                    <ul className="space-y-4">
                        {tasks.map((task, index) => (
                            <li
                                key={index}
                                className={`flex items-center gap-3 p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] ${
                                    completed[index] ? "bg-gray-100 line-through" : "bg-white"
                                }`}
                            >
                                <Checkbox
                                    checked={completed[index] || false}
                                    onCheckedChange={() => toggleTask(index)}
                                    className="border-2 border-black rounded-md w-6 h-6"
                                />
                                <span className="font-medium">{task}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyQuestsPage;
