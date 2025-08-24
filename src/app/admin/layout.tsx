import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import TanstackProvider from "../core/ui/components/TanstackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineHub Admin – Dashboard",
  description: "CineHub Admin Dashboard",
  keywords: "admin, dashboard, movies, tv shows",
  icons: {
    icon: '/core/assets/icon/favicon-32x32.png',
    apple: '/core/assets/icon/favicon-32x32.png',
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* CSS - Admin only */}
        <link rel="stylesheet" href="/core/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/core/assets/css/slimselect.css" />
        <link rel="stylesheet" href="/core/assets/css/admin.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

        {/* Icon font */}
        <link rel="stylesheet" href="/core/assets/webfont/tabler-icons.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TanstackProvider>
          {children}
        </TanstackProvider>
        
        {/* JS - Admin only, no main site JS */}
        <Script src="/core/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/slimselect.min.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/smooth-scrollbar.js" strategy="afterInteractive" />
        <Script src="/core/assets/js/admin.js" strategy="afterInteractive" />
      </body>
    </html>
  );
} 