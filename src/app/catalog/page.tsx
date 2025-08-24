import { Metadata } from 'next';
import CatalogPageClient from './CatalogPageClient';
// import CatalogPageClient from './CatalogPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinehub.com';
  
  return {
    title: 'Movie Catalog - Browse All Movies & TV Shows - CineHub',
    description: 'Browse our complete collection of movies and TV shows. Find the latest releases, classics, and hidden gems. Stream HD quality content anytime, anywhere.',
    keywords: 'movie catalog, browse movies, watch movies online, streaming, TV shows, latest movies, HD movies',
    openGraph: {
      title: 'Movie Catalog - Browse All Movies & TV Shows - CineHub',
      description: 'Browse our complete collection of movies and TV shows. Find the latest releases, classics, and hidden gems.',
      type: 'website',
      url: `${baseUrl}/catalog`,
      siteName: 'CineHub',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Movie Catalog - Browse All Movies & TV Shows - CineHub',
      description: 'Browse our complete collection of movies and TV shows.',
    },
    alternates: {
      canonical: `${baseUrl}/catalog`,
    },
  };
}

export default function CatalogPage() {
  return <CatalogPageClient />;
} 