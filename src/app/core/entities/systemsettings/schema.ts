import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// System Settings table schema
export const systemSettings = sqliteTable('system_settings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Zod schemas for validation
export const createSystemSettingSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100, 'Key must be less than 100 characters'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateSystemSettingSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const systemSettingFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// TypeScript types
export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
export type CreateSystemSettingInput = z.infer<typeof createSystemSettingSchema>;
export type UpdateSystemSettingInput = z.infer<typeof updateSystemSettingSchema>;
export type SystemSettingFilterInput = z.infer<typeof systemSettingFilterSchema>;
