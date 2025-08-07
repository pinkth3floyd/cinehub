#!/usr/bin/env node

// Load environment variables
import { config } from 'dotenv';
config();

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

// New IMDb API configuration
const IMDB_API_BASE = 'https://imdb236.p.rapidapi.com/api/imdb';
const IMDB_API_KEY = '296ea745dcmsh1f50d7b8afe8724p1e2901jsne0234d9676b4'; // Your provided key

// New API response interface based on the provided response
interface IMDBMovieResult {
  id: string;
  url: string;
  primaryTitle: string;
  originalTitle: string;
  type: string;
  description: string | null;
  primaryImage: string | null;
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  trailer: string | null;
  contentRating: string | null;
  isAdult: boolean;
  releaseDate: string | null;
  startYear: number | null;
  endYear: number | null;
  runtimeMinutes: number | null;
  genres: string[];
  interests: string[];
  countriesOfOrigin: string[];
  externalLinks: string[] | null;
  spokenLanguages: string[] | null;
  filmingLocations: string[] | null;
  productionCompanies: Array<{
    id: string;
    name: string;
  }>;
  budget: number | null;
  grossWorldwide: number | null;
  averageRating: number | null;
  numVotes: number | null;
  metascore: number | null;
}

interface IMDBSearchResponse {
  rows: number;
  numFound: number;
  results: IMDBMovieResult[];
  nextCursorMark?: string;
}

interface ImportOptions {
  limit?: number;
  searchTerm?: string;
  year?: string;
  type?: string;
  genre?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  sortOrder?: 'ASC' | 'DESC';
  sortField?: string;
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

function parseRating(rating: number | null): number {
  if (rating === null || rating === undefined) return 0;
  return Math.min(Math.max(rating, 0), 10);
}

function parseReleaseDate(dateStr: string | null, year: number | null): Date | undefined {
  if (dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  if (year) {
    return new Date(`${year}-01-01`);
  }
  
  return undefined;
}

async function searchIMDBMovies(options: {
  genre?: string;
  rows?: number;
  sortOrder?: 'ASC' | 'DESC';
  sortField?: string;
} = {}): Promise<IMDBMovieResult[]> {
  const {
    genre = 'Drama',
    rows = 25,
    sortOrder = 'ASC',
    sortField = 'id'
  } = options;

  const searchUrl = `${IMDB_API_BASE}/search?type=movie&genre=${encodeURIComponent(genre)}&rows=${rows}&sortOrder=${sortOrder}&sortField=${sortField}`;
  
  console.log(`🔍 Searching IMDb for movies with genre: "${genre}"`);
  console.log(`📊 Requesting ${rows} movies, sorted by ${sortField} ${sortOrder}`);
  
  const response = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'imdb236.p.rapidapi.com',
      'x-rapidapi-key': IMDB_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`IMDb API error: ${response.status} ${response.statusText}`);
  }

  const searchData: IMDBSearchResponse = await response.json();
  
  console.log(`📊 Found ${searchData.results.length} movies out of ${searchData.numFound} total`);
  
  return searchData.results;
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

async function ensureYear(year: number): Promise<string | null> {
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
    if (!tagName.trim()) continue;
    
    const existingTag = await database.select().from(tags).where(eq(tags.name, tagName)).limit(1);
    
    if (existingTag.length > 0) {
      tagIds.push(existingTag[0].id);
    } else {
      // Generate a unique slug by adding a suffix if needed
      let slug = generateSlug(tagName);
      let counter = 1;
      let originalSlug = slug;
      
      // Check if slug already exists and make it unique
      while (true) {
        const existingSlug = await database.select().from(tags).where(eq(tags.slug, slug)).limit(1);
        if (existingSlug.length === 0) {
          break;
        }
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      const [newTag] = await database.insert(tags).values({
        id: createId(),
        name: tagName,
        slug,
      }).returning();
      
      console.log(`✅ Created tag: ${tagName} (slug: ${slug})`);
      tagIds.push(newTag.id);
    }
  }
  
  return tagIds;
}

async function importMovie(movieData: IMDBMovieResult, options: ImportOptions): Promise<void> {
  const database = await getDb();
  const slug = generateSlug(movieData.primaryTitle);
  
  // Check if movie already exists
  const existingMovie = await database.select().from(movies).where(eq(movies.slug, slug)).limit(1);
  if (existingMovie.length > 0) {
    console.log(`⏭️ Skipping existing movie: ${movieData.primaryTitle}`);
    return;
  }

  // Ensure required entities exist
  const typeId = await ensureType('Movie'); // Default to 'Movie' type
  const yearId = movieData.startYear ? await ensureYear(movieData.startYear) : null;
  
  // Parse genres and create them
  const genreId = movieData.genres.length > 0 ? await ensureGenre(movieData.genres[0]) : null;
  
  // Create tags from production companies and countries
  const tagNames = [
    ...movieData.productionCompanies.map(company => company.name),
    ...movieData.countriesOfOrigin,
    ...(movieData.spokenLanguages || [])
  ].filter(Boolean);
  
  const tagIds = await ensureTags(tagNames);

  // Prepare movie data
  const movieInsertData = {
    id: createId(),
    title: movieData.primaryTitle,
    slug,
    description: movieData.description || undefined,
    content: movieData.description || undefined,
    poster: movieData.primaryImage || undefined,
    banner: movieData.primaryImage || undefined, // Use primary image as banner if no banner
    trailer: movieData.trailer || undefined,
    duration: movieData.runtimeMinutes || undefined,
    rating: parseRating(movieData.averageRating),
    releaseDate: parseReleaseDate(movieData.releaseDate, movieData.startYear),
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
  console.log(`✅ Imported movie: ${movieData.primaryTitle} (${movieData.startYear})`);

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
    limit = 25,
    genre = 'Drama',
    sortOrder = 'ASC',
    sortField = 'id',
    featured = false,
    status = 'published'
  } = options;

  console.log('🎬 Starting movie import from IMDb...');
  console.log(`📋 Options:`, { limit, genre, sortOrder, sortField, featured, status });

  try {
    // Search for movies
    const imdbMovies = await searchIMDBMovies({
      genre,
      rows: limit,
      sortOrder,
      sortField
    });
    
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
        await importMovie(movieData, { genre, featured, status });
        importedCount++;
      } catch (error) {
        console.error(`❌ Failed to import ${movieData.primaryTitle}:`, error);
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
  const genre = process.argv[3] || 'Drama';
  const limit = parseInt(process.argv[4]) || 25;

  switch (command) {
    case 'import':
      await importMovies({
        limit,
        genre,
        status: 'published',
        featured: false
      });
      break;
      
    case 'import-featured':
      await importMovies({
        limit,
        genre,
        status: 'published',
        featured: true
      });
      break;
      
    case 'import-draft':
      await importMovies({
        limit,
        genre,
        status: 'draft',
        featured: false
      });
      break;
      
    case 'help':
      console.log(`
🎬 Movie Importer Script (Updated for IMDb236 API)

Usage:
  tsx scripts/movie-importer.ts <command> [genre] [limit]

Commands:
  import           Import movies as published
  import-featured  Import movies as featured and published
  import-draft     Import movies as draft
  help             Show this help message

Examples:
  tsx scripts/movie-importer.ts import "Action" 10
  tsx scripts/movie-importer.ts import-featured "Comedy" 15
  tsx scripts/movie-importer.ts import-draft "Drama" 5

Available Genres:
  Action, Adventure, Animation, Biography, Comedy, Crime, 
  Documentary, Drama, Family, Fantasy, Film-Noir, History, 
  Horror, Music, Musical, Mystery, Romance, Sci-Fi, 
  Sport, Thriller, War, Western

Features:
  ✅ Uses IMDb236 RapidAPI
  ✅ Automatic slug generation
  ✅ Duplicate detection
  ✅ Auto-create types, years, genres, tags
  ✅ Movie-tag relationships
  ✅ Movie-genre relationships
  ✅ Progress tracking
  ✅ Error handling
  ✅ Rich movie data (posters, trailers, ratings, etc.)
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