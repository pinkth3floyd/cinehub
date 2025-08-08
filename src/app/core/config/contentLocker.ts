// Content Locker Configuration
export const contentLockerConfig = {
  // CPAGrip settings
  cpagrip: {
    enabled: true, // Enable CPAGrip locker
    scriptId: '1833719', // CPAGrip script ID
    htmlContent: `<!DOCTYPE html>
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
</html>`
  },
  // Trigger settings
  trigger: {
    percentage: 0, // Percentage of video duration to trigger locker (10% = 10 seconds into a 100-second video)
    enabled: true, // Enable/disable content locker
    onlyOnDirectVideos: false, // Only show locker on direct video files, not iframes
    skipIfNoDuration: false, // Skip locker if movie duration is not available
    minDuration: 30 // Minimum video duration in seconds to show locker
  },
  
  // UI settings
  ui: {
    overlayOpacity: 0.95,
    borderRadius: '12px',
    maxWidth: '90%',
    maxHeight: '90%',
    padding: '20px'
  }
};

// Helper function to check if locker should be enabled
export const shouldShowLocker = (duration?: number, isIframe: boolean = false) => {
  console.log('shouldShowLocker: duration =', duration, 'isIframe =', isIframe);
  console.log('shouldShowLocker: trigger.enabled =', contentLockerConfig.trigger.enabled);
  console.log('shouldShowLocker: trigger.onlyOnDirectVideos =', contentLockerConfig.trigger.onlyOnDirectVideos);
  console.log('shouldShowLocker: trigger.skipIfNoDuration =', contentLockerConfig.trigger.skipIfNoDuration);
  console.log('shouldShowLocker: cpagrip.enabled =', contentLockerConfig.cpagrip.enabled);
  
  if (!contentLockerConfig.trigger.enabled) {
    console.log('shouldShowLocker: Locker disabled in config');
    return false;
  }
  
  if (!contentLockerConfig.cpagrip.enabled) {
    console.log('shouldShowLocker: CPAGrip disabled in config');
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
  
  if (duration && duration < contentLockerConfig.trigger.minDuration) {
    console.log('shouldShowLocker: Video too short, duration =', duration);
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

// Helper function to get CPAGrip HTML content as data URL
export const getCPAGripDataUrl = () => {
  const htmlContent = contentLockerConfig.cpagrip.htmlContent;
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}; 