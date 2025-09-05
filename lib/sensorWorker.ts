import fetch from "node-fetch";
import { db } from "@/db/drizzle";
import { stats } from "@/db/schema";

let pollingStarted = false;

export function startSensorPolling(userId: string) {
    if (pollingStarted) return;
    pollingStarted = true;

    async function poll() {
        try {
            const res = await fetch("https://c31555bb57e4.ngrok-free.app/data");
            if (!res.ok) throw new Error("Failed to fetch sensor data");

            const raw = await res.json();

            const enriched = {
                userId,
                steps: raw.steps,
                calories: raw.calories,
                spo2: Math.floor(Math.random() * 3) + 96,
                stress: Math.floor(Math.random() * 40) + 30,
                waterIntake: 1.8,
                inactivity: Math.floor(Math.random() * 40) + 20,
                createdAt: new Date(raw.timestamp),
            };

            await db.insert(stats).values(enriched);
            console.log("Sensor data saved:", enriched);
        } catch (err) {
            console.error("Polling error:", err);
        }
    }

    // Poll every 2 seconds
    setInterval(poll, 2000);
}
