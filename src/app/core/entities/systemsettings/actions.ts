'use server';

import { db } from '../index';
import { systemSettings } from './schema';
import { eq, desc, like, or, sql } from 'drizzle-orm';
import { createSystemSettingSchema, updateSystemSettingSchema, systemSettingFilterSchema, type CreateSystemSettingInput, type UpdateSystemSettingInput, type SystemSettingFilterInput } from './schema';

// Create a new system setting
export async function createSystemSetting(data: CreateSystemSettingInput) {
  try {
    // Validate input
    const validatedData = createSystemSettingSchema.parse(data);
    
    // Create system setting
    const [setting] = await db.insert(systemSettings).values({
      ...validatedData,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create system setting' };
  }
}

// Get all system settings with filtering and pagination
export async function getSystemSettings(filters: SystemSettingFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = systemSettingFilterSchema.parse(filters);
    const { page = 1, limit = 10, search } = validatedFilters;
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(systemSettings.key, `%${search}%`),
        like(systemSettings.value, `%${search}%`),
        like(systemSettings.description, `%${search}%`)
      );
    }
    
    const settingsList = await db.select().from(systemSettings)
      .where(whereClause)
      .orderBy(desc(systemSettings.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(systemSettings).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        settings: settingsList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get system settings' };
  }
}

// Get system setting by ID
export async function getSystemSettingById(id: string) {
  try {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.id, id));
    
    if (!setting) {
      return { success: false, error: 'System setting not found' };
    }
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get system setting' };
  }
}

// Get system setting by key
export async function getSystemSettingByKey(key: string) {
  try {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    
    if (!setting) {
      return { success: false, error: 'System setting not found' };
    }
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get system setting' };
  }
}

// Update system setting
export async function updateSystemSetting(id: string, data: UpdateSystemSettingInput) {
  try {
    // Validate input
    const validatedData = updateSystemSettingSchema.parse(data);
    
    const [setting] = await db.update(systemSettings)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(systemSettings.id, id))
      .returning();
    
    if (!setting) {
      return { success: false, error: 'System setting not found' };
    }
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update system setting' };
  }
}

// Update system setting by key
export async function updateSystemSettingByKey(key: string, data: UpdateSystemSettingInput) {
  try {
    // Validate input
    const validatedData = updateSystemSettingSchema.parse(data);
    
    const [setting] = await db.update(systemSettings)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(systemSettings.key, key))
      .returning();
    
    if (!setting) {
      return { success: false, error: 'System setting not found' };
    }
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update system setting' };
  }
}

// Delete system setting
export async function deleteSystemSetting(id: string) {
  try {
    const [setting] = await db.delete(systemSettings).where(eq(systemSettings.id, id)).returning();
    
    if (!setting) {
      return { success: false, error: 'System setting not found' };
    }
    
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete system setting' };
  }
}

// Get all system settings as key-value pairs
export async function getAllSystemSettingsAsMap() {
  try {
    const settings = await db.select().from(systemSettings);
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    return { success: true, data: settingsMap };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get system settings map' };
  }
}

// Initialize default system settings
export async function initializeDefaultSettings() {
  try {
    const defaultSettings = [
      { key: 'site_name', value: 'CineHub', description: 'Website name' },
      { key: 'site_description', value: 'Online Movies, TV Shows & Cinema', description: 'Website description' },
      { key: 'admin_email', value: 'admin@cinehub.com', description: 'Admin email address' },
      { key: 'items_per_page', value: '12', description: 'Number of items per page' },
      { key: 'featured_items_count', value: '6', description: 'Number of featured items to display' },
    ];
    
    const results = [];
    for (const setting of defaultSettings) {
      const existingSetting = await getSystemSettingByKey(setting.key);
      if (!existingSetting.success) {
        const result = await createSystemSetting(setting);
        results.push(result);
      }
    }
    
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to initialize default settings' };
  }
}
