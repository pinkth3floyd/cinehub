'use server';

import { db } from '../index';
import { years } from './schema';
import { eq, desc } from 'drizzle-orm';
import { createYearSchema, updateYearSchema, type CreateYearInput, type UpdateYearInput } from './schema';

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

// Get all years
export async function getYears() {
  try {
    const yearsList = await db.select().from(years).orderBy(desc(years.year));
    
    return { success: true, data: yearsList };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get years' };
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
