import type { Metadata } from "next";
import "./globals.css";
import { AppFrame } from "@/components/AppFrame";

/* Sendrift. Copyright 2026 Venkataramana. */

export const metadata: Metadata = {
  title: "Sendrift",
  description: "Email marketing and automation platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
