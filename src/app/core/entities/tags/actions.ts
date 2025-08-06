'use server';

import { db } from '../index';
import { tags } from './schema';
import { eq, desc, like, sql } from 'drizzle-orm';
import { createTagSchema, updateTagSchema, tagFilterSchema, type CreateTagInput, type UpdateTagInput, type TagFilterInput } from './schema';

// Create a new tag
export async function createTag(data: CreateTagInput) {
  try {
    // Validate input
    const validatedData = createTagSchema.parse(data);
    
    // Create tag
    const [tag] = await db.insert(tags).values({
      ...validatedData,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create tag' };
  }
}

// Get all tags with filtering and pagination
export async function getTags(filters: TagFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = tagFilterSchema.parse(filters);
    const { page = 1, limit = 10, search } = validatedFilters;
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = like(tags.name, `%${search}%`);
    }
    
    const tagsList = await db.select().from(tags)
      .where(whereClause)
      .orderBy(desc(tags.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(tags).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        tags: tagsList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get tags' };
  }
}

// Get tags statistics
export async function getTagStats() {
  try {
    const totalTags = await db.select({ count: sql`count(*)` }).from(tags);
    
    return {
      success: true,
      data: {
        total: totalTags[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get tag stats' };
  }
}

// Get tag by ID
export async function getTagById(id: string) {
  try {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    
    if (!tag) {
      return { success: false, error: 'Tag not found' };
    }
    
    return { success: true, data: tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get tag' };
  }
}

// Get tag by slug
export async function getTagBySlug(slug: string) {
  try {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    
    if (!tag) {
      return { success: false, error: 'Tag not found' };
    }
    
    return { success: true, data: tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get tag' };
  }
}

// Update tag
export async function updateTag(id: string, data: UpdateTagInput) {
  try {
    // Validate input
    const validatedData = updateTagSchema.parse(data);
    
    const [tag] = await db.update(tags)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();
    
    if (!tag) {
      return { success: false, error: 'Tag not found' };
    }
    
    return { success: true, data: tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update tag' };
  }
}

// Delete tag
export async function deleteTag(id: string) {
  try {
    const [tag] = await db.delete(tags).where(eq(tags.id, id)).returning();
    
    if (!tag) {
      return { success: false, error: 'Tag not found' };
    }
    
    return { success: true, data: tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete tag' };
  }
}

// Get all tags (for dropdowns)
export async function getAllTags() {
  try {
    const allTags = await db.select().from(tags).orderBy(tags.name);
    
    return { success: true, data: allTags };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get all tags' };
  }
}
