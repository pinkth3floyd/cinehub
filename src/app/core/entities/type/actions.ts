'use server';

import { db } from '../index';
import { types } from './schema';
import { eq } from 'drizzle-orm';
import { createTypeSchema, updateTypeSchema, type CreateTypeInput, type UpdateTypeInput } from './schema';

// Create a new type
export async function createType(data: CreateTypeInput) {
  try {
    // Validate input
    const validatedData = createTypeSchema.parse(data);
    
    // Create type
    const [type] = await db.insert(types).values({
      ...validatedData,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: type };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create type' };
  }
}

// Get all types
export async function getTypes() {
  try {
    const typesList = await db.select().from(types).orderBy(types.name);
    
    return { success: true, data: typesList };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get types' };
  }
}

// Get type by ID
export async function getTypeById(id: string) {
  try {
    const [type] = await db.select().from(types).where(eq(types.id, id));
    
    if (!type) {
      return { success: false, error: 'Type not found' };
    }
    
    return { success: true, data: type };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get type' };
  }
}

// Update type
export async function updateType(id: string, data: UpdateTypeInput) {
  try {
    // Validate input
    const validatedData = updateTypeSchema.parse(data);
    
    const [type] = await db.update(types)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(types.id, id))
      .returning();
    
    if (!type) {
      return { success: false, error: 'Type not found' };
    }
    
    return { success: true, data: type };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update type' };
  }
}

// Delete type
export async function deleteType(id: string) {
  try {
    const [type] = await db.delete(types).where(eq(types.id, id)).returning();
    
    if (!type) {
      return { success: false, error: 'Type not found' };
    }
    
    return { success: true, data: type };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete type' };
  }
}
