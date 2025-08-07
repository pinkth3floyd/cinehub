'use client';

import React from 'react';
import MovieItem from '../../../core/ui/elements/MovieItem';

interface MovieDetailSidebarProps {
  featuredMovies: any[];
  latestMovies: any[];
}

export default function MovieDetailSidebar({ featuredMovies, latestMovies }: MovieDetailSidebarProps) {
  return (
    <div className="movie-detail-sidebar">
      {/* Featured Movies */}
      <div className="sidebar-section">
        <div className="sidebar-section__header">
          <h3 className="sidebar-section__title">
            <i className="ti ti-star"></i>
            Featured Movies
          </h3>
        </div>
        
        <div className="sidebar-section__content">
          {featuredMovies.length === 0 ? (
            <div className="sidebar-section__empty">
              <i className="ti ti-movie-off"></i>
              <p>No featured movies</p>
            </div>
          ) : (
            <div className="sidebar-section__grid">
              {featuredMovies.slice(0, 3).map((movie) => (
                <div key={movie.id} className="sidebar-section__item">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.poster || movie.banner || 'cover1.jpg'}
                    rating={movie.rating || 0}
                    categories={['Featured']}
                    variant="carousel"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest Movies */}
      <div className="sidebar-section">
        <div className="sidebar-section__header">
          <h3 className="sidebar-section__title">
            <i className="ti ti-clock"></i>
            Latest Movies
          </h3>
        </div>
        
        <div className="sidebar-section__content">
          {latestMovies.length === 0 ? (
            <div className="sidebar-section__empty">
              <i className="ti ti-movie-off"></i>
              <p>No latest movies</p>
            </div>
          ) : (
            <div className="sidebar-section__grid">
              {latestMovies.slice(0, 3).map((movie) => (
                <div key={movie.id} className="sidebar-section__item">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.poster || movie.banner || 'cover1.jpg'}
                    rating={movie.rating || 0}
                    categories={['Latest']}
                    variant="carousel"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="sidebar-section">
        <div className="sidebar-section__header">
          <h3 className="sidebar-section__title">
            <i className="ti ti-chart-bar"></i>
            Quick Stats
          </h3>
        </div>
        
        <div className="sidebar-section__content">
          <div className="stats-grid">
            <div className="stats-item">
              <div className="stats-item__icon">
                <i className="ti ti-movie"></i>
              </div>
              <div className="stats-item__content">
                <span className="stats-item__label">Total Movies</span>
                <span className="stats-item__value">{featuredMovies.length + latestMovies.length}</span>
              </div>
            </div>
            
            <div className="stats-item">
              <div className="stats-item__icon">
                <i className="ti ti-star"></i>
              </div>
              <div className="stats-item__content">
                <span className="stats-item__label">Featured</span>
                <span className="stats-item__value">{featuredMovies.length}</span>
              </div>
            </div>
            
            <div className="stats-item">
              <div className="stats-item__icon">
                <i className="ti ti-clock"></i>
              </div>
              <div className="stats-item__content">
                <span className="stats-item__label">Latest</span>
                <span className="stats-item__value">{latestMovies.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 