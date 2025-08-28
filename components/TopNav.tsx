"use client";

import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { Separator } from "@/components/ui/separator";

const TopNav: React.FC = () => {
    const { isSignedIn } = useUser(); // check if user is signed in
    const [selectedDay, setSelectedDay] = useState(0);

    if (!isSignedIn) return null; // render nothing if not signed in

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);
        return format(date, "EEE");
    });

    return (
        <div>
            <div className="flex justify-between items-center gap-3 px-3 py-2">
                <span>Wellify</span>

                <div className="flex gap-2 overflow-x-auto p-2">
                    {days.map((day, index) => (
                        <Button
                            key={day}
                            onClick={() => setSelectedDay(index)}
                            variant={selectedDay === index ? "default" : "ghost"}
                            className="text-sm px-2 py-1"
                        >
                            {day}
                        </Button>
                    ))}
                </div>

                <div className="border-2 rounded-full w-fit h-8">
                    <UserButton />
                </div>
            </div>
            <Separator />
        </div>
    );
};

export default TopNav;
