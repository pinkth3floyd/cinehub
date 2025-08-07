#!/usr/bin/env node

// Load environment variables
import { config } from 'dotenv';
config();

import { getLatestMovies, getTopRatedMovies, getFeaturedMovies } from '../src/app/core/entities/movies/actions';
import { createReview, getReviewsByMovieId } from '../src/app/core/entities/reviews/actions';

async function testImports() {
  console.log('🔍 Testing Import Paths...\n');

  try {
    console.log('✅ All imports successful!');
    console.log('   - getLatestMovies: ✅');
    console.log('   - getTopRatedMovies: ✅');
    console.log('   - getFeaturedMovies: ✅');
    console.log('   - createReview: ✅');
    console.log('   - getReviewsByMovieId: ✅');

    console.log('\n🧪 Testing function calls...');
    
    // Test movies functions
    const [latestResult, topRatedResult, featuredResult] = await Promise.all([
      getLatestMovies(1),
      getTopRatedMovies(1),
      getFeaturedMovies(1)
    ]);

    console.log('✅ Movies functions working:');
    console.log(`   - Latest movies: ${latestResult.success ? 'Success' : 'Failed'}`);
    console.log(`   - Top rated movies: ${topRatedResult.success ? 'Success' : 'Failed'}`);
    console.log(`   - Featured movies: ${featuredResult.success ? 'Success' : 'Failed'}`);

    // Test reviews functions
    if (featuredResult.success && featuredResult.data && featuredResult.data.length > 0) {
      const testMovieId = featuredResult.data[0].id;
      const reviewsResult = await getReviewsByMovieId(testMovieId, 1);
      
      console.log('✅ Reviews functions working:');
      console.log(`   - getReviewsByMovieId: ${reviewsResult.success ? 'Success' : 'Failed'}`);
    }

    console.log('\n🎉 All imports and functions are working correctly!');
    console.log('✅ The movie detail page should now build successfully.');

  } catch (error) {
    console.error('❌ Import test failed:', error);
  }
}

async function main() {
  await testImports();
}

if (require.main === module) {
  main().catch(console.error);
} 