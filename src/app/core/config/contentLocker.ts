import { getContentLockerSettings } from '../services/settingsService';
import type { ContentLockerSettings } from './settings';

// Content Locker Configuration - Now uses database settings
export const contentLockerConfig = {
  // CPAGrip settings
  cpagrip: {
    enabled: true, // Will be overridden by database setting
    scriptId: '1833719', // Will be overridden by database setting
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
</html>` // Will be overridden by database setting
  },
  // Trigger settings
  trigger: {
    percentage: 20, // Will be overridden by database setting
    enabled: true, // Will be overridden by database setting
    onlyOnDirectVideos: false, // Will be overridden by database setting
    skipIfNoDuration: false, // Will be overridden by database setting
    minDuration: 30 // Will be overridden by database setting
  },
  
  // UI settings
  ui: {
    overlayOpacity: 0.95, // Will be overridden by database setting
    borderRadius: '12px', // Will be overridden by database setting
    maxWidth: '90%', // Will be overridden by database setting
    maxHeight: '90%', // Will be overridden by database setting
    padding: '20px' // Will be overridden by database setting
  }
};

// Helper function to get content locker settings from database
export const getContentLockerSettingsFromDB = async (): Promise<ContentLockerSettings> => {
  try {
    return await getContentLockerSettings();
  } catch (error) {
    console.error('Failed to load content locker settings:', error);
    // Return default settings if database fails
    return {
      cpagrip_enabled: 'true',
      cpagrip_script_id: '1833719',
      cpagrip_html_content: contentLockerConfig.cpagrip.htmlContent,
      locker_enabled: 'true',
      trigger_percentage: '20',
      only_direct_videos: 'false',
      skip_if_no_duration: 'false',
      min_duration: '30',
      overlay_opacity: '0.95',
      border_radius: '12px',
      max_width: '90%',
      max_height: '90%',
      padding: '20px',
    };
  }
};

// Helper function to check if locker should be enabled
export const shouldShowLocker = async (duration?: number, isIframe: boolean = false): Promise<boolean> => {
  try {
    const settings = await getContentLockerSettingsFromDB();
    
    if (settings.locker_enabled !== 'true') {
      return false;
    }
    
    if (settings.cpagrip_enabled !== 'true') {
      return false;
    }
    
    if (settings.only_direct_videos === 'true' && isIframe) {
      return false;
    }
    
    // Only check duration if skipIfNoDuration is true
    if (settings.skip_if_no_duration === 'true' && !duration) {
      return false;
    }
    
    // Only check minDuration if duration is available and skipIfNoDuration is true
    if (settings.skip_if_no_duration === 'true' && duration && duration < parseInt(settings.min_duration || '30')) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking locker settings:', error);
    return false;
  }
};

// Helper function to calculate trigger time
export const getTriggerTime = async (duration: number): Promise<number> => {
  try {
    const settings = await getContentLockerSettingsFromDB();
    const percentage = parseInt(settings.trigger_percentage || '20') / 100;
    return duration * percentage;
  } catch (error) {
    console.error('Error calculating trigger time:', error);
    return duration * 0.2; // Default to 20%
  }
};

// Helper function to get CPAGrip HTML content as data URL
export const getCPAGripDataUrl = async (): Promise<string> => {
  try {
    const settings = await getContentLockerSettingsFromDB();
    const htmlContent = settings.cpagrip_html_content || contentLockerConfig.cpagrip.htmlContent;
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  } catch (error) {
    console.error('Error getting CPAGrip data URL:', error);
    return `data:text/html;charset=utf-8,${encodeURIComponent(contentLockerConfig.cpagrip.htmlContent)}`;
  }
};

// Helper function to get UI settings
export const getUISettings = async () => {
  try {
    const settings = await getContentLockerSettingsFromDB();
    return {
      overlayOpacity: parseFloat(settings.overlay_opacity || '0.95'),
      borderRadius: settings.border_radius || '12px',
      maxWidth: settings.max_width || '90%',
      maxHeight: settings.max_height || '90%',
      padding: settings.padding || '20px'
    };
  } catch (error) {
    console.error('Error getting UI settings:', error);
    return {
      overlayOpacity: 0.95,
      borderRadius: '12px',
      maxWidth: '90%',
      maxHeight: '90%',
      padding: '20px'
    };
  }
}; 