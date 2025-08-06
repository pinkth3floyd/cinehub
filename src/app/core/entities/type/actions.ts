'use server';

import { db } from '../index';
import { types } from './schema';
import { eq, desc, like, sql } from 'drizzle-orm';
import { createTypeSchema, updateTypeSchema, typeFilterSchema, type CreateTypeInput, type UpdateTypeInput, type TypeFilterInput } from './schema';

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

// Get all types with filtering and pagination
export async function getTypes(filters: TypeFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = typeFilterSchema.parse(filters);
    const { page = 1, limit = 10, search } = validatedFilters;
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = like(types.name, `%${search}%`);
    }
    
    const typesList = await db.select().from(types)
      .where(whereClause)
      .orderBy(desc(types.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(types).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        types: typesList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get types' };
  }
}

// Get all types (for dropdowns)
export async function getAllTypes() {
  try {
    const allTypes = await db.select().from(types).orderBy(types.name);
    
    return { success: true, data: allTypes };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get all types' };
  }
}

// Get types statistics
export async function getTypeStats() {
  try {
    const totalTypes = await db.select({ count: sql`count(*)` }).from(types);
    
    return {
      success: true,
      data: {
        total: totalTypes[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get type stats' };
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
