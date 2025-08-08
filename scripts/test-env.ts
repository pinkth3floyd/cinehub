#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

console.log('Environment variables:');
console.log('TURSO_URL:', process.env.TURSO_URL);
console.log('TURSO_TOKEN:', process.env.TURSO_TOKEN ? 'SET' : 'NOT SET');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PW:', process.env.ADMIN_PW ? 'SET' : 'NOT SET'); 