'use client';

import React, { useEffect, useState } from 'react';
import { contentLockerConfig, getCPAGripDataUrl } from '../../../core/config/contentLocker';

interface ContentLockerProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function ContentLocker({ isVisible, onComplete }: ContentLockerProps) {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [isVisible]);

  // Handle dialog completion (when user closes or completes the locker)
  const handleDialogComplete = () => {
    setShowDialog(false);
    onComplete();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Main overlay */}
      <div 
        className="content-locker-overlay"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `rgba(0, 0, 0, ${contentLockerConfig.ui.overlayOpacity})`,
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div style={{
          width: contentLockerConfig.ui.maxWidth,
          height: contentLockerConfig.ui.maxHeight,
          backgroundColor: 'white',
          borderRadius: contentLockerConfig.ui.borderRadius,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}>
          {/* Header */}
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
              src={getCPAGripDataUrl()}
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

      {/* Unclosable overlay - prevents user from clicking outside */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9997,
          pointerEvents: 'none'
        }}
      />
    </>
  );
} 