'use client';

import React from 'react';
import MovieVideoPlayer from '../details/[id]/components/MovieVideoPlayer';

export default function TestLockerPage() {
  // Test video URL and duration
  const testVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const testDuration = 596; // BigBuckBunny duration in seconds
  
  console.log('TestLockerPage: testDuration =', testDuration);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Content Locker Test Page</h1>
      <p>This page tests the content locker functionality.</p>
      <p>Click the play button to trigger the locker at 0% duration.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => {
            console.log('TestLockerPage: Loading BigBuckBunny video');
          }}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Load BigBuckBunny Video
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Testing Instructions:</h3>
        <ol>
          <li>Click the play button on the video below</li>
          <li>The content locker should appear immediately</li>
          <li>Complete the locker to resume video playback</li>
          <li>Check browser console for debugging messages</li>
        </ol>
      </div>

      <MovieVideoPlayer 
        videoUrl={testVideoUrl}
        poster={null}
        title="Test Video"
        hasServers={true}
        duration={testDuration}
      />
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Debug Information:</h3>
        <p><strong>Video URL:</strong> {testVideoUrl}</p>
        <p><strong>Duration:</strong> {testDuration} seconds</p>
        <p><strong>Trigger Time:</strong> 0 seconds (immediate)</p>
        <p><strong>Expected Behavior:</strong> Locker appears immediately when play is clicked</p>
      </div>
    </div>
  );
} 