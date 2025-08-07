'use client';

import React from 'react';
import MovieItem from '../elements/MovieItem';

export interface Movie {
  id: string;
  title: string;
  cover: string;
  rating: number;
  categories: string[];
}

export interface MovieGridProps {
  movies: Movie[];
  columns?: 2 | 3 | 4 | 6;
  variant?: 'default' | 'hero' | 'carousel';
  className?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function MovieGrid({
  movies,
  columns = 6,
  variant = 'default',
  className = '',
  showLoadMore = false,
  onLoadMore,
  hasMore = false
}: MovieGridProps) {
  const gridClass = `movie-grid movie-grid--${columns}-cols ${className}`.trim();

  const getColumnClass = () => {
    switch (columns) {
      case 2:
        return 'col-6 col-sm-6 col-lg-6 col-xl-2';
      case 3:
        return 'col-6 col-sm-4 col-lg-4 col-xl-4';
      case 4:
        return 'col-6 col-sm-4 col-lg-3 col-xl-3';
      case 6:
      default:
        return 'col-6 col-sm-4 col-lg-3 col-xl-2';
    }
  };

  return (
    <div className={gridClass}>
      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie.id} className={getColumnClass()}>
            <MovieItem
              id={movie.id}
              title={movie.title}
              cover={movie.cover}
              rating={movie.rating}
              categories={movie.categories}
              variant={variant}
            />
          </div>
        ))}
      </div>
      
      {showLoadMore && hasMore && (
        <div className="row">
          <div className="col-12 text-center">
            <button 
              className="btn btn--primary" 
              onClick={onLoadMore}
              type="button"
            >
              Load More
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 