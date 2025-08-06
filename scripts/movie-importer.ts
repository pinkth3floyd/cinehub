#!/usr/bin/env node

import { movies } from '../src/app/core/entities/movies/schema';
import { movieGenres, movieTags } from '../src/app/core/entities/movies/relationships';
import { genres } from '../src/app/core/entities/genre/schema';
import { types } from '../src/app/core/entities/type/schema';
import { years } from '../src/app/core/entities/year/schema';
import { tags } from '../src/app/core/entities/tags/schema';
import { eq, like } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// Lazy database connection
let db: any;
async function getDb() {
  if (!db) {
    const { db: database } = await import('../src/app/core/entities/index');
    db = database;
  }
  return db;
}

// IMDb API configuration
const IMDB_API_BASE = 'https://imdb-api.com/API';
const IMDB_API_KEY = process.env.IMDB_API_KEY;

// Movie data interface
interface IMDBMovie {
  id: string;
  title: string;
  year: string;
  plot: string;
  poster: string;
  runtimeStr: string;
  rating: string;
  genres: string;
  directorList: Array<{ id: string; name: string }>;
  starList: Array<{ id: string; name: string }>;
  contentRating: string;
  imDbRating: string;
  imDbRatingVotes: string;
  metacriticRating: string;
  trailer: string;
}

interface ImportOptions {
  limit?: number;
  searchTerm?: string;
  year?: string;
  type?: string;
  genre?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

// Utility functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseDuration(durationStr: string): number | null {
  const match = durationStr.match(/(\d+)\s*min/);
  return match ? parseInt(match[1]) : null;
}

function parseRating(ratingStr: string): number {
  const rating = parseFloat(ratingStr);
  return isNaN(rating) ? 0 : Math.min(Math.max(rating, 0), 10);
}

async function searchIMDBMovies(searchTerm: string, limit: number = 10): Promise<IMDBMovie[]> {
  if (!IMDB_API_KEY) {
    throw new Error('IMDB_API_KEY environment variable is required');
  }

  const searchUrl = `${IMDB_API_BASE}/SearchMovie/${IMDB_API_KEY}/${encodeURIComponent(searchTerm)}`;
  console.log(`🔍 Searching IMDb for: "${searchTerm}"`);
  
  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`IMDb API error: ${response.status} ${response.statusText}`);
  }

  const searchData = await response.json();
  
  if (searchData.errorMessage) {
    throw new Error(`IMDb API error: ${searchData.errorMessage}`);
  }

  const results = searchData.results || [];
  console.log(`📊 Found ${results.length} movies`);

  // Get detailed info for each movie
  const detailedMovies: IMDBMovie[] = [];
  
  for (let i = 0; i < Math.min(results.length, limit); i++) {
    const movie = results[i];
    console.log(`📖 Fetching details for: ${movie.title} (${movie.description})`);
    
    try {
      const detailUrl = `${IMDB_API_BASE}/Title/${IMDB_API_KEY}/${movie.id}`;
      const detailResponse = await fetch(detailUrl);
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        
        if (!detailData.errorMessage) {
          detailedMovies.push(detailData);
        }
      }
      
      // Rate limiting - be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.warn(`⚠️ Failed to fetch details for ${movie.title}:`, error);
    }
  }

  return detailedMovies;
}

async function ensureType(name: string): Promise<string> {
  const database = await getDb();
  const existingType = await database.select().from(types).where(eq(types.name, name)).limit(1);
  
  if (existingType.length > 0) {
    return existingType[0].id;
  }

  const slug = generateSlug(name);
  const [newType] = await database.insert(types).values({
    id: createId(),
    name,
    slug,
  }).returning();

  console.log(`✅ Created type: ${name}`);
  return newType.id;
}

async function ensureYear(yearStr: string): Promise<string | null> {
  const year = parseInt(yearStr);
  if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    return null;
  }

  const database = await getDb();
  const existingYear = await database.select().from(years).where(eq(years.year, year)).limit(1);
  
  if (existingYear.length > 0) {
    return existingYear[0].id;
  }

  const [newYear] = await database.insert(years).values({
    id: createId(),
    year,
  }).returning();

  console.log(`✅ Created year: ${year}`);
  return newYear.id;
}

async function ensureGenre(name: string): Promise<string | null> {
  const database = await getDb();
  const existingGenre = await database.select().from(genres).where(eq(genres.name, name)).limit(1);
  
  if (existingGenre.length > 0) {
    return existingGenre[0].id;
  }

  const slug = generateSlug(name);
  const [newGenre] = await database.insert(genres).values({
    id: createId(),
    name,
    slug,
    description: `Auto-created genre: ${name}`,
  }).returning();

  console.log(`✅ Created genre: ${name}`);
  return newGenre.id;
}

async function ensureTags(tagNames: string[]): Promise<string[]> {
  const database = await getDb();
  const tagIds: string[] = [];
  
  for (const tagName of tagNames) {
    const existingTag = await database.select().from(tags).where(eq(tags.name, tagName)).limit(1);
    
    if (existingTag.length > 0) {
      tagIds.push(existingTag[0].id);
    } else {
      const slug = generateSlug(tagName);
      const [newTag] = await database.insert(tags).values({
        id: createId(),
        name: tagName,
        slug,
      }).returning();
      
      console.log(`✅ Created tag: ${tagName}`);
      tagIds.push(newTag.id);
    }
  }
  
  return tagIds;
}

async function importMovie(movieData: IMDBMovie, options: ImportOptions): Promise<void> {
  const database = await getDb();
  const slug = generateSlug(movieData.title);
  
  // Check if movie already exists
  const existingMovie = await database.select().from(movies).where(eq(movies.slug, slug)).limit(1);
  if (existingMovie.length > 0) {
    console.log(`⏭️ Skipping existing movie: ${movieData.title}`);
    return;
  }

  // Ensure required entities exist
  const typeId = await ensureType('Movie'); // Default to 'Movie' type
  const yearId = await ensureYear(movieData.year);
  
  // Parse genres and create them
  const genreNames = movieData.genres.split(', ').filter(Boolean);
  const genreId = genreNames.length > 0 ? await ensureGenre(genreNames[0]) : null;
  
  // Create tags from directors and stars
  const tagNames = [
    ...movieData.directorList.map(d => d.name),
    ...movieData.starList.slice(0, 3).map(s => s.name) // Limit to top 3 stars
  ];
  const tagIds = await ensureTags(tagNames);

  // Prepare movie data
  const movieInsertData = {
    id: createId(),
    title: movieData.title,
    slug,
    description: movieData.plot || undefined,
    content: movieData.plot || undefined,
    poster: movieData.poster || undefined,
    banner: movieData.poster || undefined, // Use poster as banner if no banner
    trailer: movieData.trailer || undefined,
    duration: parseDuration(movieData.runtimeStr) || undefined,
    rating: parseRating(movieData.imDbRating),
    releaseDate: movieData.year ? new Date(`${movieData.year}-01-01`) : undefined,
    status: options.status || 'published',
    featured: options.featured || false,
    typeId,
    yearId: yearId || undefined,
    genreId: genreId || undefined,
    server: undefined,
    link: undefined,
  };

  // Insert movie
  const [movie] = await database.insert(movies).values(movieInsertData).returning();
  console.log(`✅ Imported movie: ${movieData.title}`);

  // Create movie-tag relationships
  if (tagIds.length > 0) {
    const movieTagData = tagIds.map(tagId => ({
      id: createId(),
      movieId: movie.id,
      tagId,
    }));

    await database.insert(movieTags).values(movieTagData);
    console.log(`📝 Added ${tagIds.length} tags to movie`);
  }

  // Create movie-genre relationship if genre exists
  if (genreId) {
    await database.insert(movieGenres).values({
      id: createId(),
      movieId: movie.id,
      genreId,
    });
    console.log(`🎭 Added genre relationship`);
  }
}

async function importMovies(options: ImportOptions = {}): Promise<void> {
  const {
    limit = 10,
    searchTerm = 'popular movies 2024',
    year,
    type = 'Movie',
    genre,
    featured = false,
    status = 'published'
  } = options;

  console.log('🎬 Starting movie import from IMDb...');
  console.log(`📋 Options:`, { limit, searchTerm, year, type, genre, featured, status });

  try {
    // Search for movies
    const imdbMovies = await searchIMDBMovies(searchTerm, limit);
    
    if (imdbMovies.length === 0) {
      console.log('❌ No movies found');
      return;
    }

    console.log(`🚀 Importing ${imdbMovies.length} movies...`);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const movieData of imdbMovies) {
      try {
        await importMovie(movieData, { year, type, genre, featured, status });
        importedCount++;
      } catch (error) {
        console.error(`❌ Failed to import ${movieData.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${importedCount}`);
    console.log(`⏭️ Skipped (already exists): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Total processed: ${imdbMovies.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const searchTerm = process.argv[3] || 'popular movies 2024';
  const limit = parseInt(process.argv[4]) || 10;

  switch (command) {
    case 'import':
      if (!IMDB_API_KEY) {
        console.error('❌ IMDB_API_KEY environment variable is required');
        console.log('💡 Get your API key from: https://imdb-api.com/APIKey');
        process.exit(1);
      }
      await importMovies({
        limit,
        searchTerm,
        status: 'published',
        featured: false
      });
      break;
      
    case 'import-featured':
      if (!IMDB_API_KEY) {
        console.error('❌ IMDB_API_KEY environment variable is required');
        console.log('💡 Get your API key from: https://imdb-api.com/APIKey');
        process.exit(1);
      }
      await importMovies({
        limit,
        searchTerm,
        status: 'published',
        featured: true
      });
      break;
      
    case 'import-draft':
      if (!IMDB_API_KEY) {
        console.error('❌ IMDB_API_KEY environment variable is required');
        console.log('💡 Get your API key from: https://imdb-api.com/APIKey');
        process.exit(1);
      }
      await importMovies({
        limit,
        searchTerm,
        status: 'draft',
        featured: false
      });
      break;
      
    case 'help':
      console.log(`
🎬 Movie Importer Script

Usage:
  tsx scripts/movie-importer.ts <command> [search-term] [limit]

Commands:
  import           Import movies as published
  import-featured  Import movies as featured and published
  import-draft     Import movies as draft
  help             Show this help message

Examples:
  tsx scripts/movie-importer.ts import "action movies 2024" 5
  tsx scripts/movie-importer.ts import-featured "comedy movies" 10
  tsx scripts/movie-importer.ts import-draft "drama movies 2023" 3

Environment Variables:
  IMDB_API_KEY     Required: Your IMDb API key
                   Get it from: https://imdb-api.com/APIKey

Features:
  ✅ Automatic slug generation
  ✅ Duplicate detection
  ✅ Auto-create types, years, genres, tags
  ✅ Movie-tag relationships
  ✅ Movie-genre relationships
  ✅ Rate limiting for API calls
  ✅ Progress tracking
  ✅ Error handling
      `);
      break;
      
    default:
      console.log('❌ Invalid command. Use "help" to see available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
} 