"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { ReminderAtom, ReminderType } from "@/store/ReminderStore";

const AddReminder: React.FC = () => {
    const [reminders, setReminders] = useAtom<ReminderType[]>(ReminderAtom);
    const [open, setOpen] = useState(false);

    const [useCustom, setUseCustom] = useState(false);

    const [selectedReminderId, setSelectedReminderId] = useState("drink-water");
    const [customName, setCustomName] = useState("");
    const [duration, setDuration] = useState(30);
    const [customActionPath, setCustomActionPath] = useState("/reminders");

    const reminderTypes = [
        { id: "1", reminderName: "Drink Water", actionPath: "/hydration" },
        { id: "2", reminderName: "Stretch Exercise", actionPath: "/games/stretch" },
        // { id: "3", reminderName: "Eye Exercise", actionPath: "/exercises/eye" },
        { id: "4", reminderName: "Breathing Exercise", actionPath: "/games/breathing" },
        { id: "5", reminderName: "Mind Exercise", actionPath: "/games/puzzle" },
        // { id: "5", reminderName: "Eye Drawing Game", actionPath: "/games/eye-drawing" },
        // { id: "6", reminderName: "Subway Surfers Game", actionPath: "/games/subway-surfers" }
    ];

    const handleCreateReminder = () => {
        let newReminder: ReminderType;

        if (useCustom) {
            newReminder = {
                reminderName: customName,
                duration,
                actionPath: customActionPath,
                id: `custom-${Date.now()}`, // unique id
            };
        } else {
            const selected = reminderTypes.find((r) => r.id === selectedReminderId)!;
            newReminder = {
                id: selected.id,
                reminderName: selected.reminderName,
                duration,
                actionPath: selected.actionPath,
            };
        }

        setReminders([...reminders, newReminder]);
        setOpen(false);

        // Reset state
        setCustomName("");
        setCustomActionPath("/reminders");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-zinc-800/40 backdrop-blur-md border border-zinc-700 text-zinc-200 hover:bg-zinc-700/50 rounded-lg">
                    + Create Reminder
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900/90 border border-zinc-800 text-zinc-100 rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Create Reminder</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Custom Reminder Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="customReminder"
                            checked={useCustom}
                            onChange={() => setUseCustom(!useCustom)}
                            className="w-4 h-4 accent-green-500 cursor-pointer"
                        />
                        <label htmlFor="customReminder" className="text-sm text-zinc-400">
                            Custom Reminder
                        </label>
                    </div>

                    {/* Predefined Reminder Type OR Custom Input */}
                    {!useCustom ? (
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">
                                Reminder Type
                            </label>
                            <Select
                                defaultValue={selectedReminderId}
                                onValueChange={(val) => setSelectedReminderId(val)}
                            >
                                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-200">
                                    <SelectValue placeholder="Select reminder type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 p-1 border-zinc-800 text-zinc-200">
                                    {reminderTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.reminderName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Custom Reminder Name */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">
                                    Custom Reminder Name
                                </label>
                                <Input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="e.g., Take Vitamins"
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-200"
                                />
                            </div>

                            {/* Custom Action Path */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">
                                    Action Path (URL)
                                </label>
                                <Input
                                    type="text"
                                    value={customActionPath}
                                    onChange={(e) => setCustomActionPath(e.target.value)}
                                    placeholder="/custom-task"
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-200"
                                />
                            </div>
                        </div>
                    )}

                    {/* Duration Input */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                            Duration (minutes)
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="bg-zinc-800/50 border-zinc-700 text-zinc-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleCreateReminder}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                        Save Reminder
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddReminder;
