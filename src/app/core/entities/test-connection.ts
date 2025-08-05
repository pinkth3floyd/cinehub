import { db } from './index';
import { users } from './user/schema';

export async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Simple query to test connection
    const result = await db.select().from(users).limit(1);
    
    console.log('✅ Database connection successful!');
    console.log(`Database has ${result.length} users`);
    
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((result) => {
      if (result.success) {
        console.log('Connection test completed successfully');
        process.exit(0);
      } else {
        console.error('Connection test failed:', result.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Connection test failed:', error);
      process.exit(1);
    });
} 