import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "CineHub – Online Movies, TV Shows & Cinema",
  description: "Online Movies, TV Shows & Cinema HTML Template",
  keywords: "movies, tv shows, cinema, streaming",
  icons: {
    icon: '/core/assets/icon/favicon-32x32.png',
    apple: '/core/assets/icon/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* CSS */}
        <link rel="stylesheet" href="/core/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/core/assets/css/splide.min.css" />
        <link rel="stylesheet" href="/core/assets/css/slimselect.css" />
        <link rel="stylesheet" href="/core/assets/css/plyr.css" />
        <link rel="stylesheet" href="/core/assets/css/photoswipe.css" />
        <link rel="stylesheet" href="/core/assets/css/default-skin.css" />
        <link rel="stylesheet" href="/core/assets/css/main.css" />

        {/* Icon font */}
        <link rel="stylesheet" href="/core/assets/webfont/tabler-icons.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        
        {/* JS */}
        <Script src="/core/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/splide.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/slimselect.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/smooth-scrollbar.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/plyr.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/photoswipe.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/photoswipe-ui-default.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
