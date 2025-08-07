'use client';

import React, { useEffect, useState } from 'react';
import { contentLockerConfig } from '../../../core/config/contentLocker';

// Global type declarations
declare global {
  interface Window {
    completeContentLocker?: () => void;
    cpagripComplete?: () => void;
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
      console.log('ContentLocker: Starting locker process...');
      setIsLoading(true);
      
      // Create a container for CPAGrip to inject its content
      const lockerContainer = document.createElement('div');
      lockerContainer.id = 'cpagrip-locker-container';
      lockerContainer.style.cssText = `
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
      document.body.appendChild(lockerContainer);
      
      // Use the exact CPAGrip code provided by user
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = 'var lck = false;';
      document.head.appendChild(script1);
      console.log('ContentLocker: Added initial script');

      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = 'https://epctrk.com/script_include.php?id=1741216';
      script2.onload = () => {
        console.log('ContentLocker: CPAGrip script loaded successfully');
        
        // Let CPAGrip handle the locker naturally
        const script3 = document.createElement('script');
        script3.type = 'text/javascript';
        script3.innerHTML = `
          console.log('ContentLocker: CPAGrip script executed, lck =', lck);
          
          // Monitor for CPAGrip completion
          let checkInterval = setInterval(() => {
            // Check if CPAGrip has completed or if we need to handle it
            if (document.querySelector('#cpagrip-locker-container .cpagrip-content') || 
                document.querySelector('.cpagrip-overlay') ||
                document.querySelector('[class*="cpagrip"]') ||
                document.querySelector('[class*="survey"]') ||
                document.querySelector('[class*="locker"]')) {
              console.log('ContentLocker: CPAGrip locker detected, monitoring...');
              clearInterval(checkInterval);
              // Hide our loading overlay since CPAGrip is now visible
              window.hideLoadingOverlay && window.hideLoadingOverlay();
            }
          }, 100);
          
          // Set up completion callback for when user completes CPAGrip
          window.cpagripComplete = function() {
            console.log('ContentLocker: CPAGrip completed by user');
            clearInterval(checkInterval);
            window.completeContentLocker && window.completeContentLocker();
          };
          
          // Fallback: if CPAGrip doesn't show after 10 seconds, show fallback
          setTimeout(() => {
            if (!document.querySelector('#cpagrip-locker-container .cpagrip-content') && 
                !document.querySelector('.cpagrip-overlay') &&
                !document.querySelector('[class*="cpagrip"]') &&
                !document.querySelector('[class*="survey"]')) {
              console.log('ContentLocker: CPAGrip not showing after 10s, showing fallback');
              clearInterval(checkInterval);
              window.showFallbackLocker && window.showFallbackLocker();
            }
          }, 10000);
        `;
        document.head.appendChild(script3);
      };
      script2.onerror = () => {
        console.error('ContentLocker: Failed to load CPAGrip script');
        window.showFallbackLocker && window.showFallbackLocker();
      };
      document.head.appendChild(script2);

      // Set up callbacks
      (window as any).hideLoadingOverlay = () => {
        console.log('ContentLocker: Hiding loading overlay');
        setIsLoading(false);
      };

      (window as any).showFallbackLocker = () => {
        console.log('ContentLocker: Showing fallback locker');
        setIsLoading(false);
        setShowFallback(true);
      };

      (window as any).completeContentLocker = () => {
        console.log('ContentLocker: Completion callback triggered');
        setIsLoading(false);
        setShowFallback(false);
        // Remove CPAGrip container
        const container = document.getElementById('cpagrip-locker-container');
        if (container) {
          document.body.removeChild(container);
        }
        onComplete();
      };

      // Cleanup function
      return () => {
        console.log('ContentLocker: Cleaning up scripts');
        try {
          document.head.removeChild(script1);
          if (script2.parentNode) {
            document.head.removeChild(script2);
          }
          const container = document.getElementById('cpagrip-locker-container');
          if (container) {
            document.body.removeChild(container);
          }
        } catch (e) {
          console.log('ContentLocker: Error during cleanup:', e);
        }
        delete (window as any).completeContentLocker;
        delete (window as any).cpagripComplete;
        delete (window as any).hideLoadingOverlay;
        delete (window as any).showFallbackLocker;
      };
    }
  }, [isVisible]);

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
        zIndex: 9998, // Lower than CPAGrip container
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
            <h3>Loading Content Locker...</h3>
            <p>Please wait while we prepare the content locker.</p>
          </div>
        )}
        
        {showFallback && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
            <h3>Content Locker</h3>
            <p>Please complete the survey to continue watching.</p>
            <p>This is a fallback since CPAGrip didn't load properly.</p>
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
          <meta httpEquiv="refresh" content="0;url=https://epctrk.com/help/enable_javascript.php?lkt=2" />
        </noscript>
      </div>
    </div>
  );
} 