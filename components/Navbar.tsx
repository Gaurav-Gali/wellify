"use client";

import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {  MessageCircle,Coins } from "lucide-react"; // We'll use Coin icon
import { usePathname } from "next/navigation";
import Reminders from "@/components/Reminders";

function Navbar() {
    const { user } = useUser();
    const pathname = usePathname();
    const [rewards, setRewards] = useState<number>(0);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/games", label: "Games" },
        { href: "/quests", label: "Quests" },
        { href: "/leaderboard", label: "Leaderboard" },
    ];

    // Fetch rewards from localStorage
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "overallScore") {
                setRewards(Number(e.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // initialize
        const score = localStorage.getItem("overallScore");
        if (score) setRewards(Number(score));

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);


    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl z-50">
            <div className="backdrop-blur-xl bg-zinc-900/30 border border-zinc-800 rounded-3xl shadow-2xl px-8 py-4 flex items-center justify-between">
                {/* Left logo + nav links */}
                <div className="flex items-center space-x-10">
                    <Link
                        href="/dashboard"
                        className="text-zinc-100 text-xl font-thin tracking-wide hover:text-zinc-300 transition"
                    >
                        Wellify
                    </Link>

                    <div className="flex items-center space-x-8 text-md font-light">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`transition relative ${
                                        isActive
                                            ? "text-green-300 font-medium"
                                            : "text-zinc-200 hover:text-zinc-300"
                                    }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-green-300/50 rounded"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right UserButton + Notifications */}
                <div className="flex items-center space-x-4">
                    {/* Rewards + Chat */}
                    <div className="flex items-center gap-4">
                        {/* Rewards */}
                        {/*<div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/20 backdrop-blur-sm rounded-full border border-yellow-300 shadow-md text-black font-semibold">*/}
                        {/*    <Coins className="w-4 h-4 text-yellow-400" />*/}
                        {/*    <span className={"text-zinc-200"}>{rewards}</span>*/}
                        {/*</div>*/}

                        {/* Chat Icon */}
                        <Link
                            href={"/message"}
                            className="relative p-2 cursor-pointer rounded-full hover:bg-zinc-800/50 transition"
                        >
                            <MessageCircle className="w-5 h-5 text-zinc-200" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                        </Link>
                    </div>

                    <Reminders />

                    <div className="flex items-center justify-center gap-1.5">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonBox:
                                        "bg-zinc-800/40 backdrop-blur-xl rounded-full border border-zinc-700",
                                },
                            }}
                        />
                        {user && (
                            <span className="text-zinc-200 text-md font-light hidden sm:inline">
                                {`${user.firstName} ${user.lastName}` || user.username}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
