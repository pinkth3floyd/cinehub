import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function findPropertyId() {
  console.log('🔍 Finding the Correct GA4 Property ID...\n');

  try {
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.log('❌ No service account key found');
      return;
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const client = new BetaAnalyticsDataClient({
      credentials,
      projectId: credentials.project_id,
    });

    console.log('1. Service Account Details:');
    console.log('   Project ID:', credentials.project_id);
    console.log('   Client Email:', credentials.client_email);

    console.log('\n2. Testing Common Property ID Patterns...');
    
    // Test common property ID patterns based on your project
    const testPropertyIds = [
      // Common patterns for project cinehub-470010
      'properties/470010',
      'properties/4700100',
      'properties/47001000',
      'properties/470010000',
      'properties/4700100000',
      // Try some variations
      'properties/4700101',
      'properties/4700102',
      'properties/4700103',
      // Try some common GA4 property ID ranges
      'properties/123456789',
      'properties/234567890',
      'properties/345678901',
      'properties/456789012',
      'properties/567890123',
    ];

    let successFound = false;

    for (const propertyId of testPropertyIds) {
      console.log(`   Testing: ${propertyId}`);
      
      try {
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

        console.log(`   ✅ SUCCESS! Sessions: ${response.rows?.[0]?.metricValues?.[0]?.value || 0}`);
        console.log(`   🎉 Working Property ID: ${propertyId}`);
        
        successFound = true;
        
        // Update the .env.local file
        const cleanPropertyId = propertyId.replace('properties/', '');
        console.log(`\n3. Updating .env.local...`);
        
        const fs = require('fs');
        const envPath = resolve(process.cwd(), '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        envContent = envContent.replace(
          /GA4_PROPERTY_ID=.*/,
          `GA4_PROPERTY_ID=${cleanPropertyId}`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log(`   ✅ Updated .env.local with property ID: ${cleanPropertyId}`);
        break;
        
      } catch (error) {
        if (error.message.includes('PERMISSION_DENIED')) {
          console.log(`   ❌ Permission denied`);
        } else if (error.message.includes('NOT_FOUND')) {
          console.log(`   ❌ Property not found`);
        } else {
          console.log(`   ❌ ${error.message}`);
        }
      }
    }

    if (!successFound) {
      console.log('\n❌ No working property ID found in common patterns');
      console.log('\n🔧 Manual Steps Required:');
      console.log('1. Go to Google Analytics 4');
      console.log('2. Navigate to Admin (gear icon) > Property Settings');
      console.log('3. Look for "Property ID" - it should be a numeric value');
      console.log('4. Copy that numeric ID (NOT the G-XXXXX tracking ID)');
      console.log('5. Update .env.local with: GA4_PROPERTY_ID=YOUR_NUMERIC_ID');
      console.log('6. Make sure the service account has "Viewer" permissions');
      console.log('\n💡 The Property ID is usually different from the project ID');
      console.log('💡 It might be something like: 123456789, 234567890, etc.');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

findPropertyId();
