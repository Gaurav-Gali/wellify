"use client";
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

export default function Home() {
    const { user } = useUser();
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl w-full">
        
        {/* PROFILE */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-black rounded-full overflow-hidden flex justify-center"><img src={user?.imageUrl}/></div>
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
    </main>
  );
}
