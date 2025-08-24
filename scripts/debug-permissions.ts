import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function debugPermissions() {
  console.log('🔍 Debugging GA4 Permissions and Property ID...\n');

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
    console.log('   Type:', credentials.type);

    console.log('\n2. Testing Different Property ID Formats...');
    
    const currentPropertyId = process.env.GA4_PROPERTY_ID;
    const testPropertyIds = [
      `properties/${currentPropertyId}`,
      currentPropertyId,
      `properties/470010`,
      '470010',
      // Try some common property ID formats
      'properties/123456789',
      '123456789',
    ];

    let successFound = false;

    for (const propertyId of testPropertyIds) {
      if (!propertyId) continue;
      
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
        
        // Update the analytics service to use this working property ID
        console.log('\n3. Updating Analytics Service...');
        const cleanPropertyId = propertyId.replace('properties/', '');
        console.log(`   Use this property ID in your .env.local: GA4_PROPERTY_ID=${cleanPropertyId}`);
        
        // Update the .env.local file
        const fs = require('fs');
        const envPath = resolve(process.cwd(), '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace the GA4_PROPERTY_ID line
        envContent = envContent.replace(
          /GA4_PROPERTY_ID=.*/,
          `GA4_PROPERTY_ID=${cleanPropertyId}`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log(`   ✅ Updated .env.local with property ID: ${cleanPropertyId}`);
        break;
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        
        if (error.message.includes('PERMISSION_DENIED')) {
          console.log('   💡 Permission denied - check if property ID is correct');
        } else if (error.message.includes('NOT_FOUND')) {
          console.log('   💡 Property not found - check if property ID is correct');
        } else if (error.message.includes('INVALID_ARGUMENT')) {
          console.log('   💡 Invalid property ID format');
        }
      }
    }

    if (!successFound) {
      console.log('\n❌ No working property ID found');
      console.log('\n🔧 Manual Steps Required:');
      console.log('1. Go to GA4 Admin > Property Settings');
      console.log('2. Copy the numeric Property ID (not the G-XXXXX tracking ID)');
      console.log('3. Update .env.local with: GA4_PROPERTY_ID=YOUR_NUMERIC_ID');
      console.log('4. Make sure the service account has "Viewer" permissions');
      console.log('5. Check if the property has any data (new properties might be empty)');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugPermissions();
