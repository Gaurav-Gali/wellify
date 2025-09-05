"use client";

import Navbar from "@/components/Navbar";
import BaseTheme from "@/components/BaseTheme";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
            <BaseTheme>
                <Navbar />
                <main className="pt-24">
                    {children}
                </main>
            </BaseTheme>
    );
}
