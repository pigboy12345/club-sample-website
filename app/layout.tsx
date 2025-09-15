import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotificationBell from './components/NotificationBell';

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
          <Footer />
        </div>
      </body>
    </html>
  );
}
