"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader"; // adjust path if needed

function BaseTheme({ children }: { children: React.ReactNode }) {
    const { isLoaded } = useUser();

    return (
        <div className="min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950">
            {!isLoaded ? (
                <>
                    <Loader />
                </>
            ) : (
                <>{children}</>
            )}
        </div>
    );
}

export default BaseTheme;
