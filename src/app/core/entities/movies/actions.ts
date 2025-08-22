'use server';

import { db } from '../index';
import { movies, movieServers, movieLinks } from './schema';
import { movieGenres, movieTags } from './relationships';
import { eq, desc, and, like, or, sql, inArray } from 'drizzle-orm';
import { createMovieSchema, updateMovieSchema, movieFilterSchema, type CreateMovieInput, type UpdateMovieInput, type MovieFilterInput } from './schema';
import { type CreateMovieGenreInput, type CreateMovieTagInput } from './relationships';

// Create a new movie
export async function createMovie(data: CreateMovieInput) {
  try {
    // Validate input
    const validatedData = createMovieSchema.parse(data);
    
    // Extract arrays for separate handling
    const { tagIds, servers, links, ...movieData } = validatedData;
    
    // Clean up movieData for database insertion
    const cleanMovieData: any = { ...movieData };
    
    // Handle releaseDate - only include if it's a valid Date
    if (cleanMovieData.releaseDate && cleanMovieData.releaseDate instanceof Date) {
      cleanMovieData.releaseDate = cleanMovieData.releaseDate;
    } else {
      delete cleanMovieData.releaseDate;
    }
    
    // Handle null values for server and link
    if (cleanMovieData.server === null) {
      delete cleanMovieData.server;
    }
    if (cleanMovieData.link === null) {
      delete cleanMovieData.link;
    }
    
    // Remove updatedAt as it has a default in schema
    delete cleanMovieData.updatedAt;
    
    // Create movie
    const [movie] = await db.insert(movies).values(cleanMovieData).returning();
    
    // Create movie-tag relationships if tagIds provided
    if (tagIds && tagIds.length > 0) {
      const movieTagData: CreateMovieTagInput[] = tagIds.map(tagId => ({
        movieId: movie.id,
        tagId
      }));
      
      await db.insert(movieTags).values(movieTagData);
    }

    // Create movie servers if provided
    if (servers && servers.length > 0) {
      const serverData = servers.map(server => ({
        movieId: movie.id,
        name: server.name,
        url: server.url,
        quality: server.quality,
        language: server.language,
        videoType: server.videoType || 'mp4',
      }));
      
      await db.insert(movieServers).values(serverData);
    }

    // Create movie links if provided
    if (links && links.length > 0) {
      const linkData = links.map(link => ({
        movieId: movie.id,
        title: link.title,
        url: link.url,
        type: link.type,
        quality: link.quality,
      }));
      
      await db.insert(movieLinks).values(linkData);
    }
    
    return { success: true, data: movie };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create movie' };
  }
}

// Get all movies with filtering and pagination
export async function getMovies(filters: MovieFilterInput = { page: 1, limit: 10 }) {
  try {
    const validatedFilters = movieFilterSchema.parse(filters);
    const { page = 1, limit = 10, search, status, typeId, yearId, genreId, featured } = validatedFilters;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(movies.title, `%${search}%`),
          like(movies.description, `%${search}%`)
        )
      );
    }
    
    if (status) {
      conditions.push(eq(movies.status, status));
    }
    
    if (typeId) {
      conditions.push(eq(movies.typeId, typeId));
    }
    
    if (yearId) {
      conditions.push(eq(movies.yearId, yearId));
    }
    
    if (genreId) {
      conditions.push(eq(movies.genreId, genreId));
    }
    
    if (featured !== undefined) {
      conditions.push(eq(movies.featured, featured));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const moviesList = await db.select().from(movies)
      .where(whereClause)
      .orderBy(desc(movies.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(movies).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        movies: moviesList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movies' };
  }
}

// Get movie by ID with tags, servers, and links
export async function getMovieById(id: string) {
  try {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    
    if (!movie) {
      return { success: false, error: 'Movie not found' };
    }
    
    // Get movie tags
    const movieTagsList = await db.select({
      tagId: movieTags.tagId
    }).from(movieTags).where(eq(movieTags.movieId, id));
    
    const tagIds = movieTagsList.map(mt => mt.tagId);

    // Get movie servers
    const movieServersList = await db.select().from(movieServers).where(eq(movieServers.movieId, id));
    
    // Get movie links
    const movieLinksList = await db.select().from(movieLinks).where(eq(movieLinks.movieId, id));
    
    return { 
      success: true, 
      data: { 
        ...movie, 
        tagIds,
        servers: movieServersList,
        links: movieLinksList
      } 
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie' };
  }
}

// Get movie by slug
export async function getMovieBySlug(slug: string) {
  try {
    const [movie] = await db.select().from(movies).where(eq(movies.slug, slug));
    
    if (!movie) {
      return { success: false, error: 'Movie not found' };
    }
    
    return { success: true, data: movie };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie' };
  }
}

// Update movie
export async function updateMovie(id: string, data: UpdateMovieInput) {
  try {
    // Validate input
    const validatedData = updateMovieSchema.parse(data);
    
    // Extract arrays for separate handling
    const { tagIds, servers, links, ...movieData } = validatedData;
    
    // Clean up movieData for database update
    const cleanMovieData: any = { ...movieData };
    
    // Handle releaseDate - only include if it's a valid Date
    if (cleanMovieData.releaseDate && cleanMovieData.releaseDate instanceof Date) {
      cleanMovieData.releaseDate = cleanMovieData.releaseDate;
    } else {
      delete cleanMovieData.releaseDate;
    }
    
    // Handle null values for server and link
    if (cleanMovieData.server === null) {
      delete cleanMovieData.server;
    }
    if (cleanMovieData.link === null) {
      delete cleanMovieData.link;
    }
    
    // Add updatedAt
    cleanMovieData.updatedAt = new Date();
    
    const [movie] = await db.update(movies)
      .set(cleanMovieData)
      .where(eq(movies.id, id))
      .returning();
    
    if (!movie) {
      return { success: false, error: 'Movie not found' };
    }
    
    // Update movie-tag relationships if tagIds provided
    if (tagIds !== undefined) {
      // Delete existing relationships
      await db.delete(movieTags).where(eq(movieTags.movieId, id));
      
      // Create new relationships if tagIds provided
      if (tagIds && tagIds.length > 0) {
        const movieTagData: CreateMovieTagInput[] = tagIds.map(tagId => ({
          movieId: id,
          tagId
        }));
        
        await db.insert(movieTags).values(movieTagData);
      }
    }

    // Update movie servers if provided
    if (servers !== undefined) {
      // Delete existing servers
      await db.delete(movieServers).where(eq(movieServers.movieId, id));
      
      // Create new servers if provided
      if (servers && servers.length > 0) {
        const serverData = servers.map(server => ({
          movieId: id,
          name: server.name,
          url: server.url,
          quality: server.quality,
          language: server.language,
          videoType: server.videoType || 'mp4',
        }));
        
        await db.insert(movieServers).values(serverData);
      }
    }

    // Update movie links if provided
    if (links !== undefined) {
      // Delete existing links
      await db.delete(movieLinks).where(eq(movieLinks.movieId, id));
      
      // Create new links if provided
      if (links && links.length > 0) {
        const linkData = links.map(link => ({
          movieId: id,
          title: link.title,
          url: link.url,
          type: link.type,
          quality: link.quality,
        }));
        
        await db.insert(movieLinks).values(linkData);
      }
    }
    
    return { success: true, data: movie };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update movie' };
  }
}

// Delete movie
export async function deleteMovie(id: string) {
  try {
    // Delete related records first
    await db.delete(movieTags).where(eq(movieTags.movieId, id));
    await db.delete(movieGenres).where(eq(movieGenres.movieId, id));
    await db.delete(movieServers).where(eq(movieServers.movieId, id));
    await db.delete(movieLinks).where(eq(movieLinks.movieId, id));
    
    const [movie] = await db.delete(movies).where(eq(movies.id, id)).returning();
    
    if (!movie) {
      return { success: false, error: 'Movie not found' };
    }
    
    return { success: true, data: movie };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete movie' };
  }
}

// Get movie tags
export async function getMovieTags(movieId: string) {
  try {
    const movieTagsList = await db.select({
      tagId: movieTags.tagId
    }).from(movieTags).where(eq(movieTags.movieId, movieId));
    
    return { success: true, data: movieTagsList.map(mt => mt.tagId) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie tags' };
  }
}

// Get movie servers
export async function getMovieServers(movieId: string) {
  try {
    const movieServersList = await db.select().from(movieServers).where(eq(movieServers.movieId, movieId));
    
    return { success: true, data: movieServersList };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie servers' };
  }
}

// Get movie links
export async function getMovieLinks(movieId: string) {
  try {
    const movieLinksList = await db.select().from(movieLinks).where(eq(movieLinks.movieId, movieId));
    
    return { success: true, data: movieLinksList };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie links' };
  }
}

// Add tags to movie
export async function addTagsToMovie(movieId: string, tagIds: string[]) {
  try {
    const movieTagData: CreateMovieTagInput[] = tagIds.map(tagId => ({
      movieId,
      tagId
    }));
    
    await db.insert(movieTags).values(movieTagData);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add tags to movie' };
  }
}

// Remove tags from movie
export async function removeTagsFromMovie(movieId: string, tagIds: string[]) {
  try {
    await db.delete(movieTags)
      .where(and(
        eq(movieTags.movieId, movieId),
        inArray(movieTags.tagId, tagIds)
      ));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove tags from movie' };
  }
}

// Get featured movies
export async function getFeaturedMovies(limit: number = 10) {
  try {
    const featuredMovies = await db.select()
      .from(movies)
      .where(and(eq(movies.featured, true), eq(movies.status, 'published')))
      .orderBy(desc(movies.createdAt))
      .limit(limit);
    
    return { success: true, data: featuredMovies };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get featured movies' };
  }
}

// Get top rated movies
export async function getTopRatedMovies(limit: number = 10) {
  try {
    const topMovies = await db.select()
      .from(movies)
      .where(eq(movies.status, 'published'))
      .orderBy(desc(movies.rating))
      .limit(limit);
    
    return { success: true, data: topMovies };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get top rated movies' };
  }
}

// Get latest movies
export async function getLatestMovies(limit: number = 10) {
  try {
    const latestMovies = await db.select()
      .from(movies)
      .where(eq(movies.status, 'published'))
      .orderBy(desc(movies.createdAt))
      .limit(limit);
    
    return { success: true, data: latestMovies };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get latest movies' };
  }
}

// Get movies statistics
export async function getMovieStats() {
  try {
    const [totalMovies, publishedMovies, draftMovies, featuredMovies] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(movies),
      db.select({ count: sql`count(*)` }).from(movies).where(eq(movies.status, 'published')),
      db.select({ count: sql`count(*)` }).from(movies).where(eq(movies.status, 'draft')),
      db.select({ count: sql`count(*)` }).from(movies).where(eq(movies.featured, true))
    ]);
    
    return {
      success: true,
      data: {
        total: totalMovies[0]?.count || 0,
        published: publishedMovies[0]?.count || 0,
        draft: draftMovies[0]?.count || 0,
        featured: featuredMovies[0]?.count || 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get movie stats' };
  }
}
