import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "GitaGPT - Bhagavad Gita Search",
  description: "Search and understand verses from the Bhagavad Gita using AI",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
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
