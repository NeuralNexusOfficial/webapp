import type { Metadata } from "next";
import "./globals.css";
import { SimpleBackground } from "@/components/ui/simple-background";

export const metadata: Metadata = {
  title: "NeuralNexus — Global Hackathon Platform",
  description:
    "Join developers, designers and innovators at NeuralNexus — the next-generation hackathon platform built for scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col noise-bg relative">
        {/* Simple drifting orbs — shown on all pages except homepage,
            which renders BackgroundPaths on top of this via its own component. */}
        <SimpleBackground />
        {/* Page content */}
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
