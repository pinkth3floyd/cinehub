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
  releaseDate: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === 'string' && val !== '') {
      return new Date(val);
    }
    return undefined;
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  typeId: z.string().min(1, 'Type is required'),
  yearId: z.string().optional(),
  genreId: z.string().optional(),
  server: z.string().optional(),
  link: z.string().url('Invalid link URL').optional(),
  tagIds: z.array(z.string()).optional(),
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
  releaseDate: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === 'string' && val !== '') {
      return new Date(val);
    }
    return undefined;
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  typeId: z.string().min(1, 'Type is required').optional(),
  yearId: z.string().optional(),
  genreId: z.string().optional(),
  server: z.string().optional(),
  link: z.string().url('Invalid link URL').optional(),
  tagIds: z.array(z.string()).optional(),
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
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type MovieFilterInput = z.infer<typeof movieFilterSchema>;
