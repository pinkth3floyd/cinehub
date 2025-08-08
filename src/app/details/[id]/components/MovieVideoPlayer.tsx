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

interface MovieVideoPlayerProps {
  videoUrl: string;
  poster?: string | null;
  title: string;
  hasServers: boolean;
  duration?: number; // Movie duration in seconds
}

export default function MovieVideoPlayer({ videoUrl, poster, title, hasServers, duration }: MovieVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [showLocker, setShowLocker] = useState(false);
  const [lockerTriggered, setLockerTriggered] = useState(false);
  const [hasUserStartedPlaying, setHasUserStartedPlaying] = useState(false);
  
  console.log('MovieVideoPlayer: Received duration =', duration);
  console.log('MovieVideoPlayer: videoUrl =', videoUrl);
  
  // Detect different types of video URLs
  const isYouTube = videoUrl ? (videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com/watch')) : false;
  const isExternalVideoHost = videoUrl ? (
    videoUrl.includes('vidsrc.xyz') || 
    videoUrl.includes('vidsrc.to') ||
    videoUrl.includes('vidsrc.me') ||
    videoUrl.includes('vidsrc.net') ||
    videoUrl.includes('vidsrc.com') ||
    videoUrl.includes('embed') ||
    videoUrl.includes('player')
  ) : false;
  
  // Convert to embed URL if needed
  const youtubeEmbedUrl = (() => {
    if (!videoUrl || !isYouTube) return '';
    
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl; // Already an embed URL
  })();

  // Determine if we should use iframe for external video hosts
  const shouldUseIframe = isYouTube || isExternalVideoHost;
  const iframeUrl = isYouTube ? youtubeEmbedUrl : (isExternalVideoHost ? videoUrl : '');

  // Check if locker should be enabled for this video
  const lockerEnabled = shouldShowLocker(duration, shouldUseIframe);
  
  console.log('MovieVideoPlayer: lockerEnabled =', lockerEnabled);
  console.log('MovieVideoPlayer: shouldUseIframe =', shouldUseIframe);

  // Handle play event to track when user starts playing
  const handlePlay = () => {
    console.log('MovieVideoPlayer: User started playing video');
    
    setHasUserStartedPlaying(true);
  };

  // Handle video time updates for locker trigger
  const handleTimeUpdate = () => {
    console.log('MovieVideoPlayer: handleTimeUpdate called');
    console.log('MovieVideoPlayer: lockerTriggered =', lockerTriggered);
    console.log('MovieVideoPlayer: lockerEnabled =', lockerEnabled);
    console.log('MovieVideoPlayer: duration =', duration);
    console.log('MovieVideoPlayer: hasUserStartedPlaying =', hasUserStartedPlaying);
    
    if (lockerTriggered || !lockerEnabled || !duration || !hasUserStartedPlaying) {
      if (lockerTriggered) console.log('MovieVideoPlayer: Locker already triggered, skipping');
      if (!lockerEnabled) console.log('MovieVideoPlayer: Locker not enabled');
      if (!duration) console.log('MovieVideoPlayer: No duration available');
      if (!hasUserStartedPlaying) console.log('MovieVideoPlayer: User has not started playing yet');
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    const currentTime = video.currentTime;
    const triggerTime = getTriggerTime(duration);
    
    console.log(`MovieVideoPlayer: Current time: ${currentTime}s, Trigger time: ${triggerTime}s, Duration: ${duration}s`);
    
    // Add a small delay to ensure user has actually started playing
    if (currentTime >= triggerTime && !lockerTriggered && currentTime > 0.1) {
      console.log('MovieVideoPlayer: Triggering content locker!');
      setLockerTriggered(true);
      setShowLocker(true);
      video.pause(); // Pause video when locker appears
    }
  };

  // Handle locker completion
  const handleLockerComplete = () => {
    console.log('MovieVideoPlayer: Locker completed, resuming video');
    setShowLocker(false);
    // Resume video playback
    if (videoRef.current && !shouldUseIframe) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    // Initialize Plyr player when component mounts
    if (typeof window !== 'undefined' && window.Plyr) {
      if (videoRef.current && !shouldUseIframe) {
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
  }, [shouldUseIframe]);

  // Update video source when videoUrl changes
  useEffect(() => {
    if (videoUrl && videoRef.current && !shouldUseIframe) {
      // Update the video element source directly
      const videoElement = videoRef.current;
      videoElement.src = videoUrl;
      videoElement.load(); // Force reload the video
      
      // Also update Plyr player if it's initialized
      if (playerRef.current) {
        try {
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
        } catch (error) {
          console.log('Plyr source update failed, using direct video element:', error);
        }
      }
    }
  }, [videoUrl, shouldUseIframe]);

  // Reset locker state when video URL changes
  useEffect(() => {
    setLockerTriggered(false);
    setShowLocker(false);
    setHasUserStartedPlaying(false);
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

  if (shouldUseIframe && iframeUrl) {
    return (
      <div className="movie-player-section" >
        <div className="video-player-container">
          <iframe
            src={iframeUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="video-player external-embed"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              border: 'none',
              borderRadius: '12px'
            }}
          />
        </div>
      </div>
    );
  }

  // Don't render video element if no URL is provided
  if (!videoUrl) {
    return (
      <div className="movie-player-section">
        <div className="no-servers-message">
          <div className="no-servers-content">
            <i className="ti ti-alert-circle"></i>
            <h3>No Video URL Available</h3>
            <p>Please select a video server to start playing.</p>
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
          key={videoUrl} // Force re-render when URL changes
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
        >
          <source src={videoUrl} type="video/mp4" />
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