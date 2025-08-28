"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, User, Trophy, List, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const BottomNav: React.FC = () => {
    const router = useRouter();
    const { isSignedIn } = useUser();

    if (!isSignedIn) return null;

    const navItems = [
        { name: "Home", icon: <Home size={20} />, path: "/" },
        { name: "Stats", icon: <User size={20} />, path: "/user-stat" },
        { name: "Quests", icon: <List size={20} />, path: "/quests" },
        { name: "Leader", icon: <Trophy size={20} />, path: "/leader" },
    ];

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-2">
            <Card className="rounded-xl">
                <div className="flex flex-wrap justify-between items-center w-full max-w-md px-4 py-0 pointer-events-auto gap-2">
                    {navItems.slice(0, 2).map((item) => (
                        <Button
                            key={item.name}
                            variant="ghost"
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center justify-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors flex-1 min-w-[50px]"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Button>
                    ))}

                    {/* Centered Create Button */}
                    <Button
                        onClick={() => router.push("/message")}
                        className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer hover:scale-105 transition-transform mx-2"
                    >
                        <MessageCircle size={24} />
                    </Button>

                    {navItems.slice(2).map((item) => (
                        <Button
                            key={item.name}
                            variant="ghost"
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center justify-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors flex-1 min-w-[50px]"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default BottomNav;
