"use server";

import { db } from "@/db/drizzle"; // adjust path to your drizzle db instance
import { rewards } from "@/db/schema";
import { eq } from "drizzle-orm";

// ========== ADD ==========
export async function addReward(userId: string, rewardScore: number) {
    try {
        const res = await db
            .insert(rewards)
            .values({
                userId,
                rewardScore,
            })
            .returning();

        return { success: true, data: res[0] };
    } catch (error) {
        console.error("Error adding reward:", error);
        return { success: false, error: "Failed to add reward" };
    }
}

// ========== READ ==========
export async function getRewards(userId: string) {
    try {
        const res = await db
            .select()
            .from(rewards)
            .where(eq(rewards.userId, userId));

        return { success: true, data: res };
    } catch (error) {
        console.error("Error fetching rewards:", error);
        return { success: false, error: "Failed to fetch rewards" };
    }
}

// ========== UPDATE ==========
export async function updateReward(id: string, newScore: number) {
    try {
        const res = await db
            .update(rewards)
            .set({
                rewardScore: newScore,
                updatedAt: new Date(),
            })
            .where(eq(rewards.id, id))
            .returning();

        return { success: true, data: res[0] };
    } catch (error) {
        console.error("Error updating reward:", error);
        return { success: false, error: "Failed to update reward" };
    }
}
