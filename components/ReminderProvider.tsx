"use client";

import { useEffect } from "react";
import {useAtom} from "jotai";
import {ReminderAtom, ReminderType} from "@/store/ReminderStore";

function ReminderProvider() {
    const [reminders,_] = useAtom<ReminderType[]>(ReminderAtom);
    useEffect(() => {
        // Ask user for notification permission
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        // Set up intervals for each reminder
        reminders.forEach((reminder) => {
            const interval = reminder.duration * 60 * 1000; // convert mins → ms

            setInterval(() => {
                if (Notification.permission === "granted") {
                    const notification = new Notification(reminder.reminderName, {
                        body: `It's time for your ${reminder.reminderName}!`,
                        icon: "/icons/reminder.png", // optional app icon
                    });

                    // When user clicks notification → go to reminder page
                    notification.onclick = () => {
                        window.focus();
                        window.location.href = reminder.actionPath;
                    };
                }
            }, interval);
        });
    }, []);

    return null; // This component just runs the reminders
}

export default ReminderProvider;
