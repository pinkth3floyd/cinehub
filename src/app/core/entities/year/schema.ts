import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Years table schema
export const years = sqliteTable('years', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  year: integer('year').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createYearSchema = z.object({
  year: z.number().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 10, 'Year cannot be more than 10 years in the future'),
});

export const updateYearSchema = z.object({
  year: z.number().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 10, 'Year cannot be more than 10 years in the future'),
});

// TypeScript types
export type Year = typeof years.$inferSelect;
export type NewYear = typeof years.$inferInsert;
export type CreateYearInput = z.infer<typeof createYearSchema>;
export type UpdateYearInput = z.infer<typeof updateYearSchema>;
