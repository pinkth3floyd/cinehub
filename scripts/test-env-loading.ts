import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔍 Testing Environment Variable Loading...\n');

console.log('1. Environment Variables:');
console.log('   GA4_PROPERTY_ID:', process.env.GA4_PROPERTY_ID || '❌ Not set');
console.log('   GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? '✅ Set' : '❌ Not set');

if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  console.log('   Key length:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY.length, 'characters');
  console.log('   Key starts with:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY.substring(0, 50) + '...');
  
  try {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    console.log('   ✅ JSON parsing successful');
    console.log('   Project ID:', parsed.project_id);
    console.log('   Client Email:', parsed.client_email);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('   ❌ JSON parsing failed:', errorMessage);
  }
}

console.log('\n2. Testing Google Analytics Client...');

async function testClient() {
  try {
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      const client = new BetaAnalyticsDataClient({
        credentials,
        projectId: credentials.project_id,
      });
      console.log('   ✅ Client initialized successfully');
      
      // Test a simple API call
      const propertyId = `properties/${process.env.GA4_PROPERTY_ID}`;
      console.log('   Testing property ID:', propertyId);
      
      const [response] = await client.runReport({
        property: propertyId,
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'sessions',
          },
        ],
      });
      
      console.log('   ✅ API call successful!');
      console.log('   Sessions:', response.rows?.[0]?.metricValues?.[0]?.value || 0);
      
    } else {
      console.log('   ❌ No service account key available');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('   ❌ Error:', errorMessage);
    if (errorMessage.includes('PERMISSION_DENIED')) {
      console.log('   💡 Service account needs access to the GA4 property');
    }
  }
}

testClient();
