// #!/usr/bin/env node

// // Load environment variables
// import { config } from 'dotenv';
// config();

// import { movies } from '../src/app/core/entities/movies/schema';
// import { genres } from '../src/app/core/entities/genre/schema';
// import { types } from '../src/app/core/entities/type/schema';
// import { years } from '../src/app/core/entities/year/schema';
// import { tags } from '../src/app/core/entities/tags/schema';
// import { movieTags } from '../src/app/core/entities/movies/relationships';
// import { eq } from 'drizzle-orm';

// // Lazy database connection
// let db: any;
// async function getDb() {
//   if (!db) {
//     const { db: database } = await import('../src/app/core/entities/index');
//     db = database;
//   }
//   return db;
// }

// async function listMovies() {
//   const database = await getDb();
  
//   console.log('🎬 Listing imported movies...\n');
  
//   const allMovies = await database
//     .select({
//       id: movies.id,
//       title: movies.title,
//       slug: movies.slug,
//       description: movies.description,
//       poster: movies.poster,
//       rating: movies.rating,
//       releaseDate: movies.releaseDate,
//       status: movies.status,
//       featured: movies.featured,
//       duration: movies.duration,
//       typeName: types.name,
//       genreName: genres.name,
//       year: years.year,
//     })
//     .from(movies)
//     .leftJoin(types, eq(movies.typeId, types.id))
//     .leftJoin(genres, eq(movies.genreId, genres.id))
//     .leftJoin(years, eq(movies.yearId, years.id))
//     .orderBy(movies.createdAt);

//   if (allMovies.length === 0) {
//     console.log('❌ No movies found in database');
//     return;
//   }

//   console.log(`📊 Found ${allMovies.length} movies:\n`);

//   for (const movie of allMovies) {
//     console.log(`🎭 ${movie.title} (${movie.year || 'Unknown Year'})`);
//     console.log(`   📝 Slug: ${movie.slug}`);
//     console.log(`   ⭐ Rating: ${movie.rating}/10`);
//     console.log(`   🎬 Type: ${movie.typeName}`);
//     console.log(`   🎭 Genre: ${movie.genreName || 'None'}`);
//     console.log(`   ⏱️ Duration: ${movie.duration ? `${movie.duration} min` : 'Unknown'}`);
//     console.log(`   📅 Release: ${movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'Unknown'}`);
//     console.log(`   📊 Status: ${movie.status}`);
//     console.log(`   ⭐ Featured: ${movie.featured ? 'Yes' : 'No'}`);
//     if (movie.poster) {
//       console.log(`   🖼️ Poster: ${movie.poster}`);
//     }
//     if (movie.description) {
//       console.log(`   📖 Description: ${movie.description.substring(0, 100)}${movie.description.length > 100 ? '...' : ''}`);
//     }
//     console.log('');
//   }

//   // Show some statistics
//   const featuredCount = allMovies.filter(m => m.featured).length;
//   const publishedCount = allMovies.filter(m => m.status === 'published').length;
//   const draftCount = allMovies.filter(m => m.status === 'draft').length;
  
//   console.log('📈 Statistics:');
//   console.log(`   Total movies: ${allMovies.length}`);
//   console.log(`   Featured: ${featuredCount}`);
//   console.log(`   Published: ${publishedCount}`);
//   console.log(`   Draft: ${draftCount}`);
// }

// async function main() {
//   const command = process.argv[2];

//   switch (command) {
//     case 'list':
//       await listMovies();
//       break;
      
//     case 'help':
//       console.log(`
// 📋 Movie Lister Script

// Usage:
//   tsx scripts/list-movies.ts <command>

// Commands:
//   list    List all imported movies with details
//   help    Show this help message

// Examples:
//   tsx scripts/list-movies.ts list
//       `);
//       break;
      
//     default:
//       console.log('❌ Invalid command. Use "help" to see available commands.');
//       process.exit(1);
//   }
// }

// if (require.main === module) {
//   main().catch(console.error);
// } 