// Content Locker Configuration
export const contentLockerConfig = {
  // BitLabs settings
  bitlabs: {
    appToken: '35c5e7d5-4246-4f25-8785-26ee309a03e5',
    secretKey: 'LyxH6v6G6zMY4DQnz0sumLzABywNfhzu',
    serverToServerKey: 'j1VBW1uLg4UnyL5f65mSFtpVlU1QTv5V',
    apiUrl: 'https://api.bitlabs.ai',
    sdkUrl: 'https://api.bitlabs.ai/js/sdk.js' // Alternative SDK URL
  },
  
  // Trigger settings
  trigger: {
    percentage: 0, // Percentage of video duration to trigger locker (0 = immediate)
    enabled: false, // Enable/disable content locker
    onlyOnDirectVideos: false, // Only show locker on direct video files, not iframes
    skipIfNoDuration: false // Skip locker if movie duration is not available
  },
  
  // UI settings
  ui: {
    overlayOpacity: 0.95,
    borderRadius: '12px',
    maxWidth: '500px',
    padding: '40px'
  }
};

// Helper function to check if locker should be enabled
export const shouldShowLocker = (duration?: number, isIframe: boolean = false) => {
  console.log('shouldShowLocker: duration =', duration, 'isIframe =', isIframe);
  console.log('shouldShowLocker: trigger.enabled =', contentLockerConfig.trigger.enabled);
  console.log('shouldShowLocker: trigger.onlyOnDirectVideos =', contentLockerConfig.trigger.onlyOnDirectVideos);
  console.log('shouldShowLocker: trigger.skipIfNoDuration =', contentLockerConfig.trigger.skipIfNoDuration);
  
  if (!contentLockerConfig.trigger.enabled) {
    console.log('shouldShowLocker: Locker disabled in config');
    return false;
  }
  if (contentLockerConfig.trigger.onlyOnDirectVideos && isIframe) {
    console.log('shouldShowLocker: Skipping iframe videos');
    return false;
  }
  if (contentLockerConfig.trigger.skipIfNoDuration && !duration) {
    console.log('shouldShowLocker: Skipping due to no duration');
    return false;
  }
  
  console.log('shouldShowLocker: Locker should be enabled');
  return true;
};

// Helper function to calculate trigger time
export const getTriggerTime = (duration: number) => {
  const percentage = contentLockerConfig.trigger.percentage / 100;
  return duration * percentage;
}; 