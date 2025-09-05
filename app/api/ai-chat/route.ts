// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { user_input, user_stats } = await req.json();

        const response = await fetch("https://e47b088c8bd4.ngrok-free.app/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_input,
                user_stats,
            }),
        });

        if (!response.ok) {
            throw new Error(`Upstream error: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("AI Chat API Error:", err);
        return NextResponse.json(
            { error: "Failed to connect to AI server" },
            { status: 500 }
        );
    }
}
