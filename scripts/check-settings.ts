#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import { getAllSystemSettingsAsMap } from '../src/app/core/entities/systemsettings/actions';

async function checkSettings() {
  console.log('🔍 Checking current settings in database...');
  
  try {
    const result = await getAllSystemSettingsAsMap();
    
    if (result.success && result.data) {
      console.log('✅ Found settings in database:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log('ℹ️ No settings found in database');
    }
  } catch (error) {
    console.error('❌ Error checking settings:', error);
  }
}

// Run the check
checkSettings(); 