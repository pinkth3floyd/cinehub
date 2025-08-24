import { getSiteSettings } from '../src/app/core/utils/siteSettings';

async function debugAnalytics() {
  console.log('🔍 Debugging Google Analytics Setup...\n');

  // 1. Check environment variables
  console.log('1. Environment Variables:');
  console.log('   GA4_PROPERTY_ID:', process.env.GA4_PROPERTY_ID ? '✅ Set' : '❌ Not set');
  console.log('   GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? '✅ Set' : '❌ Not set');
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log('   Key length:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY.length, 'characters');
    console.log('   Key starts with:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY.substring(0, 50) + '...');
  }

  // 2. Check database settings
  console.log('\n2. Database Settings:');
  try {
    const settings = await getSiteSettings();
    console.log('   Google Analytics ID:', settings.google_analytics_id || '❌ Not set');
  } catch (error) {
    console.log('   ❌ Error reading settings:', error);
  }

  // 3. Test JSON parsing
  console.log('\n3. JSON Parsing Test:');
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      console.log('   ✅ JSON parsing successful');
      console.log('   Project ID:', parsed.project_id);
      console.log('   Client Email:', parsed.client_email);
      console.log('   Type:', parsed.type);
    } catch (error) {
      console.log('   ❌ JSON parsing failed:', error);
      console.log('   This is likely the cause of the DECODER error');
    }
  }

  // 4. Test Google Analytics client initialization
  console.log('\n4. Google Analytics Client Test:');
  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
    
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      const client = new BetaAnalyticsDataClient({
        credentials,
        projectId: credentials.project_id,
      });
      console.log('   ✅ Client initialized successfully');
    } else {
      console.log('   ❌ No service account key available');
    }
  } catch (error) {
    console.log('   ❌ Client initialization failed:', error);
  }

  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Make sure GOOGLE_SERVICE_ACCOUNT_KEY is a single-line JSON string');
  console.log('2. Ensure the JSON key is properly escaped in .env.local');
  console.log('3. Verify the service account has access to your GA4 property');
  console.log('4. Check that GA4_PROPERTY_ID is the numeric property ID (not G-XXXXX)');
}

debugAnalytics().catch(console.error);
