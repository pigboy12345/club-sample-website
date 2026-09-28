import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
// Ignore missing TypeScript declarations for global css import
// @ts-ignore
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bappuji Kalkuzhy",
  description: "Bappuji Kala Kayika Samskarika Vedhi Club Kalkuzhy",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Bappuji Kalkuzhy",
    description: "Bappuji Kala Kayika Samskarika Vedhi Club Kalkuzhy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630, 
        alt: "Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <div className="min-h-screen bg-[#f6f3ee]">
          <SiteChrome>{children}</SiteChrome>
          <Toaster position="bottom-right" />
        </div>
      </body>
    </html>
  );
}
