'use client';

import React, { useState } from 'react';
import MovieVideoPlayer from '../details/[id]/components/MovieVideoPlayer';

export default function TestLockerPage() {
  const [showDialog, setShowDialog] = useState(false);
  
  // Test video URL and duration
  const testVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const testDuration = 596; // BigBuckBunny duration in seconds
  
  // CPAGrip HTML content as a data URL
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Content Locker</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }
        button:hover {
            background: #0056b3;
        }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
    </style>
    
    <script type="text/javascript">var lck = false;</script>
    <script type="text/javascript" src="https://epctrk.com/script_include.php?id=1833719"></script>
    <script type="text/javascript">if(!lck){top.location = 'https://epctrk.com/help/ablk.php?lkt=1'; }</script>
    <noscript>Please enable JavaScript to access this page.<meta http-equiv="refresh" content="0;url=https://epctrk.com/help/enable_javascript.php?lkt=1" /></noscript>
</head>
<body>
    <div class="container">
        <h1>🔒 Content Locker</h1>
        <p>To unlock this content, please complete the verification below.</p>
        <p>This helps us maintain quality content and prevent abuse.</p>
        <button onclick="call_locker();">🚀 Click to Unlock Content</button>
    </div>
</body>
</html>`;

  // Create data URL from HTML content
  const iframeUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  
  console.log('TestLockerPage: testDuration =', testDuration);

  // Function to handle button click and show dialog
  const handleLockerClick = () => {
    console.log('TestLockerPage: Opening unclosable dialog with CPAGrip content');
    setShowDialog(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>CPAGrip Content Locker Test Page</h1>
      <p>This page tests the CPAGrip content locker functionality.</p>
      <p>Click the button below to trigger the unclosable dialog with CPAGrip content.</p>
      
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
          <li>Click the "Trigger CPAGrip Locker" button below</li>
          <li>An unclosable dialog box will appear with CPAGrip content</li>
          <li>Click "Click to Unlock Content" in the iframe</li>
          <li>Complete the CPAGrip locker to unlock content</li>
          <li>Check browser console for debugging messages</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '5px', border: '2px solid #2196f3' }}>
        <h3>CPAGrip Locker Test</h3>
        <p><strong>Locker Type:</strong> Unclosable Dialog with CPAGrip iFrame</p>
        <p><strong>Content:</strong> Direct HTML with CPAGrip scripts</p>
        
        <button 
          className="btn btn-primary" 
          onClick={handleLockerClick}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          🚀 Trigger CPAGrip Locker
        </button>
        
        <p style={{ fontSize: '12px', marginTop: '10px', color: '#6c757d' }}>
          This button will open an unclosable dialog with CPAGrip content
        </p>
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
        <p><strong>Content Type:</strong> Direct HTML with CPAGrip scripts</p>
        <p><strong>Dialog Status:</strong> 
          <span style={{ 
            color: showDialog ? '#dc3545' : '#28a745', 
            fontWeight: 'bold',
            marginLeft: '5px'
          }}>
            {showDialog ? '🔒 Dialog Open' : '✅ Dialog Closed'}
          </span>
        </p>
        <p><strong>Dialog Type:</strong> Unclosable (no close button, no escape key)</p>
        <p><strong>CPAGrip Script:</strong> https://epctrk.com/script_include.php?id=1833719</p>
      </div>

      {/* Unclosable Dialog with CPAGrip iFrame */}
      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '90%',
            height: '90%',
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Header with title */}
            <div style={{
              padding: '15px 20px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>CPAGrip Content Locker</h3>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Complete to unlock content
              </div>
            </div>
            
            {/* iFrame Container */}
            <div style={{
              width: '100%',
              height: 'calc(100% - 60px)', // Subtract header height
              position: 'relative'
            }}>
              <iframe
                src={iframeUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '0 0 10px 10px'
                }}
                title="CPAGrip Content Locker"
                allowFullScreen
                sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 