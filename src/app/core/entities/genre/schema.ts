import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Genres table schema
export const genres = sqliteTable('genres', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createGenreSchema = z.object({
  name: z.string().min(2, 'Genre name must be at least 2 characters').max(50, 'Genre name must be less than 50 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateGenreSchema = z.object({
  name: z.string().min(2, 'Genre name must be at least 2 characters').max(50, 'Genre name must be less than 50 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const genreFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// TypeScript types
export type Genre = typeof genres.$inferSelect;
export type NewGenre = typeof genres.$inferInsert;
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreFilterInput = z.infer<typeof genreFilterSchema>;
