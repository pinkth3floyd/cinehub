'use server';

import { db } from '../index';
import { sql } from 'drizzle-orm';
import { movies } from '../movies/schema';
import { users } from '../user/schema';
import { reviews } from '../reviews/schema';
import { genres } from '../genre/schema';
import { types } from '../type/schema';
import { tags } from '../tags/schema';
import { years } from '../year/schema';

// Get all dashboard statistics
export async function getDashboardStats() {
  try {
    const [
      movieStats,
      userStats,
      reviewStats,
      genreStats,
      typeStats,
      tagStats,
      yearStats
    ] = await Promise.all([
      // Movie stats
      db.select({
        total: sql`count(*)`,
        published: sql`count(case when status = 'published' then 1 end)`,
        draft: sql`count(case when status = 'draft' then 1 end)`,
        featured: sql`count(case when featured = 1 then 1 end)`
      }).from(movies),
      
      // User stats
      db.select({
        total: sql`count(*)`,
        active: sql`count(case when status = 'active' then 1 end)`,
        banned: sql`count(case when status = 'banned' then 1 end)`
      }).from(users),
      
      // Review stats
      db.select({
        total: sql`count(*)`,
        pending: sql`count(case when status = 'pending' then 1 end)`,
        approved: sql`count(case when status = 'approved' then 1 end)`,
        rejected: sql`count(case when status = 'rejected' then 1 end)`
      }).from(reviews),
      
      // Genre stats
      db.select({ total: sql`count(*)` }).from(genres),
      
      // Type stats
      db.select({ total: sql`count(*)` }).from(types),
      
      // Tag stats
      db.select({ total: sql`count(*)` }).from(tags),
      
      // Year stats
      db.select({ total: sql`count(*)` }).from(years)
    ]);

    return {
      success: true,
      data: {
        movies: {
          total: Number(movieStats[0]?.total || 0),
          published: Number(movieStats[0]?.published || 0),
          draft: Number(movieStats[0]?.draft || 0),
          featured: Number(movieStats[0]?.featured || 0)
        },
        users: {
          total: Number(userStats[0]?.total || 0),
          active: Number(userStats[0]?.active || 0),
          banned: Number(userStats[0]?.banned || 0)
        },
        reviews: {
          total: Number(reviewStats[0]?.total || 0),
          pending: Number(reviewStats[0]?.pending || 0),
          approved: Number(reviewStats[0]?.approved || 0),
          rejected: Number(reviewStats[0]?.rejected || 0)
        },
        genres: {
          total: Number(genreStats[0]?.total || 0)
        },
        types: {
          total: Number(typeStats[0]?.total || 0)
        },
        tags: {
          total: Number(tagStats[0]?.total || 0)
        },
        years: {
          total: Number(yearStats[0]?.total || 0)
        }
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get dashboard stats' 
    };
  }
} 