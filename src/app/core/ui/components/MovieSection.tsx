'use client';

import React from 'react';
import MovieGrid from './MovieGrid';

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Array<{
    id: string;
    title: string;
    poster?: string | null;
    banner?: string | null;
    rating: number | null;
    status: string;
    featured: boolean;
    createdAt: Date;
    genres?: string[];
  }>;
  columns?: 2 | 3 | 4 | 6;
  variant?: 'default' | 'hero' | 'carousel';
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function MovieSection({
  title,
  subtitle,
  movies,
  columns = 6,
  variant = 'default',
  showLoadMore = false,
  onLoadMore,
  hasMore = false
}: MovieSectionProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  // Transform movies to match MovieGrid interface
  const transformedMovies = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster || movie.banner || `/core/assets/img/covers/cover1.jpg`,
    rating: movie.rating || 0,
    genres: movie.genres || ['Movie'] // Use actual genres if available
  }));

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title">
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
        </div>
        
        <MovieGrid
          movies={transformedMovies}
          columns={columns}
          variant={variant}
          showLoadMore={showLoadMore}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
        />
      </div>
    </section>
  );
} 