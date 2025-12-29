import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Rust Go Python Blog",
    template: "%s | Rust Go Python Blog",
  },
  description: "Rust Go Python Blog",
  openGraph: {
    title: "Rust Go Python Blog",
    description: "Rust Go Python Blog - ITに関する様々なトピックを扱うブログ",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rust Go Python Blog",
    description: "Rust Go Python Blog - ITに関する様々なトピックを扱うブログ",
  },
};

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
              Rust Go Python Blog
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
