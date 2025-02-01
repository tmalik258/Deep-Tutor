import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import ToastProvider from "@/components/providers/toast-provider";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Tutor",
  description: "Your Real-Time Virtual Educational Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <ConfettiProvider />
          <NextTopLoader />
          <ToastProvider />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
