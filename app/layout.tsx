import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
  },
  title: "DevTools Hub – All-in-One Developer Utility Platform",
  description:
    "8 free developer tools: QR Generator, URL Shortener, Video Downloader, Password Generator, JSON Formatter, Image to PDF, Image Upscaler, and Video to Audio.",
  keywords: [
    "developer tools", "QR generator", "password generator",
    "JSON formatter", "URL shortener", "image to PDF", "video downloader",
    "image upscaler", "video to audio",
  ],
  openGraph: {
    title: "DevTools Hub",
    description: "All-in-one developer utility platform — 8 free tools",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
