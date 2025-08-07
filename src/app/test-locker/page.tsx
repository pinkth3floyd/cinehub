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
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
          <h4>CPAGrip Debug:</h4>
          <button 
            onClick={() => {
              console.log('Testing CPAGrip script directly...');
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.innerHTML = 'var lck = false;';
              document.head.appendChild(script);
              
              const script2 = document.createElement('script');
              script2.type = 'text/javascript';
              script2.src = 'https://epctrk.com/script_include.php?id=1741216';
              script2.onload = () => {
                console.log('CPAGrip script loaded directly');
                const script3 = document.createElement('script');
                script3.type = 'text/javascript';
                script3.innerHTML = `
                  console.log('Direct CPAGrip test - lck =', lck);
                  if (!lck) {
                    console.log('Direct test: lck is false, should redirect');
                    // window.location.href = 'https://epctrk.com/help/ablk.php?lkt=2';
                  } else {
                    console.log('Direct test: lck is true');
                  }
                `;
                document.head.appendChild(script3);
              };
              script2.onerror = () => {
                console.error('Direct CPAGrip test failed to load');
              };
              document.head.appendChild(script2);
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            Test CPAGrip Script Directly
          </button>
          
          <button 
            onClick={() => {
              console.log('Testing CPAGrip URL directly...');
              // Try to fetch the CPAGrip script content
              fetch('https://epctrk.com/script_include.php?id=1741216')
                .then(response => {
                  console.log('CPAGrip URL response status:', response.status);
                  return response.text();
                })
                .then(content => {
                  console.log('CPAGrip script content length:', content.length);
                  console.log('CPAGrip script preview:', content.substring(0, 200));
                })
                .catch(error => {
                  console.error('Failed to fetch CPAGrip script:', error);
                });
            }}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            Test CPAGrip URL
          </button>
          
          <button 
            onClick={() => {
              console.log('Testing different CPAGrip script IDs...');
              const testIds = ['1741216', '1741217', '1741218', '1741219'];
              
              testIds.forEach((id, index) => {
                setTimeout(() => {
                  console.log(`Testing CPAGrip ID: ${id}`);
                  const script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.innerHTML = `var lck_${id} = false;`;
                  document.head.appendChild(script);
                  
                  const script2 = document.createElement('script');
                  script2.type = 'text/javascript';
                  script2.src = `https://epctrk.com/script_include.php?id=${id}`;
                  script2.onload = () => {
                    console.log(`CPAGrip ID ${id} loaded successfully`);
                    const script3 = document.createElement('script');
                    script3.type = 'text/javascript';
                    script3.innerHTML = `
                      console.log('CPAGrip ID ${id} - lck =', lck_${id});
                    `;
                    document.head.appendChild(script3);
                  };
                  script2.onerror = () => {
                    console.error(`CPAGrip ID ${id} failed to load`);
                  };
                  document.head.appendChild(script2);
                }, index * 1000);
              });
            }}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test Multiple IDs
          </button>
          
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#6c757d' }}>
            Click these buttons to test CPAGrip script loading and validity
          </p>
        </div>
      </div>
    </div>
  );
} 