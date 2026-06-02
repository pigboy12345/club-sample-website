import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Ignore missing TypeScript declarations for global css import
// @ts-ignore
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotificationBell from './components/NotificationBell';
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bappuji Club Kalkuzhy",
  description: "Bappuji Kala Kayika Samskarika Vedhi Club Kalkuzhy",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Bappuji Club Kalkuzhy",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-white">
          <Header />
          <div className="fixed top-20 right-0 z-40">
            <NotificationBell />
          </div>

          {children}
          <Toaster position="bottom-right" />
          <Footer />
        </div>
      </body>
    </html>
  );
}
