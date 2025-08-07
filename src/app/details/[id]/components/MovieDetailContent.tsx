'use client';

import React, { useState, useEffect } from 'react';
import MovieVideoPlayer from './MovieVideoPlayer';
import MovieServerSelector from './MovieServerSelector';
import MovieDescription from './MovieDescription';
import MovieReviews from './MovieReviews';
import MovieRecommended from './MovieRecommended';

interface MovieDetailContentProps {
  movie: any;
  reviews: any[];
}

export default function MovieDetailContent({ movie, reviews }: MovieDetailContentProps) {
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Set default server when component mounts
  useEffect(() => {
    if (movie.servers && movie.servers.length > 0) {
      setSelectedServer(movie.servers[0]);
      setVideoUrl(movie.servers[0].url);
    }
  }, [movie.servers]);

  const handleServerSelect = (server: any) => {
    setSelectedServer(server);
    setVideoUrl(server.url);
  };

  return (
    <div className="movie-detail-content">
      {/* Video Player Section */}
      <div className="movie-player-section">
        <MovieVideoPlayer 
          videoUrl={videoUrl}
          poster={movie.poster || movie.banner}
          title={movie.title}
          hasServers={movie.servers && movie.servers.length > 0}
        />
      </div>

      {/* Server Selection */}
      {movie.servers && movie.servers.length > 0 && (
        <div className="server-selection-section">
          <MovieServerSelector 
            servers={movie.servers}
            selectedServer={selectedServer}
            onServerSelect={handleServerSelect}
          />
        </div>
      )}

      {/* Movie Description */}
      <div className="movie-description-section">
        <MovieDescription movie={movie} />
      </div>

      {/* Reviews Section */}
      <div className="movie-reviews-section">
        <MovieReviews 
          movieId={movie.id}
          reviews={reviews}
        />
      </div>

      {/* Recommended Movies */}
      <div className="movie-recommended-section">
        <MovieRecommended movieId={movie.id} />
      </div>
    </div>
  );
} 