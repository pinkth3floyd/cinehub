'use client';

import React, { useState, useEffect } from 'react';
import MovieVideoPlayer from './MovieVideoPlayer';
import MovieServerSelector from './MovieServerSelector';
import MovieDescription from './MovieDescription';
import MovieReviews from './MovieReviews';
import MovieRecommended from './MovieRecommended';

interface Server {
  id: string;
  name: string;
  url: string;
  quality?: string;
  language?: string;
  videoType: 'mp4' | 'iframe' | 'youtube';
}

interface MovieDetailContentProps {
  movie: any;
  reviews: any[];
}

export default function MovieDetailContent({ movie, reviews }: MovieDetailContentProps) {
  // Initialize with the first server if available
  const initialServer = movie.servers && movie.servers.length > 0 ? movie.servers[0] : null;
  
  const [selectedServer, setSelectedServer] = useState<Server | null>(initialServer);

  // Convert duration from minutes to seconds
  const durationInSeconds = movie.duration ? movie.duration * 60 : undefined;

  // Update when movie.servers changes (in case it loads asynchronously)
  useEffect(() => {
    if (movie.servers && movie.servers.length > 0 && !selectedServer) {
      setSelectedServer(movie.servers[0]);
    }
  }, [movie.servers, selectedServer]);

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server);
  };

  return (
    <div className="movie-detail-content">
      {/* Video Player Section */}
      <div className="movie-player-section">
        <MovieVideoPlayer 
          selectedServer={selectedServer}
          poster={movie.poster || movie.banner}
          title={movie.title}
          hasServers={movie.servers && movie.servers.length > 0}
          duration={durationInSeconds}
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