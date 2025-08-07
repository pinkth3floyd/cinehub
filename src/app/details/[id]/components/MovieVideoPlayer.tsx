'use client';

import React, { useEffect, useRef } from 'react';

// Plyr type declaration
declare global {
  interface Window {
    Plyr: any;
  }
}

interface MovieVideoPlayerProps {
  videoUrl: string;
  poster?: string | null;
  title: string;
  hasServers: boolean;
}

export default function MovieVideoPlayer({ videoUrl, poster, title, hasServers }: MovieVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Plyr player when component mounts
    if (typeof window !== 'undefined' && window.Plyr) {
      if (videoRef.current) {
        playerRef.current = new window.Plyr(videoRef.current, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
          ],
          settings: ['captions', 'quality', 'speed'],
          quality: {
            default: 720,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Update video source when videoUrl changes
  useEffect(() => {
    if (playerRef.current && videoUrl) {
      playerRef.current.source = {
        type: 'video',
        sources: [
          {
            src: videoUrl,
            type: 'video/mp4',
            size: 720
          }
        ]
      };
    }
  }, [videoUrl]);

  if (!hasServers) {
    return (
      <div className="movie-player-section">
        <div className="no-servers-message">
          <div className="no-servers-content">
            <i className="ti ti-alert-circle"></i>
            <h3>No Video Servers Available</h3>
            <p>This movie doesn't have any video servers configured yet.</p>
            {poster && (
              <div className="movie-poster-fallback">
                <img src={poster} alt={title} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-player-section">
      <div className="video-player-container">
        <video
          ref={videoRef}
          poster={poster || undefined}
          playsInline
          controls
          className="video-player"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
} 