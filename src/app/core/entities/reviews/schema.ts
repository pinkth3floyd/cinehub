import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Reviews table schema
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  content: text('content').notNull(),
  rating: real('rating').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  movieId: text('movie_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createReviewSchema = z.object({
  content: z.string().min(10, 'Review content must be at least 10 characters').max(1000, 'Review content must be less than 1000 characters'),
  rating: z.number().min(1, 'Rating must be at least 1').max(10, 'Rating must be at most 10'),
  movieId: z.string().min(1, 'Movie ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateReviewSchema = z.object({
  content: z.string().min(10, 'Review content must be at least 10 characters').max(1000, 'Review content must be less than 1000 characters').optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(10, 'Rating must be at most 10').optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const reviewFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  movieId: z.string().optional(),
  userId: z.string().optional(),
  rating: z.number().min(1).max(10).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// TypeScript types
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewFilterInput = z.infer<typeof reviewFilterSchema>;
