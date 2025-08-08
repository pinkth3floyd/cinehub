import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

// Import all schemas
import { users } from "./user/schema";
import { movies, movieServers, movieLinks } from "./movies/schema";
import { movieGenres, movieTags } from "./movies/relationships";
import { reviews } from "./reviews/schema";
import { genres } from "./genre/schema";
import { types } from "./type/schema";
import { years } from "./year/schema";
import { tags } from "./tags/schema";
import { systemSettings } from "./systemsettings/schema";

// Validate environment variables
const tursoUrl = process.env.TURSO_URL;
const tursoToken = process.env.TURSO_TOKEN;

if (!tursoUrl) {
  throw new Error('TURSO_URL environment variable is required');
}

if (!tursoToken) {
  throw new Error('TURSO_TOKEN environment variable is required');
}

// Create database connection for server-side use
const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

export const db = drizzle(client, {
  schema: {
    users,
    movies,
    movieServers,
    movieLinks,
    movieGenres,
    movieTags,
    reviews,
    genres,
    types,
    years,
    tags,
    systemSettings,
  },
});

// Export all schemas for use in other parts of the application
export * from "./user/schema";
export * from "./movies/schema";
export * from "./movies/relationships";
export * from "./reviews/schema";
export * from "./genre/schema";
export * from "./type/schema";
export * from "./year/schema";
export * from "./tags/schema";
export * from "./systemsettings/schema";

// Export all actions
export * from "./user/actions";
export * from "./movies/actions";
export * from "./reviews/actions";
export * from "./genre/actions";
export * from "./type/actions";
export * from "./year/actions";
export * from "./tags/actions";
export * from "./systemsettings/actions";
