import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { generateSiteMetadata } from "@/lib/utils";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = generateSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold hover:text-gray-600 transition-colors">
              {SITE_CONFIG.name}
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
