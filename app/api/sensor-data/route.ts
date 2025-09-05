// app/api/sensor-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

function slightVariation(base: number, variance: number = 2) {
    return Math.round(base + (Math.random() * variance * 2 - variance));
}

export async function GET(req: NextRequest) {
    try {
        const userId = "user_32Dj1V49PjksSEHXUnUXyHrg731";

        const res = await fetch("https://c31555bb57e4.ngrok-free.app/data");
        if (!res.ok) throw new Error(`Failed to fetch sensor data: ${res.statusText}`);
        const raw = await res.json();

        console.log("Raw sensor data:", raw);

        // Generate slightly varied values
        const enriched = {
            id: userId,
            userId: userId,
            steps: raw.steps ?? 0,
            calories: raw.calories ?? 0,
            spo2: slightVariation(98, 1),       // 97-99%
            stress: slightVariation(35, 3),     // 32-38
            waterIntake: 1.8,                   // constant
            inactivity: slightVariation(25, 3), // 22-28
            createdAt: raw.timestamp ? new Date(raw.timestamp) : new Date(),
        };

        console.log("Enriched sensor data:", enriched);

        // Return the enriched data without saving to DB
        return NextResponse.json({ success: true, data: enriched });
    } catch (err) {
        console.error("Sensor-data endpoint error:", err);
        return NextResponse.json(
            { error: "Failed to fetch sensor data", details: String(err) },
            { status: 500 }
        );
    }
}
