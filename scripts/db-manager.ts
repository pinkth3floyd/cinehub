#!/usr/bin/env tsx

import { execSync } from 'child_process';

// Lazy imports to avoid database connection issues
let runMigrations: any;
let initializeDatabase: any;
let testConnection: any;



const commands = {
  'generate': () => {
    console.log('🔄 Generating migrations...');
    execSync('npm run db:generate', { stdio: 'inherit' });
  },
  
  'migrate': async () => {
    console.log('🔄 Running migrations...');
    await runMigrations();
  },
  
  'push': () => {
    console.log('🔄 Pushing schema to database...');
    execSync('npm run db:push', { stdio: 'inherit' });
  },
  
  'studio': () => {
    console.log('🔄 Opening Drizzle Studio...');
    execSync('npm run db:studio', { stdio: 'inherit' });
  },
  
  'drop': () => {
    console.log('⚠️ Dropping all tables...');
    const answer = prompt('Are you sure you want to drop all tables? (y/N): ');
    if (answer?.toLowerCase() === 'y') {
      execSync('npm run db:drop', { stdio: 'inherit' });
    } else {
      console.log('Operation cancelled.');
    }
  },
  
  'check': () => {
    console.log('🔄 Checking for schema drift...');
    execSync('npm run db:check', { stdio: 'inherit' });
  },
  
  'init': async () => {
    console.log('🔄 Initializing database with default data...');
    await initializeDatabase();
  },
  
  'test': async () => {
    console.log('🔄 Testing database connection...');
    await testConnection();
  },
  
  'setup': async () => {
    console.log('🚀 Setting up complete database...');
    console.log('1. Generating migrations...');
    execSync('npm run db:generate', { stdio: 'inherit' });
    
    console.log('2. Pushing schema to database...');
    execSync('npm run db:push', { stdio: 'inherit' });
    
    console.log('3. Initializing with default data...');
    await initializeDatabase();
    
    console.log('✅ Database setup completed!');
  },
  
  'reset': async () => {
    console.log('⚠️ Resetting database...');
    const answer = prompt('Are you sure you want to reset the database? This will drop all tables and recreate them. (y/N): ');
    if (answer?.toLowerCase() === 'y') {
      console.log('1. Dropping all tables...');
      execSync('npm run db:drop', { stdio: 'inherit' });
      
      console.log('2. Setting up fresh database...');
      await commands.setup();
      
      console.log('✅ Database reset completed!');
    } else {
      console.log('Operation cancelled.');
    }
  },
  
  'help': () => {
    console.log(`
📚 Database Management Commands

Available commands:
  generate    Generate migration files from schema changes
  migrate     Apply migrations to the database
  push        Push schema changes directly to database (dev only)
  studio      Open Drizzle Studio to view/edit data
  drop        Drop all tables (⚠️ DESTRUCTIVE)
  check       Check for schema drift
  init        Initialize database with default data
  test        Test database connection
  setup       Complete setup: generate + push + initialize
  reset       Reset database: drop + setup
  help        Show this help message

Usage:
  tsx scripts/db-manager.ts <command>

Examples:
  tsx scripts/db-manager.ts setup
  tsx scripts/db-manager.ts test
  tsx scripts/db-manager.ts studio
    `);
  }
};

async function main() {
  const command = process.argv[2];
  
  if (!command || !commands[command as keyof typeof commands]) {
    console.log('❌ Invalid command. Use "help" to see available commands.');
    process.exit(1);
  }
  
  try {
    await commands[command as keyof typeof commands]();
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  }
}

main(); 