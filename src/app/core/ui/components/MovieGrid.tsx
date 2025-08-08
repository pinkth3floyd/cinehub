'use client';

import React from 'react';
import Link from 'next/link';

export interface Movie {
  id: string;
  title: string;
  poster?: string | null;
  rating: number | null;
  genres?: string[];
}

export interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  columns?: number;
  variant?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// Sample movie data for demonstration
const sampleMovies = [
  {
    id: '1',
    title: 'I Dream in Another Lan...',
    rating: 8.4,
    genres: ['Action', 'Triler'],
    poster: '/core/assets/img/covers/cover1.jpg'
  },
  {
    id: '2',
    title: 'Benched',
    rating: 7.1,
    genres: ['Comedy'],
    poster: '/core/assets/img/covers/cover2.jpg'
  },
  {
    id: '3',
    title: 'Whitney',
    rating: 6.3,
    genres: ['Romance', 'Drama', 'Music'],
    poster: '/core/assets/img/covers/cover3.jpg'
  },
  {
    id: '4',
    title: 'Blindspotting',
    rating: 6.9,
    genres: ['Comedy', 'Drama'],
    poster: '/core/assets/img/covers/cover4.jpg'
  },
  {
    id: '5',
    title: 'I Dream in Another Lan...',
    rating: 8.4,
    genres: ['Action', 'Triler'],
    poster: '/core/assets/img/covers/cover5.jpg'
  },
  {
    id: '6',
    title: 'Benched',
    rating: 7.1,
    genres: ['Comedy'],
    poster: '/core/assets/img/covers/cover6.jpg'
  }
];

export default function MovieGrid({ 
  movies = sampleMovies, 
  title, 
  subtitle,
  columns = 6,
  variant = 'default',
  showLoadMore = false,
  onLoadMore,
  hasMore = false
}: MovieGridProps) {
  const getRatingClass = (rating: number) => {
    if (rating >= 8.0) return 'green';
    if (rating >= 7.0) return 'yellow';
    return 'red';
  };

  return (
    <div className="movie-grid-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {title && (
              <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
              </div>
            )}
            
            <div className="movie-grid">
              {movies.map((movie, index) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-card__poster">
                    <img 
                      src={movie.poster || `/core/assets/img/covers/cover${(index % 6) + 1}.jpg`}
                      alt={movie.title}
                      className="movie-card__image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/core/assets/img/covers/cover${(index % 6) + 1}.jpg`;
                      }}
                    />
                    
                    {/* Rating Badge */}
                    <div className={`movie-card__rating movie-card__rating--${getRatingClass(movie.rating || 0)}`}>
                      {movie.rating?.toFixed(1) || '8.0'}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="movie-card__overlay">
                      <button className="movie-card__play">
                        <i className="ti ti-player-play"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="movie-card__content">
                    <h3 className="movie-card__title">{movie.title}</h3>
                    <div className="movie-card__genres">
                      {movie.genres?.map((genre, genreIndex) => (
                        <span key={genreIndex} className="movie-card__genre">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {showLoadMore && hasMore && onLoadMore && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={onLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 