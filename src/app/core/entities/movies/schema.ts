import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Movies table schema
export const movies = sqliteTable('movies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content'),
  poster: text('poster'),
  banner: text('banner'),
  trailer: text('trailer'),
  duration: integer('duration'), // in minutes
  rating: real('rating').default(0),
  releaseDate: integer('release_date', { mode: 'timestamp' }),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  typeId: text('type_id').notNull(),
  yearId: text('year_id'),
  genreId: text('genre_id'),
  server: text('server'),
  link: text('link'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Movie servers table schema
export const movieServers = sqliteTable('movie_servers', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  movieId: text('movie_id').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  quality: text('quality'),
  language: text('language'),
  videoType: text('video_type', { enum: ['mp4', 'iframe', 'youtube'] }).notNull().default('mp4'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Movie links table schema
export const movieLinks = sqliteTable('movie_links', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  movieId: text('movie_id').notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: text('type'), // download, stream, trailer, etc.
  quality: text('quality'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters'),
  description: z.string().optional(),
  content: z.string().optional(),
  poster: z.string().url('Invalid poster URL').optional(),
  banner: z.string().url('Invalid banner URL').optional(),
  trailer: z.string().url('Invalid trailer URL').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  rating: z.number().min(0).max(10).default(0),
  releaseDate: z.union([z.date(), z.string(), z.null()]).transform((val) => {
    if (val === null || val === '') {
      return undefined;
    }
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  typeId: z.string().min(1, 'Type is required'),
  yearId: z.string().optional(),
  genreId: z.string().optional(),
  server: z.string().optional().nullable(),
  link: z.string().url('Invalid link URL').optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  servers: z.array(z.object({
    name: z.string().min(1, 'Server name is required'),
    url: z.string().url('Invalid server URL'),
    quality: z.string().optional(),
    language: z.string().optional(),
    videoType: z.enum(['mp4', 'iframe', 'youtube']).default('mp4'),
  })).optional(),
  links: z.array(z.object({
    title: z.string().min(1, 'Link title is required'),
    url: z.string().url('Invalid link URL'),
    type: z.string().optional(),
    quality: z.string().optional(),
  })).optional(),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters').optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  poster: z.string().url('Invalid poster URL').optional(),
  banner: z.string().url('Invalid banner URL').optional(),
  trailer: z.string().url('Invalid trailer URL').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  rating: z.number().min(0).max(10).optional(),
  releaseDate: z.union([z.date(), z.string(), z.null()]).transform((val) => {
    if (val === null || val === '') {
      return undefined;
    }
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  typeId: z.string().min(1, 'Type is required').optional(),
  yearId: z.string().optional(),
  genreId: z.string().optional(),
  server: z.string().optional().nullable(),
  link: z.string().url('Invalid link URL').optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  servers: z.array(z.object({
    name: z.string().min(1, 'Server name is required'),
    url: z.string().url('Invalid server URL'),
    quality: z.string().optional(),
    language: z.string().optional(),
    videoType: z.enum(['mp4', 'iframe', 'youtube']).default('mp4'),
  })).optional(),
  links: z.array(z.object({
    title: z.string().min(1, 'Link title is required'),
    url: z.string().url('Invalid link URL'),
    type: z.string().optional(),
    quality: z.string().optional(),
  })).optional(),
});

export const movieFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  typeId: z.string().optional(),
  yearId: z.string().optional(),
  genreId: z.string().optional(),
  featured: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// TypeScript types
export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
export type MovieServer = typeof movieServers.$inferSelect;
export type NewMovieServer = typeof movieServers.$inferInsert;
export type MovieLink = typeof movieLinks.$inferSelect;
export type NewMovieLink = typeof movieLinks.$inferInsert;
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type MovieFilterInput = z.infer<typeof movieFilterSchema>;
