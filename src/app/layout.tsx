import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import TanstackProvider from "./core/ui/components/TanstackProvider";
import { getSiteMetadata } from "./core/utils/siteSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  try {
    const metadata = await getSiteMetadata();
    
    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      authors: metadata.author ? [{ name: metadata.author }] : undefined,
      icons: {
        icon: '/core/assets/icon/favicon-32x32.png',
        apple: '/core/assets/icon/favicon-32x32.png',
      },
      openGraph: {
        title: metadata.openGraph.title,
        description: metadata.openGraph.description,
        type: metadata.openGraph.type as 'website',
        url: metadata.openGraph.url,
        images: metadata.openGraph.image ? [{ url: metadata.openGraph.image }] : undefined,
        siteName: metadata.openGraph.siteName,
      },
      twitter: {
        card: metadata.twitter.card as 'summary_large_image' | 'summary' | 'player' | 'app',
        title: metadata.twitter.title,
        description: metadata.twitter.description,
        images: metadata.twitter.image ? [metadata.twitter.image] : undefined,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    // Fallback metadata
    return {
      title: "CineHub – Online Movies, TV Shows & Cinema",
      description: "Online Movies, TV Shows & Cinema HTML Template",
      keywords: "movies, tv shows, cinema, streaming",
      icons: {
        icon: '/core/assets/icon/favicon-32x32.png',
        apple: '/core/assets/icon/favicon-32x32.png',
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      {/* <UseAnalytics /> */}
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
        <link rel="stylesheet" href="/core/assets/css/admin.css" />
       

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
        <Script src="/core/assets/js/admin.js" strategy="afterInteractive" />
        <Script type="text/javascript" src="https://epctrk.com/script_include.php?id=1833719"></Script>
      
        {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WBQWZPRWCL"></Script> */}

   
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WBQWZPRWCL"></script>
<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WBQWZPRWCL');
  `}
</Script>

        {/* <Script type="text/javascript" src="https://epctrk.com/script_include.php?id=1741216"></Script> */}
        {/* <script type="text/javascript" src="https://epctrk.com/script_include.php?id=1741216"></script> */}
        {/* <script type="text/javascript">var lck = false;</script><script type="text/javascript" src="https://epctrk.com/script_include.php?id=568370&tracking_id=cinehub"></script><script type="text/javascript">if(!lck){top.location = 'https://epctrk.com/help/ablk.php?lkt=4' }</script><noscript>Please enable JavaScript to access this page.<meta http-equiv="refresh" content="0;url=https://epctrk.com/help/enable_javascript.php?lkt=4" ></meta></noscript> */}
      
      </body>
    </html>
    </TanstackProvider>
  );
}
