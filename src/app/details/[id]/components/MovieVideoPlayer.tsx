'use client';

import React, { useEffect, useRef, useState } from 'react';
import ContentLocker from './ContentLocker';
import { shouldShowLocker, getTriggerTime } from '../../../core/config/contentLocker';

// Plyr type declaration
declare global {
  interface Window {
    Plyr: any;
  }
}

interface Server {
  id: string;
  name: string;
  url: string;
  quality?: string;
  language?: string;
  videoType: 'mp4' | 'iframe' | 'youtube';
}

interface MovieVideoPlayerProps {
  selectedServer: Server | null;
  poster?: string | null;
  title: string;
  hasServers: boolean;
  duration?: number; // Movie duration in seconds
}

export default function MovieVideoPlayer({ 
  selectedServer, 
  poster, 
  title, 
  hasServers, 
  duration 
}: MovieVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [showLocker, setShowLocker] = useState(false);
  const [lockerTriggered, setLockerTriggered] = useState(false);
  const [hasUserStartedPlaying, setHasUserStartedPlaying] = useState(false);
  const [lockerEnabled, setLockerEnabled] = useState(false);
  const [triggerTime, setTriggerTime] = useState(0);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [processedUrl, setProcessedUrl] = useState<string>('');

  // Process URL based on video type
  useEffect(() => {
    if (!selectedServer?.url) {
      setProcessedUrl('');
      return;
    }

    const { url, videoType } = selectedServer;
    let processed = url;

    switch (videoType) {
      case 'youtube':
        // Convert various YouTube URL formats to embed URL
        if (url.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1]?.split('?')[0];
          processed = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('youtube.com/watch?v=')) {
          const videoId = url.split('v=')[1]?.split('&')[0];
          processed = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('youtube.com/embed/')) {
          processed = url; // Already embed URL
        } else {
          // Assume it's a video ID
          processed = `https://www.youtube.com/embed/${url}`;
        }
        break;

      case 'iframe':
        // For iframe, use the URL as-is (should be embed code or iframe URL)
        processed = url;
        break;

      case 'mp4':
      default:
        // For MP4, use the URL as-is
        processed = url;
        break;
    }

    setProcessedUrl(processed);
  }, [selectedServer]);

  // Load locker settings
  useEffect(() => {
    const loadLockerSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const videoType = selectedServer?.videoType || 'mp4';
        const isIframeType = videoType === 'iframe' || videoType === 'youtube';
        
        const [enabled, trigger] = await Promise.all([
          shouldShowLocker(duration, isIframeType),
          getTriggerTime(duration || 0)
        ]);
        setLockerEnabled(enabled);
        setTriggerTime(trigger);
      } catch (error) {
        console.error('Failed to load locker settings:', error);
        setLockerEnabled(false);
        setTriggerTime(0);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadLockerSettings();
  }, [duration, selectedServer?.videoType]);

  // Handle play event to track when user starts playing
  const handlePlay = () => {
    setHasUserStartedPlaying(true);
    
    // If trigger percentage is 0, trigger locker immediately on play
    if (lockerEnabled && triggerTime === 0) {
      setLockerTriggered(true);
      setShowLocker(true);
      // Pause video after a small delay to ensure locker shows
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 100);
    }
  };

  // Handle video time updates for locker trigger
  const handleTimeUpdate = () => {
    if (lockerTriggered || !lockerEnabled || !hasUserStartedPlaying || isLoadingSettings) {
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    const currentTime = video.currentTime;
    
    // For immediate trigger (triggerTime = 0), trigger as soon as user starts playing
    if (triggerTime === 0 && currentTime > 0.1) {
      setLockerTriggered(true);
      setShowLocker(true);
      video.pause(); // Pause video when locker appears
      return;
    }
    
    // For percentage-based triggers, check if current time has reached trigger time
    if (duration && currentTime >= triggerTime && !lockerTriggered && currentTime > 0.1) {
      setLockerTriggered(true);
      setShowLocker(true);
      video.pause(); // Pause video when locker appears
    }
  };

  // Handle locker completion
  const handleLockerComplete = () => {
    setShowLocker(false);
    // Resume video playback for MP4 videos only
    if (videoRef.current && selectedServer?.videoType === 'mp4') {
      videoRef.current.play();
    }
  };

  // Initialize Plyr player for MP4 videos
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Plyr && selectedServer?.videoType === 'mp4') {
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
        
        // Add Plyr event listeners for play
        playerRef.current.on('play', handlePlay);
      }
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [selectedServer?.videoType]);

  // Update video source when processed URL changes
  useEffect(() => {
    if (processedUrl && videoRef.current && selectedServer?.videoType === 'mp4') {
      // Update the video element source directly
      const videoElement = videoRef.current;
      videoElement.src = processedUrl;
      videoElement.load(); // Force reload the video
      
      // Also update Plyr player if it's initialized
      if (playerRef.current) {
        try {
          playerRef.current.source = {
            type: 'video',
            sources: [
              {
                src: processedUrl,
                type: 'video/mp4',
                size: 720
              }
            ]
          };
        } catch (error) {
          console.error('Failed to update Plyr source:', error);
        }
      }
    }
  }, [processedUrl, selectedServer?.videoType]);

  // Reset locker state when server changes
  useEffect(() => {
    setLockerTriggered(false);
    setShowLocker(false);
    setHasUserStartedPlaying(false);
  }, [selectedServer?.id]);

  // No servers available
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

  // No server selected
  if (!selectedServer) {
    return (
      <div className="movie-player-section">
        <div className="no-servers-message">
          <div className="no-servers-content">
            <i className="ti ti-player-play"></i>
            <h3>Select a Video Server</h3>
            <p>Please select a video server from the list below to start playing.</p>
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

  // No URL available
  if (!processedUrl) {
    return (
      <div className="movie-player-section">
        <div className="no-servers-message">
          <div className="no-servers-content">
            <i className="ti ti-alert-triangle"></i>
            <h3>Invalid Video URL</h3>
            <p>The selected server has an invalid or missing video URL.</p>
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

  // Render iframe for YouTube and iframe types
  if (selectedServer.videoType === 'youtube' || selectedServer.videoType === 'iframe') {
    return (
      <div className="movie-player-section">
        <div className="video-player-container">
          <iframe
            src={processedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={`video-player ${selectedServer.videoType}-embed`}
          />
        </div>
      </div>
    );
  }

  // Render MP4 video with Plyr player
  return (
    <div className="movie-player-section">
      <div className="video-player-container">
        <video
          ref={videoRef}
          poster={poster || undefined}
          playsInline
          controls
          className="video-player"
          key={processedUrl} // Force re-render when URL changes
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
        >
          <source src={processedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Content Locker Overlay */}
        <ContentLocker 
          isVisible={showLocker}
          onComplete={handleLockerComplete}
        />
      </div>
    </div>
  );
}
