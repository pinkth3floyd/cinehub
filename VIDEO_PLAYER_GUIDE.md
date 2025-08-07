# Video Player Guide

## Overview

The MovieVideoPlayer component now supports multiple types of video URLs and automatically detects the appropriate playback method.

## Supported URL Types

### 1. YouTube URLs
- **Watch URLs**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Short URLs**: `https://youtu.be/VIDEO_ID`
- **Embed URLs**: `https://www.youtube.com/embed/VIDEO_ID`

**Playback Method**: Embedded iframe with YouTube player

### 2. External Video Hosting Services
- **VidSrc URLs**: 
  - `https://vidsrc.xyz/embed/movie/MOVIE_ID`
  - `https://vidsrc.to/embed/movie/MOVIE_ID`
  - `https://vidsrc.me/embed/movie/MOVIE_ID`
  - `https://vidsrc.net/embed/movie/MOVIE_ID`
  - `https://vidsrc.com/embed/movie/MOVIE_ID`
- **Other Embed URLs**: Any URL containing `embed` or `player` keywords

**Playback Method**: Embedded iframe with external player

### 3. Direct Video Files
- **MP4 Files**: `https://example.com/video.mp4`
- **Other Video Formats**: `https://example.com/video.mkv`, `https://example.com/video.webm`

**Playback Method**: HTML5 video element with Plyr player

## URL Detection Logic

The component automatically detects URL types using the following logic:

```typescript
// YouTube detection
const isYouTube = videoUrl ? (
  videoUrl.includes('youtube.com/embed') || 
  videoUrl.includes('youtu.be') || 
  videoUrl.includes('youtube.com/watch')
) : false;

// External video hosting detection
const isExternalVideoHost = videoUrl ? (
  videoUrl.includes('vidsrc.xyz') || 
  videoUrl.includes('vidsrc.to') ||
  videoUrl.includes('vidsrc.me') ||
  videoUrl.includes('vidsrc.net') ||
  videoUrl.includes('vidsrc.com') ||
  videoUrl.includes('embed') ||
  videoUrl.includes('player')
) : false;

// Determine if iframe should be used
const shouldUseIframe = isYouTube || isExternalVideoHost;
```

## Adding New Video URLs

### Through Admin Interface

1. Go to Admin → Catalog → Add/Edit Movie
2. In the "Servers" section, click "Add Server"
3. Enter the server name and URL
4. Save the movie

### Supported URL Examples

```
YouTube:
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- https://youtu.be/dQw4w9WgXcQ

VidSrc:
- https://vidsrc.xyz/embed/movie/1100988
- https://vidsrc.to/embed/movie/1100988

Direct Video:
- https://example.com/movie.mp4
- https://cdn.example.com/video.mkv
```

## Styling

The video player includes responsive styling for all URL types:

- **Iframe Embeds**: 16:9 aspect ratio, responsive design
- **Video Elements**: Full Plyr player controls
- **Fallback**: Poster image display when no video is available

## Error Handling

- **No Servers**: Shows fallback message with poster image
- **Invalid URLs**: Displays error message
- **Loading Issues**: Graceful degradation to poster image

## Browser Compatibility

- **Iframe Embeds**: Supported by all modern browsers
- **HTML5 Video**: Supported by all modern browsers
- **Plyr Player**: Enhanced controls for supported browsers 