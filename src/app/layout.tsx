import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DefineElements } from "@/components/DefineElements";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moz Live Coding",
  description: "A product built live during the Moz design interview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DefineElements />
        {children}
      </body>
    </html>
  );
}
