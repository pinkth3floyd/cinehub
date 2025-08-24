import { BetaAnalyticsDataClient } from '@google-analytics/data';

async function checkGA4Property() {
  console.log('🔍 Checking GA4 Property Configuration...\n');

  // 1. Check environment variables
  console.log('1. Environment Variables:');
  console.log('   GA4_PROPERTY_ID:', process.env.GA4_PROPERTY_ID || '❌ Not set');
  console.log('   GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? '✅ Set' : '❌ Not set');

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log('\n❌ No service account key found. Please set GOOGLE_SERVICE_ACCOUNT_KEY in .env.local');
    return;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    console.log('   Project ID:', credentials.project_id);
    console.log('   Client Email:', credentials.client_email);

    // 2. Test different property ID formats
    const testPropertyIds = [
      process.env.GA4_PROPERTY_ID,
      '123456789', // Default fallback
      'properties/123456789',
      'properties/' + (process.env.GA4_PROPERTY_ID || '123456789')
    ];

    console.log('\n2. Testing Property ID Formats:');
    
    for (const propertyId of testPropertyIds) {
      if (!propertyId) continue;
      
      console.log(`   Testing: ${propertyId}`);
      
      try {
        const client = new BetaAnalyticsDataClient({
          credentials,
          projectId: credentials.project_id,
        });

        // Try to list properties first
        const [properties] = await client.listProperties();
        console.log(`   ✅ Successfully connected! Found ${properties.length} properties`);
        
        if (properties.length > 0) {
          console.log('   Available properties:');
          properties.forEach((prop, index) => {
            console.log(`     ${index + 1}. ${prop.displayName} (${prop.name})`);
          });
        }

        // Try to get a simple metric
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

        console.log(`   ✅ API call successful! Sessions: ${response.rows?.[0]?.metricValues?.[0]?.value || 0}`);
        console.log(`   🎉 Working Property ID: ${propertyId}`);
        break;
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        if (error.message.includes('PERMISSION_DENIED')) {
          console.log('   💡 This suggests the service account needs access to this property');
        }
      }
    }

  } catch (error) {
    console.log('❌ Error parsing service account key:', error.message);
  }

  console.log('\n🔧 Next Steps:');
  console.log('1. Go to GA4 Admin > Property Settings > Property ID');
  console.log('2. Copy the numeric Property ID (not the G-XXXXX tracking ID)');
  console.log('3. Update GA4_PROPERTY_ID in .env.local');
  console.log('4. Go to GA4 Admin > Property Access Management');
  console.log('5. Add your service account email with "Viewer" permissions');
}

checkGA4Property().catch(console.error);
