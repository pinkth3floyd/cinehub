'use client';

import React, { useEffect, useState } from 'react';
import { getLatestMovies, getTopRatedMovies } from '../../../core/entities/movies/actions';
import MovieItem from '../../../core/ui/elements/MovieItem';

interface MovieRecommendedProps {
  movieId: string;
}

export default function MovieRecommended({ movieId }: MovieRecommendedProps) {
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        // For now, we'll use latest movies as recommendations
        // In a real app, you'd implement a recommendation algorithm
        const [latestResult, topRatedResult] = await Promise.all([
          getLatestMovies(6),
          getTopRatedMovies(6)
        ]);

        const latestMovies = latestResult.success ? latestResult.data || [] : [];
        const topRatedMovies = topRatedResult.success ? topRatedResult.data || [] : [];

        // Combine and filter out the current movie
        const allMovies = [...latestMovies, ...topRatedMovies];
        const filteredMovies = allMovies
          .filter(movie => movie.id !== movieId)
          .slice(0, 6);

        setRecommendedMovies(filteredMovies);
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMovies();
  }, [movieId]);

  if (loading) {
    return (
      <div className="movie-recommended">
        <div className="movie-recommended__header">
          <h3 className="movie-recommended__title">
            <i className="ti ti-star"></i>
            Recommended Movies
          </h3>
        </div>
        <div className="movie-recommended__loading">
          <div className="loading-spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (recommendedMovies.length === 0) {
    return (
      <div className="movie-recommended">
        <div className="movie-recommended__header">
          <h3 className="movie-recommended__title">
            <i className="ti ti-star"></i>
            Recommended Movies
          </h3>
        </div>
        <div className="movie-recommended__empty">
          <i className="ti ti-movie-off"></i>
          <p>No recommendations available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-recommended">
      <div className="movie-recommended__header">
        <h3 className="movie-recommended__title">
          <i className="ti ti-star"></i>
          Recommended Movies
        </h3>
      </div>
      
      <div className="movie-recommended__grid">
        <div className="row g-4">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
              <MovieItem
                id={movie.id}
                title={movie.title}
                cover={movie.poster || movie.banner || 'cover1.jpg'}
                rating={movie.rating || 0}
                categories={['Movie']}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 