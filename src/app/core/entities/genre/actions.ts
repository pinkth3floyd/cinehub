'use server';

import { db } from '../index';
import { genres } from './schema';
import { eq, desc, like, or, sql } from 'drizzle-orm';
import { createGenreSchema, updateGenreSchema, genreFilterSchema, type CreateGenreInput, type UpdateGenreInput, type GenreFilterInput } from './schema';

// Create a new genre
export async function createGenre(data: CreateGenreInput) {
  try {
    // Validate input
    const validatedData = createGenreSchema.parse(data);
    
    // Create genre
    const [genre] = await db.insert(genres).values({
      ...validatedData,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: genre };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create genre' };
  }
}

// Get all genres with filtering and pagination
export async function getGenres(filters: GenreFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = genreFilterSchema.parse(filters);
    const { page = 1, limit = 10, search } = validatedFilters;
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(genres.name, `%${search}%`),
        like(genres.description, `%${search}%`)
      );
    }
    
    const genresList = await db.select().from(genres)
      .where(whereClause)
      .orderBy(desc(genres.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(genres).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        genres: genresList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get genres' };
  }
}

// Get genres statistics
export async function getGenreStats() {
  try {
    const totalGenres = await db.select({ count: sql`count(*)` }).from(genres);
    
    return {
      success: true,
      data: {
        total: totalGenres[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get genre stats' };
  }
}

// Get genre by ID
export async function getGenreById(id: string) {
  try {
    const [genre] = await db.select().from(genres).where(eq(genres.id, id));
    
    if (!genre) {
      return { success: false, error: 'Genre not found' };
    }
    
    return { success: true, data: genre };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get genre' };
  }
}

// Get genre by slug
export async function getGenreBySlug(slug: string) {
  try {
    const [genre] = await db.select().from(genres).where(eq(genres.slug, slug));
    
    if (!genre) {
      return { success: false, error: 'Genre not found' };
    }
    
    return { success: true, data: genre };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get genre' };
  }
}

// Update genre
export async function updateGenre(id: string, data: UpdateGenreInput) {
  try {
    // Validate input
    const validatedData = updateGenreSchema.parse(data);
    
    const [genre] = await db.update(genres)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(genres.id, id))
      .returning();
    
    if (!genre) {
      return { success: false, error: 'Genre not found' };
    }
    
    return { success: true, data: genre };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update genre' };
  }
}

// Delete genre
export async function deleteGenre(id: string) {
  try {
    const [genre] = await db.delete(genres).where(eq(genres.id, id)).returning();
    
    if (!genre) {
      return { success: false, error: 'Genre not found' };
    }
    
    return { success: true, data: genre };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete genre' };
  }
}

// Get all genres (for dropdowns)
export async function getAllGenres() {
  try {
    const allGenres = await db.select().from(genres).orderBy(genres.name);
    
    return { success: true, data: allGenres };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get all genres' };
  }
}
