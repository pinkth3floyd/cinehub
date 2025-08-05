import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Tags table schema
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createTagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters').max(50, 'Tag name must be less than 50 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters'),
});

export const updateTagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters').max(50, 'Tag name must be less than 50 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters').optional(),
});

export const tagFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// TypeScript types
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagFilterInput = z.infer<typeof tagFilterSchema>;
