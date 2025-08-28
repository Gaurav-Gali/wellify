"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useCallback, useEffect } from "react";

import { Grid2x2, Chromium } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CardDemo() {
    const { signIn, isLoaded } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const handleOAuth = useCallback(
        async (strategy: "oauth_google" | "oauth_microsoft") => {
            if (!isLoaded) return;

            try {
                await signIn.authenticateWithRedirect({
                    strategy,
                    redirectUrl: "/",
                });
            } catch (err) {
                console.error("OAuth sign-in error:", err);
            }
        },
        [isLoaded, signIn]
    );

    // Redirect if already signed in
    useEffect(() => {
        if (isSignedIn) {
            router.push("/");
        }
    }, [isSignedIn, router]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "1rem",
                boxSizing: "border-box",
            }}
        >
            <Card style={{ width: "100%", maxWidth: "400px" }}>
                <CardHeader>
                    <CardTitle>Wellify</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                    <CardDescription>Choose a provider to continue</CardDescription>
                </CardHeader>

                <CardContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    <Button
                        onClick={() => handleOAuth("oauth_google")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            width: "100%",
                        }}
                    >
                        <Chromium />
                        Continue with Google
                    </Button>

                    <Button
                        onClick={() => handleOAuth("oauth_microsoft")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            width: "100%",
                        }}
                    >
                        <Grid2x2 />
                        Continue with Microsoft
                    </Button>
                </CardContent>

                <CardFooter style={{ textAlign: "center" }}>
                    &#34;Health is the greatest gift, contentment the greatest wealth.&#34; – Buddha
                </CardFooter>
            </Card>
        </div>
    );
}
