import { z } from 'zod';

// Site Settings Schema
export const siteSettingsSchema = z.object({
  // Basic Site Info
  site_name: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters'),
  site_description: z.string().min(1, 'Site description is required').max(500, 'Site description must be less than 500 characters'),
  site_keywords: z.string().max(500, 'Keywords must be less than 500 characters').optional(),
  site_author: z.string().max(100, 'Author must be less than 100 characters').optional(),
  admin_email: z.string().email('Invalid email address').optional(),
  
  // SEO Settings
  meta_title: z.string().max(100, 'Meta title must be less than 100 characters').optional(),
  meta_description: z.string().max(300, 'Meta description must be less than 300 characters').optional(),
  og_image: z.string().url('Invalid URL').optional(),
  twitter_card: z.string().max(100, 'Twitter card must be less than 100 characters').optional(),
  
  // Display Settings
  items_per_page: z.string().regex(/^\d+$/, 'Must be a number').optional(),
  featured_items_count: z.string().regex(/^\d+$/, 'Must be a number').optional(),
  enable_comments: z.string().regex(/^(true|false)$/, 'Must be true or false').optional(),
  enable_reviews: z.string().regex(/^(true|false)$/, 'Must be true or false').optional(),
  
  // Social Media
  facebook_url: z.string().url('Invalid URL').optional(),
  twitter_url: z.string().url('Invalid URL').optional(),
  instagram_url: z.string().url('Invalid URL').optional(),
  youtube_url: z.string().url('Invalid URL').optional(),
  
  // Contact Info
  contact_email: z.string().email('Invalid email address').optional(),
  contact_phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  contact_address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  
  // Analytics
  google_analytics_id: z.string().max(50, 'Google Analytics ID must be less than 50 characters').optional(),
  facebook_pixel_id: z.string().max(50, 'Facebook Pixel ID must be less than 50 characters').optional(),
});

// Content Locker Settings Schema
export const contentLockerSettingsSchema = z.object({
  // CPAGrip Settings
  cpagrip_enabled: z.string().regex(/^(true|false)$/, 'Must be true or false'),
  cpagrip_script_id: z.string().max(50, 'Script ID must be less than 50 characters').optional(),
  cpagrip_html_content: z.string().max(10000, 'HTML content must be less than 10000 characters').optional(),
  
  // Trigger Settings
  locker_enabled: z.string().regex(/^(true|false)$/, 'Must be true or false'),
  trigger_percentage: z.string().regex(/^\d+$/, 'Must be a number').optional(),
  only_direct_videos: z.string().regex(/^(true|false)$/, 'Must be true or false').optional(),
  skip_if_no_duration: z.string().regex(/^(true|false)$/, 'Must be true or false').optional(),
  min_duration: z.string().regex(/^\d+$/, 'Must be a number').optional(),
  
  // UI Settings
  overlay_opacity: z.string().regex(/^0\.\d+$/, 'Must be a decimal between 0 and 1').optional(),
  border_radius: z.string().max(20, 'Border radius must be less than 20 characters').optional(),
  max_width: z.string().max(20, 'Max width must be less than 20 characters').optional(),
  max_height: z.string().max(20, 'Max height must be less than 20 characters').optional(),
  padding: z.string().max(20, 'Padding must be less than 20 characters').optional(),
});

// Combined Settings Schema
export const allSettingsSchema = siteSettingsSchema.merge(contentLockerSettingsSchema);

// Default Site Settings
export const defaultSiteSettings = {
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

// Default Content Locker Settings
export const defaultContentLockerSettings = {
  cpagrip_enabled: 'true',
  cpagrip_script_id: '1833719',
  cpagrip_html_content: `<!DOCTYPE html>
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
</html>`,
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

// Settings Categories
export const settingsCategories = {
  site: {
    name: 'Site Settings',
    description: 'Basic site configuration and SEO settings',
    keys: Object.keys(defaultSiteSettings),
  },
  contentLocker: {
    name: 'Content Locker',
    description: 'Content locker configuration and CPAGrip settings',
    keys: Object.keys(defaultContentLockerSettings),
  },
};

// TypeScript types
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type ContentLockerSettings = z.infer<typeof contentLockerSettingsSchema>;
export type AllSettings = z.infer<typeof allSettingsSchema>; 