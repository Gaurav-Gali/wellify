"use client";

import React from "react";
import Link from "next/link";

type Game = {
    id: string;
    name: string;
    description: string;
    path: string; // relative URL to the game page
};

const games: Game[] = [
    { id: "1", name: "Puzzle", description: "Test your memory and problem solving skills", path: "/games/puzzle" },
    { id: "2", name: "Breathing Exercise", description: "Relieves your stress and calms you down", path: "/games/breathing" },
    { id: "3", name: "Stretching Exercise", description: "Relaxes your neck muscles", path: "/games/stretch" },
];

const Page: React.FC = () => {
    return (
        <div className="min-h-screen p-8 flex flex-col gap-6">
            <h1 className="text-3xl text-zinc-100 font-semibold mb-4">Game Library</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                    <Link key={game.id} href={game.path} className="group">
                        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800/30 transition shadow-lg flex flex-col gap-3 cursor-pointer">
                            <h2 className="text-xl text-zinc-100 font-semibold">{game.name}</h2>
                            <p className="text-zinc-300 text-sm">{game.description}</p>
                            <span className="text-zinc-400 text-xs mt-auto">
                                Go to Game &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Page;
