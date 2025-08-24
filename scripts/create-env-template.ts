import { writeFileSync } from 'fs';
import { join } from 'path';

const envTemplateContent = `# Google Analytics Configuration
# Replace these values with your actual Google Analytics credentials

# Your GA4 Property ID (numeric value from GA4 Admin > Property Settings)
GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE

# Your Google Service Account Key (JSON content as a single line)
# Get this from Google Cloud Console > IAM & Admin > Service Accounts
GOOGLE_SERVICE_ACCOUNT_KEY=YOUR_SERVICE_ACCOUNT_JSON_HERE
`;

try {
  const envLocalPath = join(process.cwd(), '.env.local');
  writeFileSync(envLocalPath, envTemplateContent);
  console.log('✅ Created .env.local template file');
  console.log('📁 File location:', envLocalPath);
  console.log('\n🔧 Next steps:');
  console.log('1. Edit .env.local and replace the placeholder values:');
  console.log('   - Replace YOUR_PROPERTY_ID_HERE with your GA4 Property ID');
  console.log('   - Replace YOUR_SERVICE_ACCOUNT_JSON_HERE with your service account JSON key');
  console.log('2. Restart your development server (npm run dev)');
  console.log('3. Test the analytics: npx tsx scripts/test-env-loading.ts');
  console.log('4. Check the admin dashboard at /admin');
  console.log('\n💡 The service account JSON should be on a single line with escaped newlines');
} catch (error) {
  console.error('❌ Error creating .env.local template:', error);
}
