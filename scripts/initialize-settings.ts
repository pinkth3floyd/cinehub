#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import { 
  getSiteSettings, 
  getContentLockerSettings, 
  initializeDefaultSettings 
} from '../src/app/core/services/settingsService';

async function initializeSettings() {
  console.log('🚀 Initializing default settings...');
  
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    const testResult = await getSiteSettings();
    console.log('✅ Database connection successful');
    
    const result = await initializeDefaultSettings();
    
    if (result.success) {
      console.log('✅ Settings initialized successfully!');
      
      // Load and display current settings
      const [siteSettings, contentLockerSettings] = await Promise.all([
        getSiteSettings(),
        getContentLockerSettings()
      ]);
      
      console.log('\n📋 Current Site Settings:');
      console.log(JSON.stringify(siteSettings, null, 2));
      
      console.log('\n🔒 Current Content Locker Settings:');
      console.log(JSON.stringify(contentLockerSettings, null, 2));
      
    } else {
      console.error('❌ Failed to initialize settings:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the initialization
initializeSettings(); 