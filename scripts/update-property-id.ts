import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

function updatePropertyId() {
  console.log('🔧 Property ID Update Tool\n');
  
  const currentPropertyId = process.env.GA4_PROPERTY_ID;
  console.log('Current Property ID:', currentPropertyId || 'Not set');
  
  // Get the new property ID from command line arguments
  const newPropertyId = process.argv[2];
  
  if (!newPropertyId) {
    console.log('\n❌ No property ID provided');
    console.log('\nUsage: npx tsx scripts/update-property-id.ts YOUR_PROPERTY_ID');
    console.log('\nExample: npx tsx scripts/update-property-id.ts 123456789');
    console.log('\nTo find your Property ID:');
    console.log('1. Go to Google Analytics 4');
    console.log('2. Admin (gear icon) > Property Settings');
    console.log('3. Copy the numeric "Property ID" (not the G-XXXXX tracking ID)');
    return;
  }
  
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    let envContent = readFileSync(envPath, 'utf8');
    
    // Replace the GA4_PROPERTY_ID line
    if (envContent.includes('GA4_PROPERTY_ID=')) {
      envContent = envContent.replace(
        /GA4_PROPERTY_ID=.*/,
        `GA4_PROPERTY_ID=${newPropertyId}`
      );
    } else {
      envContent += `\nGA4_PROPERTY_ID=${newPropertyId}`;
    }
    
    writeFileSync(envPath, envContent);
    console.log(`✅ Updated .env.local with Property ID: ${newPropertyId}`);
    console.log('\nNext steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Test the analytics: npx tsx scripts/test-env-loading.ts');
    console.log('3. Check the admin dashboard at /admin');
    
  } catch (error) {
    console.log('❌ Error updating .env.local:', error.message);
  }
}

updatePropertyId();
