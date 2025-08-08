'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../core/ui/components/AdminLayout';
import { 
  getSiteSettings, 
  getContentLockerSettings, 
  updateSiteSettings, 
  updateContentLockerSettings 
} from '../../core/services/settingsService';
import { defaultSiteSettings, defaultContentLockerSettings, settingsCategories } from '../../core/config/settings';
import type { SiteSettings, ContentLockerSettings } from '../../core/config/settings';

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'site' | 'contentLocker'>('site');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  
  // Content Locker Settings
  const [contentLockerSettings, setContentLockerSettings] = useState<ContentLockerSettings>({} as ContentLockerSettings);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [site, contentLocker] = await Promise.all([
        getSiteSettings(),
        getContentLockerSettings()
      ]);
      
      setSiteSettings(site);
      setContentLockerSettings(contentLocker);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingChange = (key: keyof SiteSettings, value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleContentLockerSettingChange = (key: keyof ContentLockerSettings, value: string) => {
    setContentLockerSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      let result;
      
      if (activeTab === 'site') {
        result = await updateSiteSettings(siteSettings);
      } else {
        result = await updateContentLockerSettings(contentLockerSettings);
      }
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      if (activeTab === 'site') {
        setSiteSettings(defaultSiteSettings as SiteSettings);
      } else {
        setContentLockerSettings(defaultContentLockerSettings as ContentLockerSettings);
      }
      
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const renderSiteSettings = () => (
    <div className="row">
      <div className="col-12">
        <div className="main__title">
          <h2>Site Settings</h2>
          <p>Configure basic site information, SEO settings, and display options.</p>
        </div>
      </div>
      
      <div className="col-12">
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-info-circle"></i> Basic Site Information</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="site_name">Site Name *</label>
                <input
                  type="text"
                  id="site_name"
                  className="sign__input"
                  value={siteSettings.site_name || ''}
                  onChange={(e) => handleSiteSettingChange('site_name', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="admin_email">Admin Email</label>
                <input
                  type="email"
                  id="admin_email"
                  className="sign__input"
                  value={siteSettings.admin_email || ''}
                  onChange={(e) => handleSiteSettingChange('admin_email', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="sign__group">
                <label className="sign__label" htmlFor="site_description">Site Description *</label>
                <textarea
                  id="site_description"
                  className="sign__textarea"
                  value={siteSettings.site_description || ''}
                  onChange={(e) => handleSiteSettingChange('site_description', e.target.value)}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="sign__group">
                <label className="sign__label" htmlFor="site_keywords">Keywords</label>
                <input
                  type="text"
                  id="site_keywords"
                  className="sign__input"
                  value={siteSettings.site_keywords || ''}
                  onChange={(e) => handleSiteSettingChange('site_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-search"></i> SEO Settings</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="meta_title">Default Meta Title</label>
                <input
                  type="text"
                  id="meta_title"
                  className="sign__input"
                  value={siteSettings.meta_title || ''}
                  onChange={(e) => handleSiteSettingChange('meta_title', e.target.value)}
                  placeholder="Default page title"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="meta_description">Default Meta Description</label>
                <input
                  type="text"
                  id="meta_description"
                  className="sign__input"
                  value={siteSettings.meta_description || ''}
                  onChange={(e) => handleSiteSettingChange('meta_description', e.target.value)}
                  placeholder="Default page description"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="og_image">Open Graph Image URL</label>
                <input
                  type="url"
                  id="og_image"
                  className="sign__input"
                  value={siteSettings.og_image || ''}
                  onChange={(e) => handleSiteSettingChange('og_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="twitter_card">Twitter Card Type</label>
                <select
                  id="twitter_card"
                  className="sign__select"
                  value={siteSettings.twitter_card || 'summary_large_image'}
                  onChange={(e) => handleSiteSettingChange('twitter_card', e.target.value)}
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-settings"></i> Display Settings</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="items_per_page">Items Per Page</label>
                <input
                  type="number"
                  id="items_per_page"
                  className="sign__input"
                  value={siteSettings.items_per_page || '12'}
                  onChange={(e) => handleSiteSettingChange('items_per_page', e.target.value)}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="featured_items_count">Featured Items Count</label>
                <input
                  type="number"
                  id="featured_items_count"
                  className="sign__input"
                  value={siteSettings.featured_items_count || '6'}
                  onChange={(e) => handleSiteSettingChange('featured_items_count', e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="enable_comments">Enable Comments</label>
                <select
                  id="enable_comments"
                  className="sign__select"
                  value={siteSettings.enable_comments || 'true'}
                  onChange={(e) => handleSiteSettingChange('enable_comments', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="enable_reviews">Enable Reviews</label>
                <select
                  id="enable_reviews"
                  className="sign__select"
                  value={siteSettings.enable_reviews || 'true'}
                  onChange={(e) => handleSiteSettingChange('enable_reviews', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-brand-facebook"></i> Social Media</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="facebook_url">Facebook URL</label>
                <input
                  type="url"
                  id="facebook_url"
                  className="sign__input"
                  value={siteSettings.facebook_url || ''}
                  onChange={(e) => handleSiteSettingChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="twitter_url">Twitter URL</label>
                <input
                  type="url"
                  id="twitter_url"
                  className="sign__input"
                  value={siteSettings.twitter_url || ''}
                  onChange={(e) => handleSiteSettingChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="instagram_url">Instagram URL</label>
                <input
                  type="url"
                  id="instagram_url"
                  className="sign__input"
                  value={siteSettings.instagram_url || ''}
                  onChange={(e) => handleSiteSettingChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="youtube_url">YouTube URL</label>
                <input
                  type="url"
                  id="youtube_url"
                  className="sign__input"
                  value={siteSettings.youtube_url || ''}
                  onChange={(e) => handleSiteSettingChange('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-mail"></i> Contact Information</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="contact_email">Contact Email</label>
                <input
                  type="email"
                  id="contact_email"
                  className="sign__input"
                  value={siteSettings.contact_email || ''}
                  onChange={(e) => handleSiteSettingChange('contact_email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="contact_phone">Contact Phone</label>
                <input
                  type="tel"
                  id="contact_phone"
                  className="sign__input"
                  value={siteSettings.contact_phone || ''}
                  onChange={(e) => handleSiteSettingChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="sign__group">
                <label className="sign__label" htmlFor="contact_address">Contact Address</label>
                <textarea
                  id="contact_address"
                  className="sign__textarea"
                  value={siteSettings.contact_address || ''}
                  onChange={(e) => handleSiteSettingChange('contact_address', e.target.value)}
                  placeholder="Enter contact address"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-chart-line"></i> Analytics</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="google_analytics_id">Google Analytics ID</label>
                <input
                  type="text"
                  id="google_analytics_id"
                  className="sign__input"
                  value={siteSettings.google_analytics_id || ''}
                  onChange={(e) => handleSiteSettingChange('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="facebook_pixel_id">Facebook Pixel ID</label>
                <input
                  type="text"
                  id="facebook_pixel_id"
                  className="sign__input"
                  value={siteSettings.facebook_pixel_id || ''}
                  onChange={(e) => handleSiteSettingChange('facebook_pixel_id', e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentLockerSettings = () => (
    <div className="row">
      <div className="col-12">
        <div className="main__title">
          <h2>Content Locker Settings</h2>
          <p>Configure CPAGrip content locker and trigger settings.</p>
        </div>
      </div>
      
      <div className="col-12">
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-shield-lock"></i> CPAGrip Configuration</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="cpagrip_enabled">Enable CPAGrip</label>
                <select
                  id="cpagrip_enabled"
                  className="sign__select"
                  value={contentLockerSettings.cpagrip_enabled || 'true'}
                  onChange={(e) => handleContentLockerSettingChange('cpagrip_enabled', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="cpagrip_script_id">CPAGrip Script ID</label>
                <input
                  type="text"
                  id="cpagrip_script_id"
                  className="sign__input"
                  value={contentLockerSettings.cpagrip_script_id || ''}
                  onChange={(e) => handleContentLockerSettingChange('cpagrip_script_id', e.target.value)}
                  placeholder="1833719"
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="sign__group">
                <label className="sign__label" htmlFor="cpagrip_html_content">Custom HTML Content</label>
                <textarea
                  id="cpagrip_html_content"
                  className="sign__textarea"
                  value={contentLockerSettings.cpagrip_html_content || ''}
                  onChange={(e) => handleContentLockerSettingChange('cpagrip_html_content', e.target.value)}
                  placeholder="Enter custom HTML content for the content locker"
                  rows={15}
                />
                <small className="sign__text">This HTML will be used as the content locker page. Include all necessary scripts and styles.</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-clock"></i> Trigger Settings</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="locker_enabled">Enable Content Locker</label>
                <select
                  id="locker_enabled"
                  className="sign__select"
                  value={contentLockerSettings.locker_enabled || 'true'}
                  onChange={(e) => handleContentLockerSettingChange('locker_enabled', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="trigger_percentage">Trigger Percentage</label>
                <input
                  type="number"
                  id="trigger_percentage"
                  className="sign__input"
                  value={contentLockerSettings.trigger_percentage || '20'}
                  onChange={(e) => handleContentLockerSettingChange('trigger_percentage', e.target.value)}
                  min="1"
                  max="100"
                />
                <small className="sign__text">Percentage of video duration to trigger locker (1-100)</small>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="only_direct_videos">Only Direct Videos</label>
                <select
                  id="only_direct_videos"
                  className="sign__select"
                  value={contentLockerSettings.only_direct_videos || 'false'}
                  onChange={(e) => handleContentLockerSettingChange('only_direct_videos', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <small className="sign__text">Only show locker on direct video files, not iframes</small>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="skip_if_no_duration">Skip If No Duration</label>
                <select
                  id="skip_if_no_duration"
                  className="sign__select"
                  value={contentLockerSettings.skip_if_no_duration || 'false'}
                  onChange={(e) => handleContentLockerSettingChange('skip_if_no_duration', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <small className="sign__text">Skip locker if video duration is not available</small>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="min_duration">Minimum Duration (seconds)</label>
                <input
                  type="number"
                  id="min_duration"
                  className="sign__input"
                  value={contentLockerSettings.min_duration || '30'}
                  onChange={(e) => handleContentLockerSettingChange('min_duration', e.target.value)}
                  min="1"
                  max="3600"
                />
                <small className="sign__text">Minimum video duration to show locker</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashbox">
          <div className="dashbox__title">
            <h3><i className="ti ti-palette"></i> UI Settings</h3>
          </div>
          
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="overlay_opacity">Overlay Opacity</label>
                <input
                  type="number"
                  id="overlay_opacity"
                  className="sign__input"
                  value={contentLockerSettings.overlay_opacity || '0.95'}
                  onChange={(e) => handleContentLockerSettingChange('overlay_opacity', e.target.value)}
                  min="0"
                  max="1"
                  step="0.01"
                />
                <small className="sign__text">Opacity of the locker overlay (0.0 to 1.0)</small>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="border_radius">Border Radius</label>
                <input
                  type="text"
                  id="border_radius"
                  className="sign__input"
                  value={contentLockerSettings.border_radius || '12px'}
                  onChange={(e) => handleContentLockerSettingChange('border_radius', e.target.value)}
                  placeholder="12px"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="max_width">Max Width</label>
                <input
                  type="text"
                  id="max_width"
                  className="sign__input"
                  value={contentLockerSettings.max_width || '90%'}
                  onChange={(e) => handleContentLockerSettingChange('max_width', e.target.value)}
                  placeholder="90%"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="max_height">Max Height</label>
                <input
                  type="text"
                  id="max_height"
                  className="sign__input"
                  value={contentLockerSettings.max_height || '90%'}
                  onChange={(e) => handleContentLockerSettingChange('max_height', e.target.value)}
                  placeholder="90%"
                />
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="sign__group">
                <label className="sign__label" htmlFor="padding">Padding</label>
                <input
                  type="text"
                  id="padding"
                  className="sign__input"
                  value={contentLockerSettings.padding || '20px'}
                  onChange={(e) => handleContentLockerSettingChange('padding', e.target.value)}
                  placeholder="20px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="main__title">
              <h2>Settings</h2>
            </div>
            <div className="dashbox">
              <div className="dashbox__content">
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading settings...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Site Settings</h2>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="row">
          <div className="col-12">
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
              {message.text}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="row">
        <div className="col-12">
          <div className="dashbox">
            <div className="dashbox__title">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'site' ? 'active' : ''}`}
                    onClick={() => setActiveTab('site')}
                    type="button"
                    role="tab"
                  >
                    <i className="ti ti-settings"></i>
                    Site Settings
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'contentLocker' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contentLocker')}
                    type="button"
                    role="tab"
                  >
                    <i className="ti ti-lock"></i>
                    Content Locker
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'site' ? 'show active' : ''}`}>
          {renderSiteSettings()}
        </div>
        <div className={`tab-pane fade ${activeTab === 'contentLocker' ? 'show active' : ''}`}>
          {renderContentLockerSettings()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col-12">
          <div className="dashbox">
            <div className="dashbox__content">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetToDefaults}
                  disabled={saving}
                >
                  <i className="ti ti-refresh"></i>
                  Reset to Defaults
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-device-floppy"></i>
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 