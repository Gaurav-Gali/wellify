import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {ClerkProvider} from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import ReminderProvider from "@/components/ReminderProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wellify",
  description: "Wellness applicaion for corporate employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
        baseTheme: dark,
    }}>
        <html lang="en">
                  <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900`}
                  >
                  <ReminderProvider />
                    {children}
                  </body>
        </html>
    </ClerkProvider>
  );
}
