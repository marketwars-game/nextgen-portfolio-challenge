// FILE: app/layout.tsx — Root layout + document metadata
// VERSION: NXG-V0 — MARKET WARS · Portfolio Challenge — KKP Next Gen Edition (metadata: ฿10M · 9 assets · 5 challenges)
// LAST MODIFIED: 10 Sep 2026
// HISTORY: market-wars B1..B20 | YG-V0 fork | YG-V1 rebrand metadata | NXG-V0 rebrand Next Gen
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKET WARS · Portfolio Challenge — KKP Next Gen Edition",
  description:
    "A live multiplayer portfolio-allocation game for KKP Next Gen. Six teams manage ฿10,000,000 across 9 asset classes over 5 challenges (2027–2031).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
