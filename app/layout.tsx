'use client';

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <title>Portfolio</title>
        <meta name="description" content="My Portfolio Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background Light Rays - Only show on main portfolio page */}
        {!isAdminRoute && (
          <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={0.6}
              rayLength={1.8}
              fadeDistance={1.2}
              saturation={1.2}
              followMouse={true}
              mouseInfluence={0.15}
              noiseAmount={0.08}
              distortion={0.06}
            />
          </div>
        )}
        
        {/* Navbar - Only show on main portfolio page, hide on admin routes */}
        {!isAdminRoute && <Navbar />}
        
        {/* Content - Responsive container */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
