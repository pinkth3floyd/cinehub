import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Types table schema
export const types = sqliteTable('types', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createTypeSchema = z.object({
  name: z.string().min(2, 'Type name must be at least 2 characters').max(50, 'Type name must be less than 50 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters'),
});

export const updateTypeSchema = z.object({
  name: z.string().min(2, 'Type name must be at least 2 characters').max(50, 'Type name must be less than 50 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50, 'Slug must be less than 50 characters').optional(),
});

// TypeScript types
export type Type = typeof types.$inferSelect;
export type NewType = typeof types.$inferInsert;
export type CreateTypeInput = z.infer<typeof createTypeSchema>;
export type UpdateTypeInput = z.infer<typeof updateTypeSchema>;
