import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Movie-Genre relationship table
export const movieGenres = sqliteTable('movie_genres', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  movieId: text('movie_id').notNull(),
  genreId: text('genre_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Movie-Tag relationship table
export const movieTags = sqliteTable('movie_tags', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  movieId: text('movie_id').notNull(),
  tagId: text('tag_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createMovieGenreSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required'),
  genreId: z.string().min(1, 'Genre ID is required'),
});

export const createMovieTagSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required'),
  tagId: z.string().min(1, 'Tag ID is required'),
});

// TypeScript types
export type MovieGenre = typeof movieGenres.$inferSelect;
export type NewMovieGenre = typeof movieGenres.$inferInsert;
export type CreateMovieGenreInput = z.infer<typeof createMovieGenreSchema>;

export type MovieTag = typeof movieTags.$inferSelect;
export type NewMovieTag = typeof movieTags.$inferInsert;
export type CreateMovieTagInput = z.infer<typeof createMovieTagSchema>; 