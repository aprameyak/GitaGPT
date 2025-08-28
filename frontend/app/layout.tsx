import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitaGPT - Bhagavad Gita Search",
  description: "Search and understand verses from the Bhagavad Gita using AI",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/app-icon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
