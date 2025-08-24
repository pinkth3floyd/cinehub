import { getAnalyticsData, getRealTimeAnalyticsData } from '../src/app/core/services/analyticsService';

async function testAnalyticsAPI() {
  console.log('🧪 Testing Google Analytics API Calls...\n');

  try {
    console.log('1. Testing getAnalyticsData (last 30 days)...');
    const analyticsData = await getAnalyticsData(30);
    console.log('   ✅ Success!');
    console.log('   Total Sessions:', analyticsData.totalSessions);
    console.log('   Total Users:', analyticsData.totalUsers);
    console.log('   Countries:', analyticsData.countries.length);
    
    if (analyticsData.countries.length > 0) {
      console.log('   Top Country:', analyticsData.countries[0].country, '(', analyticsData.countries[0].sessions, 'sessions)');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('   ❌ Failed:', error);
    console.log('   Error details:', errorMessage);
  }

  console.log('\n2. Testing getRealTimeAnalyticsData...');
  try {
    const realTimeData = await getRealTimeAnalyticsData();
    console.log('   ✅ Success!');
    console.log('   Active Users:', realTimeData.activeUsers);
    console.log('   Current Page Views:', realTimeData.currentPageViews);
    console.log('   Top Pages:', realTimeData.topPages.length);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('   ❌ Failed:', error);
    console.log('   Error details:', errorMessage);
  }

  console.log('\n🔧 If both tests failed with DECODER errors:');
  console.log('1. The service account might not have access to the GA4 property');
  console.log('2. The GA4_PROPERTY_ID might be incorrect');
  console.log('3. The property might not have any data yet');
  console.log('4. The service account key might be corrupted');
}

testAnalyticsAPI().catch(console.error);
