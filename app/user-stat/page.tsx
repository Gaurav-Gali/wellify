"use client";
import { useState, useEffect } from "react";
import { FaBehance, FaGithub, FaInstagram, FaLinkedin, FaDribbble, FaFigma, FaCoffee } from "react-icons/fa";
import { SiGumroad, SiKofi } from "react-icons/si";
import ChartAreaStacked from "@/components/ui_gopinath/chart1";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ChartAreaDefault from "@/components/ui_gopinath/chart2";
import ChartLineLinear from "@/components/ui_gopinath/chart3";
import ChartLineLabel from "@/components/ui_gopinath/chart4";
import ChartLineLabelCustom from "@/components/ui_gopinath/chart6";
import ChartPieDonutText from "@/components/ui_gopinath/chart7";
import { useUser } from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Open popup automatically after page load
        setOpen(true);
    }, []);

    return (
        <main className="min-h-screen text-black flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center text-center gap-6 max-w-4xl w-full">

                {/* PROFILE */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-black rounded-full overflow-hidden flex justify-center">
                        <img src={user?.imageUrl} />
                    </div>
                    <h1 className="text-black text-2xl md:text-3xl font-bold">{user?.fullName}</h1>
                </div>

                {/* CHART CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <ChartPieDonutText />
                    <ChartAreaDefault />
                    <ChartAreaStacked />
                    <ChartLineLinear />
                    <ChartLineLabel />
                    <ChartLineLabelCustom />
                </div>
            </div>

            {/* Weekly Summary Popup */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Weekly Wellness Summary 🌱</DialogTitle>
                        <DialogDescription>
                            Here's your progress this week:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p>✅ You completed <b>5/7 wellness activities</b>.</p>
                        <p>💤 Your average sleep improved by <b>+1.5 hrs</b>.</p>
                        <p>🧘 Stress levels decreased by <b>12%</b>.</p>
                        <p>💡 Tip: Try 10 minutes of journaling daily to keep improving!</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => setOpen(false)}>Got it</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}
