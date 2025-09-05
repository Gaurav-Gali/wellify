import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(req: NextRequest) {
    try {
        const { user_input, user_stats } = await req.json();

        const prompt = `User Stats: ${JSON.stringify(user_stats)}\nUser Message: ${user_input}`;

        // Escape quotes properly
        const command = `ollama chat qwen2.5-coder:1.5b --prompt "${prompt.replace(/"/g, '\\"')}"`;

        const responseText: string = await new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) return reject(stderr);
                resolve(stdout.trim());
            });
        });

        return NextResponse.json({ response: responseText });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to query Ollama model" }, { status: 500 });
    }
}
