'use server';

import { 
  getAllSystemSettingsAsMap, 
  createSystemSetting, 
  updateSystemSettingByKey,
  getSystemSettingByKey 
} from '../entities/systemsettings/actions';
import { 
  defaultSiteSettings, 
  defaultContentLockerSettings,
  type SiteSettings,
  type ContentLockerSettings,
  type AllSettings
} from '../config/settings';

// Cache for settings
let settingsCache: Map<string, string> | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function loadSettingsToCache(): Promise<void> {
  const result = await getAllSystemSettingsAsMap();
  if (result.success && result.data) {
    settingsCache = new Map(Object.entries(result.data));
    cacheExpiry = Date.now() + CACHE_DURATION;
  } else {
    settingsCache = new Map();
    cacheExpiry = Date.now() + CACHE_DURATION;
  }
}

async function getCachedSettings(): Promise<Map<string, string>> {
  if (!settingsCache || Date.now() > cacheExpiry) {
    await loadSettingsToCache();
  }
  return settingsCache!;
}

async function getSettingsMap(): Promise<Record<string, string>> {
  const settingsMap = await getCachedSettings();
  return Object.fromEntries(settingsMap);
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    // Site Settings
    site_name: 'Website name displayed throughout the site',
    site_description: 'Brief description of the website',
    site_keywords: 'SEO keywords for the website',
    site_author: 'Website author or company name',
    admin_email: 'Administrator email address',
    meta_title: 'Default meta title for pages',
    meta_description: 'Default meta description for pages',
    og_image: 'Default Open Graph image URL',
    twitter_card: 'Twitter card type (summary, summary_large_image, etc.)',
    items_per_page: 'Number of items to display per page',
    featured_items_count: 'Number of featured items to display',
    enable_comments: 'Enable or disable comments system',
    enable_reviews: 'Enable or disable reviews system',
    facebook_url: 'Facebook page URL',
    twitter_url: 'Twitter profile URL',
    instagram_url: 'Instagram profile URL',
    youtube_url: 'YouTube channel URL',
    contact_email: 'Contact email address',
    contact_phone: 'Contact phone number',
    contact_address: 'Contact address',
    google_analytics_id: 'Google Analytics tracking ID',
    facebook_pixel_id: 'Facebook Pixel tracking ID',
    
    // Content Locker Settings
    cpagrip_enabled: 'Enable or disable CPAGrip content locker',
    cpagrip_script_id: 'CPAGrip script ID for tracking',
    cpagrip_html_content: 'Custom HTML content for the content locker',
    locker_enabled: 'Enable or disable content locker functionality',
    trigger_percentage: 'Percentage of video duration to trigger locker',
    only_direct_videos: 'Only show locker on direct video files',
    skip_if_no_duration: 'Skip locker if video duration is not available',
    min_duration: 'Minimum video duration to show locker (seconds)',
    overlay_opacity: 'Opacity of the locker overlay (0.0 to 1.0)',
    border_radius: 'Border radius of the locker modal',
    max_width: 'Maximum width of the locker modal',
    max_height: 'Maximum height of the locker modal',
    padding: 'Padding of the locker modal',
  };
  
  return descriptions[key] || 'System setting';
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSettingsMap();
  const siteSettings: SiteSettings = {} as SiteSettings;
  
  // Map database settings to site settings
  for (const [key, value] of Object.entries(defaultSiteSettings)) {
    siteSettings[key as keyof SiteSettings] = settings[key] || value;
  }
  
  return siteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        updateSetting(key, value as string)
      )
    );
    
    const hasError = results.some(result => !result.success);
    if (hasError) {
      return { success: false, error: 'Some settings failed to update' };
    }
    
    // Clear cache to reload settings
    settingsCache = null;
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update site settings' };
  }
}

// Content Locker Settings
export async function getContentLockerSettings(): Promise<ContentLockerSettings> {
  const settings = await getSettingsMap();
  const contentLockerSettings: ContentLockerSettings = {} as ContentLockerSettings;
  
  // Map database settings to content locker settings
  for (const [key, value] of Object.entries(defaultContentLockerSettings)) {
    contentLockerSettings[key as keyof ContentLockerSettings] = settings[key] || value;
  }
  
  return contentLockerSettings;
}

export async function updateContentLockerSettings(settings: Partial<ContentLockerSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        updateSetting(key, value as string)
      )
    );
    
    const hasError = results.some(result => !result.success);
    if (hasError) {
      return { success: false, error: 'Some settings failed to update' };
    }
    
    // Clear cache to reload settings
    settingsCache = null;
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update content locker settings' };
  }
}

// All Settings
export async function getAllSettings(): Promise<AllSettings> {
  const [siteSettings, contentLockerSettings] = await Promise.all([
    getSiteSettings(),
    getContentLockerSettings()
  ]);
  
  return { ...siteSettings, ...contentLockerSettings };
}

export async function updateAllSettings(settings: Partial<AllSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        updateSetting(key, value as string)
      )
    );
    
    const hasError = results.some(result => !result.success);
    if (hasError) {
      return { success: false, error: 'Some settings failed to update' };
    }
    
    // Clear cache to reload settings
    settingsCache = null;
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update settings' };
  }
}

// Initialization
export async function initializeDefaultSettings(): Promise<{ success: boolean; error?: string }> {
  try {
    const allDefaultSettings = { ...defaultSiteSettings, ...defaultContentLockerSettings };
    const results = [];
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const [key, value] of Object.entries(allDefaultSettings)) {
      const existingSetting = await getSystemSettingByKey(key);
      if (!existingSetting.success) {
        const result = await createSystemSetting({
          key,
          value,
          description: getSettingDescription(key)
        });
        results.push(result);
        if (result.success) {
          createdCount++;
        }
      } else {
        skippedCount++;
      }
    }
    
    const hasError = results.some(result => !result.success);
    if (hasError) {
      return { success: false, error: 'Some default settings failed to initialize' };
    }
    
    // Clear cache to reload settings
    settingsCache = null;
    
    console.log(`✅ Settings initialization complete: ${createdCount} created, ${skippedCount} already existed`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to initialize default settings' };
  }
}

// Individual Settings
export async function getSetting(key: string): Promise<string | null> {
  const settings = await getCachedSettings();
  return settings.get(key) || null;
}

export async function updateSetting(key: string, value: string, description?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existingSetting = await getSystemSettingByKey(key);
    
    if (existingSetting.success) {
      // Update existing setting
      const result = await updateSystemSettingByKey(key, {
        value,
        description: description || existingSetting.data?.description || undefined
      });
      return result;
    } else {
      // Create new setting
      const result = await createSystemSetting({
        key,
        value,
        description: description || getSettingDescription(key)
      });
      return result;
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update setting' };
  }
} 