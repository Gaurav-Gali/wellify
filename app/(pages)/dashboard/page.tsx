"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Stats from "@/components/Stats";
import FeedList from "@/components/FeedList";
import { StatsAtom } from "@/store/ReminderStore";
import { useAtom } from "jotai";
import { Loader } from "lucide-react";

type UserStats = {
    steps: number;
    spo2: number;
    stress: number;
    waterIntake: number;
    calories: number;
    inactivity: number;
    cumulativeScore: number;
    avgScore: number;
    idealScore: number;
};

export default function Page() {
    const { user } = useUser();
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [stats, setStats] = useAtom(StatsAtom);

    useEffect(() => {
        if (!user?.id) return;

        async function fetchSensorData() {
            try {
                const res = await fetch("/api/sensor-data", {
                    headers: { "x-user-id": user.id },
                });
                const data = await res.json();
                if (data.success) {
                    const d = data.data;
                    const waterIntake = Number(localStorage.getItem("waterIntake")) || 0));
// generates 1–3 liters if not in localStorage

                    const computedStats = {
                        steps: d.steps,
                        spo2: d.spo2,
                        stress: d.stress,
                        waterIntake: waterIntake,
                        calories: d.calories,
                        inactivity: d.inactivity,
                        cumulativeScore: 78, // you can compute dynamically
                        avgScore: 70,
                        idealScore: 85,
                    };

                    setUserStats(computedStats);
                    setStats(computedStats);
                }
            } catch (err) {
                console.error("Failed to fetch sensor data", err);
            }
        }

        // Initial fetch
        fetchSensorData();

        // Poll every 2 seconds
        const interval = setInterval(fetchSensorData, 2000);
        return () => clearInterval(interval);
    }, [user?.id, setStats]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-400">
                Please sign in to see your stats
            </div>
        );
    }

    if (!userStats) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-400">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 sm:px-8 lg:px-12 py-6 lg:py-10 space-y-10">
            <section>
                <h1 className="text-3xl sm:text-4xl font-extralight text-zinc-100 mb-6">
                    Your Wellness Dashboard
                </h1>
                <Stats
                    steps={userStats.steps}
                    spo2={userStats.spo2}
                    stress={userStats.stress}
                    water={userStats.waterIntake}
                    calories={userStats.calories}
                    inactivity={userStats.inactivity}
                    cumulativeScore={userStats.cumulativeScore}
                    avgScore={userStats.avgScore}
                    idealScore={userStats.idealScore}
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-light text-zinc-100 border-b border-zinc-800 pb-2">
                    Health & Wellness Feed
                </h2>
                <FeedList />
            </section>
        </div>
    );
}
