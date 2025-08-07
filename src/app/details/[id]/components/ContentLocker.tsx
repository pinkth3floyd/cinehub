'use client';

import React, { useEffect, useState } from 'react';
import { contentLockerConfig } from '../../../core/config/contentLocker';

// Global type declarations
declare global {
  interface Window {
    completeContentLocker?: () => void;
    hideLoadingOverlay?: () => void;
    showFallbackLocker?: () => void;
  }
}

interface ContentLockerProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function ContentLocker({ isVisible, onComplete }: ContentLockerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    console.log('ContentLocker: isVisible changed to', isVisible);
    
    if (isVisible) {
      console.log('ContentLocker: Starting BitLabs locker process...');
      setIsLoading(true);
      
      // Create BitLabs survey container
      const surveyContainer = document.createElement('div');
      surveyContainer.id = 'bitlabs-survey-container';
      surveyContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      document.body.appendChild(surveyContainer);

      // Initialize BitLabs web integration
      const initializeBitLabs = async () => {
        try {
          console.log('ContentLocker: Initializing BitLabs web integration');
          
          // Create BitLabs survey iframe
          const iframe = document.createElement('iframe');
          iframe.src = `https://api.bitlabs.ai/survey?app_token=${contentLockerConfig.bitlabs.appToken}&user_id=user_${Date.now()}`;
          iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 12px;
          `;
          iframe.allow = 'camera; microphone; geolocation';
          
          iframe.onload = () => {
            console.log('ContentLocker: BitLabs survey iframe loaded');
            window.hideLoadingOverlay && window.hideLoadingOverlay();
          };
          
          iframe.onerror = () => {
            console.error('ContentLocker: BitLabs survey iframe failed to load');
            window.showFallbackLocker && window.showFallbackLocker();
          };
          
          surveyContainer.appendChild(iframe);

          // Set up message listener for iframe communication
          const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://api.bitlabs.ai') return;
            
            console.log('ContentLocker: Received message from BitLabs:', event.data);
            
            if (event.data.type === 'survey_completed') {
              console.log('ContentLocker: BitLabs survey completed');
              window.completeContentLocker && window.completeContentLocker();
            } else if (event.data.type === 'survey_closed') {
              console.log('ContentLocker: BitLabs survey closed');
              window.completeContentLocker && window.completeContentLocker();
            }
          };

          window.addEventListener('message', handleMessage);

          // Fallback: if survey doesn't load after 10 seconds
          setTimeout(() => {
            if (!iframe.contentWindow) {
              console.log('ContentLocker: BitLabs survey timeout, showing fallback');
              window.showFallbackLocker && window.showFallbackLocker();
            }
          }, 10000);

        } catch (error) {
          console.error('ContentLocker: Failed to initialize BitLabs:', error);
          window.showFallbackLocker && window.showFallbackLocker();
        }
      };

      // Set up callbacks
      (window as any).hideLoadingOverlay = () => {
        console.log('ContentLocker: Hiding loading overlay');
        setIsLoading(false);
      };

      (window as any).showFallbackLocker = () => {
        console.log('ContentLocker: Showing fallback locker');
        setIsLoading(false);
        setShowFallback(true);
        // Remove BitLabs container
        const container = document.getElementById('bitlabs-survey-container');
        if (container) {
          document.body.removeChild(container);
        }
      };

      (window as any).completeContentLocker = () => {
        console.log('ContentLocker: Completion callback triggered');
        setIsLoading(false);
        setShowFallback(false);
        // Remove BitLabs container
        const container = document.getElementById('bitlabs-survey-container');
        if (container) {
          document.body.removeChild(container);
        }
        onComplete();
      };

      // Start BitLabs integration
      initializeBitLabs();

      // Cleanup function
      return () => {
        console.log('ContentLocker: Cleaning up BitLabs');
        try {
          const container = document.getElementById('bitlabs-survey-container');
          if (container) {
            document.body.removeChild(container);
          }
        } catch (e) {
          console.log('ContentLocker: Error during cleanup:', e);
        }
        delete (window as any).completeContentLocker;
        delete (window as any).hideLoadingOverlay;
        delete (window as any).showFallbackLocker;
      };
    }
  }, [isVisible, onComplete]);

  // Handle fallback completion
  const handleFallbackComplete = () => {
    console.log('ContentLocker: Fallback completed');
    setShowFallback(false);
    onComplete();
  };

  if (!isVisible) {
    console.log('ContentLocker: Not visible, returning null');
    return null;
  }

  console.log('ContentLocker: Rendering locker overlay');
  return (
    <div 
      className="content-locker-overlay"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `rgba(0, 0, 0, ${contentLockerConfig.ui.overlayOpacity})`,
        borderRadius: contentLockerConfig.ui.borderRadius,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="content-locker-container"
        style={{
          background: 'white',
          borderRadius: contentLockerConfig.ui.borderRadius,
          maxWidth: contentLockerConfig.ui.maxWidth,
          padding: contentLockerConfig.ui.padding,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        {isLoading && (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
            <h3>Loading BitLabs Survey...</h3>
            <p>Please wait while we prepare the survey.</p>
          </div>
        )}
        
        {showFallback && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
            <h3>Content Locker</h3>
            <p>Please complete the survey to continue watching.</p>
            <p>This is a fallback since BitLabs didn't load properly.</p>
            <button 
              onClick={handleFallbackComplete}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
            >
              Complete Survey
            </button>
          </div>
        )}
        
        <noscript>
          <p>Please enable JavaScript to access this page.</p>
        </noscript>
      </div>
    </div>
  );
} 