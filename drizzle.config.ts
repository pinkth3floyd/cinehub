import dotenv from "dotenv";
import { Config } from 'drizzle-kit';
dotenv.config();
export default ({
  schema: "./src/app/core/entities/index.ts",   // path to your schema files
  out: "./src/app/core/entities/migrations",              // path to your migration files 
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_URL, 
    authToken: process.env.TURSO_TOKEN,
    maxConnections: 20000,
    connectionTimeout: 30000,
  }
});