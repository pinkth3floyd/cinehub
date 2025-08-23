'use client';

import React from 'react';
import Link from 'next/link';

interface MovieDescriptionProps {
  movie: any;
}

export default function MovieDescription({ movie }: MovieDescriptionProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).getFullYear();
  };

  const getRatingClass = (rating: number) => {
    if (rating >= 8.0) return 'rating--excellent';
    if (rating >= 6.0) return 'rating--good';
    return 'rating--poor';
  };

  return (
    <div className="movie-description">
      <div className="movie-description__header">
        <h1 className="movie-description__title">{movie.title}</h1>
        <div className="movie-description__meta">
          <div className="movie-description__rating">
            <span className={`rating ${getRatingClass(movie.rating || 0)}`}>
              {movie.rating?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <div className="movie-description__year">
            {formatDate(movie.releaseDate)}
          </div>
          <div className="movie-description__duration">
            {formatDuration(movie.duration)}
          </div>
        </div>
      </div>

      {movie.description && (
        <div className="movie-description__content">
          <h3 className="movie-description__subtitle">Synopsis</h3>
          <p className="movie-description__text">{movie.description}</p>
        </div>
      )}

      {/* {movie.content && (
        <div className="movie-description__content">
          <h3 className="movie-description__subtitle">Plot</h3>
          <div 
            className="movie-description__text"
            dangerouslySetInnerHTML={{ __html: movie.content }}
          />
        </div>
      )} */}

      <div className="movie-description__details">
        <div className="movie-description__detail-item">
          <span className="movie-description__detail-label">Status:</span>
          <span className={`movie-description__detail-value movie-description__detail-value--${movie.status}`}>
            {movie.status}
          </span>
        </div>
        
        {movie.typeId && (
          <div className="movie-description__detail-item">
            <span className="movie-description__detail-label">Type:</span>
            <span className="movie-description__detail-value">{movie.typeId}</span>
          </div>
        )}
        
        {movie.genreId && (
          <div className="movie-description__detail-item">
            <span className="movie-description__detail-label">Genre:</span>
            <span className="movie-description__detail-value">{movie.genreId}</span>
          </div>
        )}
        
        {movie.yearId && (
          <div className="movie-description__detail-item">
            <span className="movie-description__detail-label">Year:</span>
            <span className="movie-description__detail-value">{movie.yearId}</span>
          </div>
        )}
      </div>

      {movie.links && movie.links.length > 0 && (
        <div className="movie-description__links">
          <h3 className="movie-description__subtitle">External Links</h3>
          <div className="movie-description__links-list">
            {movie.links.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-description__link"
              >
                <i className="ti ti-external-link"></i>
                {link.title}
                {link.type && (
                  <span className="movie-description__link-type">{link.type}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 