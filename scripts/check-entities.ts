#!/usr/bin/env node

// Load environment variables
import { config } from 'dotenv';
config();

import { getAllTypes } from '../src/app/core/entities/type/actions';
import { getAllYears } from '../src/app/core/entities/year/actions';
import { getAllGenres } from '../src/app/core/entities/genre/actions';
import { getAllTags } from '../src/app/core/entities/tags/actions';

async function checkEntities() {
  console.log('🔍 Checking database entities...\n');

  try {
    const [typesResult, yearsResult, genresResult, tagsResult] = await Promise.all([
      getAllTypes(),
      getAllYears(),
      getAllGenres(),
      getAllTags()
    ]);

    console.log('📊 Types:');
    if (typesResult.success && typesResult.data) {
      typesResult.data.forEach(type => {
        console.log(`  - ${type.name} (${type.id})`);
      });
    } else {
      console.log('  No types found');
    }

    console.log('\n📊 Years:');
    if (yearsResult.success && yearsResult.data) {
      yearsResult.data.forEach(year => {
        console.log(`  - ${year.year} (${year.id})`);
      });
    } else {
      console.log('  No years found');
    }

    console.log('\n📊 Genres:');
    if (genresResult.success && genresResult.data) {
      genresResult.data.forEach(genre => {
        console.log(`  - ${genre.name} (${genre.id})`);
      });
    } else {
      console.log('  No genres found');
    }

    console.log('\n📊 Tags:');
    if (tagsResult.success && tagsResult.data) {
      tagsResult.data.forEach(tag => {
        console.log(`  - ${tag.name} (${tag.id})`);
      });
    } else {
      console.log('  No tags found');
    }

  } catch (error) {
    console.error('❌ Error checking entities:', error);
  }
}

async function main() {
  await checkEntities();
}

if (require.main === module) {
  main().catch(console.error);
} 