'use client';

import React from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader";

function Page() {
    const { isLoaded } = useUser();

    if (!isLoaded) {
        return <Loader />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-950">
            <div className="flex flex-col items-center space-y-6 px-4">
                {/* Branding */}
                <div className="text-center text-zinc-100">
                    <h1 className="text-4xl font-thin tracking-wide">Wellify</h1>
                    <p className="text-zinc-400 mt-3 italic">
                        &#34;Wellness is the key to unlocking your best self.&#34;
                    </p>
                </div>

                <Card className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 shadow-xl rounded-2xl">
                    <CardContent className="p-6">
                        <SignIn
                            appearance={{
                                elements: {
                                    card: "bg-transparent shadow-none",
                                    headerTitle: "hidden",
                                },
                            }}
                            forceRedirectUrl="/dashboard"
                        />
                    </CardContent>
                </Card>

                <p className="text-xs text-zinc-500 text-center max-w-sm">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="underline hover:text-zinc-300">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline hover:text-zinc-300">
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    );
}

export default Page;
