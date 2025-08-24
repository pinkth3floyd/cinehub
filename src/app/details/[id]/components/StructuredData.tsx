'use client';

import React from 'react';

interface Movie {
  id: string;
  title: string;
  description?: string | null;
  poster?: string | null;
  banner?: string | null;
  trailer?: string | null;
  duration?: number | null;
  rating?: number | null;
  releaseDate?: Date | null;
  status: string;
  featured: boolean;
  typeId?: string | null;
  yearId?: string | null;
  genreId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Review {
  id: string;
  movieId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  user?: {
    name: string;
  } | null;
}

interface StructuredDataProps {
  movie: Movie;
  reviews: Review[];
}

export default function StructuredData({ movie, reviews }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinehub.com';
  
  // Calculate aggregate rating
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : movie.rating || 0;

  // Format duration
  const formatDuration = (minutes?: number | null) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `PT${hours}H${mins}M` : `PT${mins}M`;
  };

  // Format date
  const formatDate = (date?: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    '@id': `${baseUrl}/details/${movie.id}`,
    name: movie.title,
    description: movie.description || `Watch ${movie.title} online on CineHub`,
    image: movie.poster || movie.banner,
    url: `${baseUrl}/details/${movie.id}`,
    datePublished: formatDate(movie.releaseDate),
    duration: formatDuration(movie.duration),
    genre: movie.genreId,
    director: {
      '@type': 'Person',
      name: 'Various Directors'
    },
    productionCompany: {
      '@type': 'Organization',
      name: 'Various Studios'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      ratingCount: totalReviews,
      bestRating: 10,
      worstRating: 1
    },
    review: reviews.slice(0, 5).map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user?.name || 'Anonymous'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 10,
        worstRating: 1
      },
      reviewBody: review.comment || '',
      datePublished: formatDate(review.createdAt)
    })),
    potentialAction: {
      '@type': 'WatchAction',
      target: `${baseUrl}/details/${movie.id}`,
      name: `Watch ${movie.title}`
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      url: `${baseUrl}/details/${movie.id}`
    }
  };

  // Add trailer if available
  if (movie.trailer) {
    structuredData.trailer = {
      '@type': 'VideoObject',
      name: `${movie.title} Trailer`,
      description: `Official trailer for ${movie.title}`,
      thumbnailUrl: movie.poster,
      uploadDate: formatDate(movie.releaseDate),
      contentUrl: movie.trailer
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
