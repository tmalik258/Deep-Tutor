import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/providers/toast-provider";
import { NavigationProgress } from "@/components/navigation-progress";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ConfettiProvider } from "@/components/providers/confetti-provider";


export const metadata: Metadata = {
    title: "Deep Tutor",
    description: "Your Real-Time Virtual Educational Assistance",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`antialiased`}
                >
                    <NavigationProgress />
                    <ConfettiProvider />
                    <ToastProvider />
                    <NextSSRPlugin
                        routerConfig={extractRouterConfig(ourFileRouter)}
                    />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}