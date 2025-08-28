"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import { useCallback } from "react";

import {Grid2x2,Chromium} from "lucide-react";

export default function CardDemo() {
    const { signIn, isLoaded } = useSignIn();

    const handleOAuth = useCallback(
        async (strategy: "oauth_google" | "oauth_microsoft") => {
            if (!isLoaded) return;

            try {
                await signIn.authenticateWithRedirect({
                    strategy,
                    redirectUrl: "/", // Redirect to home after sign-in
                });
            } catch (err) {
                console.error("OAuth sign-in error:", err);
            }
        },
        [isLoaded, signIn]
    );

    return (
        <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
            <Card>
                <CardHeader>
                    <CardTitle>Wellify</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                    <CardDescription>Choose a provider to continue</CardDescription>
                </CardHeader>

                <CardContent className={"flex items-center justify-center gap-3"}>
                    <Button onClick={() => handleOAuth("oauth_google")}>
                        <Chromium/>
                        Continue with Google
                    </Button>
                    <Button onClick={() => handleOAuth("oauth_microsoft")}>
                        <Grid2x2/>
                        Continue with Microsoft
                    </Button>
                </CardContent>



            </Card>
        </div>
    );
}
