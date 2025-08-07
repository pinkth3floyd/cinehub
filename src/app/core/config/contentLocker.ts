// Content Locker Configuration
export const contentLockerConfig = {
  // CPAGrip settings
  cpagrip: {
    scriptId: '1741219', // Your CPAGrip script ID
    scriptUrl: 'https://epctrk.com/script_include.php',
    helpUrl: 'https://epctrk.com/help/ablk.php?lkt=2',
    noscriptUrl: 'https://epctrk.com/help/enable_javascript.php?lkt=2',
    // Alternative script IDs to try if the main one doesn't work
    alternativeIds: ['1741219']
  },
  
  // Trigger settings
  trigger: {
    percentage: 0, // Percentage of video duration to trigger locker (0 = immediate)
    enabled: true, // Enable/disable content locker
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