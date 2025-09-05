"use client";

import React from "react";
import { Bell, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useAtom } from "jotai";
import { ReminderAtom, ReminderType } from "@/store/ReminderStore";
import AddReminder from "@/components/AddReminder";

function Reminders() {
    const [reminders, setReminders] = useAtom<ReminderType[]>(ReminderAtom);

    const handleRemove = (idx: number) => {
        const updated = reminders.filter((_, i) => i !== idx);
        setReminders(updated);
    };

    return (
        <DropdownMenu>
            {/* Bell Trigger */}
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 cursor-pointer focus:outline-none rounded-full hover:bg-zinc-800/50 transition">
                    <Bell className="w-5 h-5 text-zinc-200" />
                    {reminders.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </button>
            </DropdownMenuTrigger>

            {/* Dropdown Content */}
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-xl text-zinc-200"
            >
                <DropdownMenuLabel className="text-zinc-400 text-sm">
                    Reminders
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />

                <div className="p-1 space-y-1">
                    {reminders.length > 0 ? (
                        reminders.map((reminder, idx) => (
                            <DropdownMenuItem
                                key={idx}
                                className="group flex justify-between items-center cursor-pointer text-zinc-200 hover:bg-zinc-800 rounded-md px-3 py-2"
                                onClick={() => {
                                    const url = reminder.actionPath;
                                    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("www.")) {
                                        // Open external link in a new tab
                                        window.open(url.startsWith("www.") ? `https://${url}` : url, "_blank");
                                    } else {
                                        // Relative path: navigate within the app
                                        window.location.href = url;
                                    }
                                }}

                            >
                                <span>{reminder.reminderName}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent redirect
                                        handleRemove(idx);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <X className="w-1 h-1 text-red-400" />
                                </button>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-zinc-400">
                            No reminders right now
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <AddReminder />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Reminders;
