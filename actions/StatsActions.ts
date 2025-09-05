"use server";

import { db } from "@/db/drizzle";
import { stats } from "@/db/schema";
import { eq } from "drizzle-orm";

type StatEntry = {
    userId: string;
    steps: number;
    spo2: number;
    stress: number;
    waterIntake: number;
    calories: number;
    inactivity: number;
};

// ✅ Create / Add stats
export async function addStats(data: StatEntry) {
    try {
        await db.insert(stats).values(data);
        return { success: true, message: "Stats added successfully" };
    } catch (err) {
        console.error("Error adding stats:", err);
        return { success: false, message: "Failed to add stats" };
    }
}

// ✅ Read stats by userId
export async function getStats(userId: string) {
    try {
        const result = await db
            .select()
            .from(stats)
            .where(eq(stats.userId, userId));
        return { success: true, data: result };
    } catch (err) {
        console.error("Error fetching stats:", err);
        return { success: false, message: "Failed to fetch stats" };
    }
}

// ✅ Update stats by userId
export async function updateStats(userId: string, data: Partial<StatEntry>) {
    try {
        await db.update(stats).set(data).where(eq(stats.userId, userId));
        return { success: true, message: "Stats updated successfully" };
    } catch (err) {
        console.error("Error updating stats:", err);
        return { success: false, message: "Failed to update stats" };
    }
}
