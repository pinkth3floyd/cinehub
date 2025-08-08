import { getSiteSettings as getSiteSettingsFromDB } from '../services/settingsService';
import type { SiteSettings } from '../config/settings';

// Cache for site settings
let siteSettingsCache: SiteSettings | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSiteSettings(): Promise<SiteSettings> {
  // Check cache first
  if (siteSettingsCache && Date.now() < cacheExpiry) {
    return siteSettingsCache;
  }
  
  try {
    const settings = await getSiteSettingsFromDB();
    siteSettingsCache = settings;
    cacheExpiry = Date.now() + CACHE_DURATION;
    return settings;
  } catch (error) {
    console.error('Failed to load site settings:', error);
    // Return default settings if database fails
    return {
      site_name: 'CineHub',
      site_description: 'Online Movies, TV Shows & Cinema',
      site_keywords: 'movies, tv shows, cinema, streaming, entertainment',
      site_author: 'CineHub Team',
      admin_email: 'admin@cinehub.com',
      meta_title: 'CineHub - Online Movies, TV Shows & Cinema',
      meta_description: 'Watch the latest movies and TV shows online. Stream your favorite content anytime, anywhere.',
      og_image: '',
      twitter_card: 'summary_large_image',
      items_per_page: '12',
      featured_items_count: '6',
      enable_comments: 'true',
      enable_reviews: 'true',
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      youtube_url: '',
      contact_email: 'contact@cinehub.com',
      contact_phone: '',
      contact_address: '',
      google_analytics_id: '',
      facebook_pixel_id: '',
    };
  }
}

export async function getSiteMetadata(pageTitle?: string, pageDescription?: string) {
  const settings = await getSiteSettings();
  
  const title = pageTitle 
    ? `${pageTitle} - ${settings.site_name}`
    : settings.meta_title || settings.site_name;
    
  const description = pageDescription || settings.meta_description || settings.site_description;
  
  return {
    title,
    description,
    keywords: settings.site_keywords,
    author: settings.site_author,
    openGraph: {
      title,
      description,
      type: 'website' as const,
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cinehub.com',
      image: settings.og_image,
      siteName: settings.site_name,
    },
    twitter: {
      card: (settings.twitter_card || 'summary_large_image') as 'summary_large_image' | 'summary' | 'player' | 'app',
      title,
      description,
      image: settings.og_image,
    },
    other: {
      'google-analytics': settings.google_analytics_id,
      'facebook-pixel': settings.facebook_pixel_id,
    },
  };
}

export async function getSiteInfo() {
  const settings = await getSiteSettings();
  
  return {
    name: settings.site_name,
    description: settings.site_description,
    contact: {
      email: settings.contact_email,
      phone: settings.contact_phone,
      address: settings.contact_address,
    },
    social: {
      facebook: settings.facebook_url,
      twitter: settings.twitter_url,
      instagram: settings.instagram_url,
      youtube: settings.youtube_url,
    },
    display: {
      itemsPerPage: parseInt(settings.items_per_page || '12'),
      featuredItemsCount: parseInt(settings.featured_items_count || '6'),
      enableComments: settings.enable_comments === 'true',
      enableReviews: settings.enable_reviews === 'true',
    },
  };
}

// Clear cache (useful for testing or when settings are updated)
export function clearSiteSettingsCache() {
  siteSettingsCache = null;
  cacheExpiry = 0;
} 