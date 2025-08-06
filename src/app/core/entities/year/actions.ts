'use server';

import { db } from '../index';
import { years } from './schema';
import { eq, desc, like, sql } from 'drizzle-orm';
import { createYearSchema, updateYearSchema, yearFilterSchema, type CreateYearInput, type UpdateYearInput, type YearFilterInput } from './schema';

// Create a new year
export async function createYear(data: CreateYearInput) {
  try {
    // Validate input
    const validatedData = createYearSchema.parse(data);
    
    // Create year
    const [year] = await db.insert(years).values(validatedData).returning();
    
    return { success: true, data: year };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create year' };
  }
}

// Get all years with filtering and pagination
export async function getYears(filters: YearFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = yearFilterSchema.parse(filters);
    const { page = 1, limit = 10, search } = validatedFilters;
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = like(years.year, `%${search}%`);
    }
    
    const yearsList = await db.select().from(years)
      .where(whereClause)
      .orderBy(desc(years.year))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(years).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        years: yearsList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get years' };
  }
}

// Get years statistics
export async function getYearStats() {
  try {
    const totalYears = await db.select({ count: sql`count(*)` }).from(years);
    
    return {
      success: true,
      data: {
        total: totalYears[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get year stats' };
  }
}

// Get all years (for dropdowns)
export async function getAllYears() {
  try {
    const allYears = await db.select().from(years).orderBy(desc(years.year));
    
    return { success: true, data: allYears };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get all years' };
  }
}

// Get year by ID
export async function getYearById(id: string) {
  try {
    const [year] = await db.select().from(years).where(eq(years.id, id));
    
    if (!year) {
      return { success: false, error: 'Year not found' };
    }
    
    return { success: true, data: year };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get year' };
  }
}

// Update year
export async function updateYear(id: string, data: UpdateYearInput) {
  try {
    // Validate input
    const validatedData = updateYearSchema.parse(data);
    
    const [year] = await db.update(years)
      .set(validatedData)
      .where(eq(years.id, id))
      .returning();
    
    if (!year) {
      return { success: false, error: 'Year not found' };
    }
    
    return { success: true, data: year };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update year' };
  }
}

// Delete year
export async function deleteYear(id: string) {
  try {
    const [year] = await db.delete(years).where(eq(years.id, id)).returning();
    
    if (!year) {
      return { success: false, error: 'Year not found' };
    }
    
    return { success: true, data: year };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete year' };
  }
}
