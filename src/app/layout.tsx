import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoatCounter } from "./goat-counter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://qremoji.cc";
const TITLE = "QR Code Generator with Emoji";
const DESCRIPTION =
  "Create custom QR codes with your favorite emoji in the center. Free, fast, and easy to use.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: SITE_URL, siteName: "qremoji.cc", type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
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
        {children}
      <GoatCounter />
      </body>
    </html>
  );
}
