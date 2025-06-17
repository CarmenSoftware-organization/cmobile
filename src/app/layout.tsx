import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0F52BA",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Carmen Supply Chain Mobile App",
  description: "Modern, mobile-first supply chain controls for hospitality",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
    other: {
      rel: "icon",
      url: "/favicon.ico",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Carmen Supply",
  },
};

const stagewiseConfig = {
  plugins: [ReactPlugin]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="carmen-theme">
          {children}
          {process.env.NODE_ENV === 'development' && (
            <StagewiseToolbar config={stagewiseConfig} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
