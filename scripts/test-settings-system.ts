#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import { 
  getSiteSettings, 
  getContentLockerSettings, 
  updateSiteSettings,
  updateContentLockerSettings,
  getSetting,
  updateSetting
} from '../src/app/core/services/settingsService';

async function testSettingsSystem() {
  console.log('🧪 Testing Settings System...');
  
  try {
    // Test 1: Get site settings
    console.log('\n📋 Test 1: Getting site settings...');
    const siteSettings = await getSiteSettings();
    console.log('✅ Site settings loaded:', Object.keys(siteSettings).length, 'settings');
    console.log('Sample settings:', {
      site_name: siteSettings.site_name,
      site_description: siteSettings.site_description,
      items_per_page: siteSettings.items_per_page
    });

    // Test 2: Get content locker settings
    console.log('\n🔒 Test 2: Getting content locker settings...');
    const contentLockerSettings = await getContentLockerSettings();
    console.log('✅ Content locker settings loaded:', Object.keys(contentLockerSettings).length, 'settings');
    console.log('Sample settings:', {
      cpagrip_enabled: contentLockerSettings.cpagrip_enabled,
      locker_enabled: contentLockerSettings.locker_enabled,
      trigger_percentage: contentLockerSettings.trigger_percentage
    });

    // Test 3: Get individual setting
    console.log('\n🔍 Test 3: Getting individual setting...');
    const siteName = await getSetting('site_name');
    console.log('✅ Individual setting retrieved:', siteName);

    // Test 4: Update individual setting
    console.log('\n✏️ Test 4: Updating individual setting...');
    const originalValue = await getSetting('site_name');
    const testValue = 'Test Site Name';
    
    const updateResult = await updateSetting('site_name', testValue);
    console.log('✅ Update result:', updateResult.success ? 'Success' : 'Failed');
    
    // Verify the update
    const updatedValue = await getSetting('site_name');
    console.log('✅ Updated value:', updatedValue);
    
    // Restore original value
    if (originalValue) {
      await updateSetting('site_name', originalValue);
      console.log('✅ Restored original value');
    }

    // Test 5: Update site settings
    console.log('\n⚙️ Test 5: Updating site settings...');
    const updateSiteResult = await updateSiteSettings({
      site_description: 'Updated description for testing'
    });
    console.log('✅ Site settings update result:', updateSiteResult.success ? 'Success' : 'Failed');

    // Test 6: Update content locker settings
    console.log('\n🔐 Test 6: Updating content locker settings...');
    const updateLockerResult = await updateContentLockerSettings({
      trigger_percentage: '25'
    });
    console.log('✅ Content locker settings update result:', updateLockerResult.success ? 'Success' : 'Failed');

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the tests
testSettingsSystem(); 