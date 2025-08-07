'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function SafeImage({ src, alt, width, height, className, priority = false }: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Determine the final image source
  const getFinalSrc = () => {
    if (imageError) {
      return '/core/assets/img/covers/cover1.jpg';
    }
    
    // If it's an external URL, try to use it
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // If it's a local path, use it
    if (src.startsWith('/')) {
      return src;
    }
    
    // Otherwise, assume it's a local cover image
    return `/core/assets/img/covers/${src}`;
  };

  const finalSrc = getFinalSrc();
  const isExternalUrl = finalSrc.startsWith('http');

  // For external URLs, use regular img tag to bypass Next.js restrictions
  if (isExternalUrl) {
    return (
      <div className="safe-image-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        {imageLoading && (
          <div className="safe-image-loading" style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #000000, #1a1a1a)',
            borderRadius: '12px 12px 0 0',
            zIndex: 1
          }}>
            <div className="loading-spinner"></div>
          </div>
        )}
        <img 
          src={finalSrc}
          alt={alt}
          className={className}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoading ? 'none' : 'block',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  }

  // For local images, use Next.js Image component
  return (
    <div className="safe-image-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {imageLoading && (
        <div className="safe-image-loading" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #000000, #1a1a1a)',
          borderRadius: '12px 12px 0 0',
          zIndex: 1
        }}>
          <div className="loading-spinner"></div>
        </div>
      )}
      <Image 
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: imageLoading ? 'none' : 'block',
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        priority={priority}
      />
    </div>
  );
} 