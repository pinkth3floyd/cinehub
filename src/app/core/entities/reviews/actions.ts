'use server';

import { db } from '../index';
import { reviews } from './schema';
import { eq, desc, and, like, sql } from 'drizzle-orm';
import { createReviewSchema, updateReviewSchema, reviewFilterSchema, type CreateReviewInput, type UpdateReviewInput, type ReviewFilterInput } from './schema';

// Create a new review
export async function createReview(data: CreateReviewInput) {
  try {
    // Validate input
    const validatedData = createReviewSchema.parse(data);
    
    // Create review
    const [review] = await db.insert(reviews).values({
      ...validatedData,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create review' };
  }
}

// Get all reviews with filtering and pagination
export async function getReviews(filters: ReviewFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = reviewFilterSchema.parse(filters);
    const { page = 1, limit = 10, search, status, movieId, userId, rating } = validatedFilters;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const conditions = [];
    
    if (search) {
      conditions.push(like(reviews.content, `%${search}%`));
    }
    
    if (status) {
      conditions.push(eq(reviews.status, status));
    }
    
    if (movieId) {
      conditions.push(eq(reviews.movieId, movieId));
    }
    
    if (userId) {
      conditions.push(eq(reviews.userId, userId));
    }
    
    if (rating) {
      conditions.push(eq(reviews.rating, rating));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const reviewsList = await db.select().from(reviews)
      .where(whereClause)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(reviews).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        reviews: reviewsList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get reviews' };
  }
}

// Get review by ID
export async function getReviewById(id: string) {
  try {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get review' };
  }
}

// Get reviews by movie ID
export async function getReviewsByMovieId(movieId: string, limit: number = 10) {
  try {
    const movieReviews = await db.select()
      .from(reviews)
      .where(and(eq(reviews.movieId, movieId), eq(reviews.status, 'approved')))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    
    return { success: true, data: movieReviews };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie reviews' };
  }
}

// Get reviews by user ID
export async function getReviewsByUserId(userId: string, limit: number = 10) {
  try {
    const userReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    
    return { success: true, data: userReviews };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get user reviews' };
  }
}

// Update review
export async function updateReview(id: string, data: UpdateReviewInput) {
  try {
    // Validate input
    const validatedData = updateReviewSchema.parse(data);
    
    const [review] = await db.update(reviews)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update review' };
  }
}

// Delete review
export async function deleteReview(id: string) {
  try {
    const [review] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete review' };
  }
}

// Approve review
export async function approveReview(id: string) {
  try {
    const [review] = await db.update(reviews)
      .set({ status: 'approved', updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to approve review' };
  }
}

// Reject review
export async function rejectReview(id: string) {
  try {
    const [review] = await db.update(reviews)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reject review' };
  }
}

// Get reviews statistics
export async function getReviewStats() {
  try {
    const [totalReviews, pendingReviews, approvedReviews, rejectedReviews] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(reviews),
      db.select({ count: sql`count(*)` }).from(reviews).where(eq(reviews.status, 'pending')),
      db.select({ count: sql`count(*)` }).from(reviews).where(eq(reviews.status, 'approved')),
      db.select({ count: sql`count(*)` }).from(reviews).where(eq(reviews.status, 'rejected'))
    ]);
    
    return {
      success: true,
      data: {
        total: totalReviews[0]?.count || 0,
        pending: pendingReviews[0]?.count || 0,
        approved: approvedReviews[0]?.count || 0,
        rejected: rejectedReviews[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get review stats' };
  }
}
