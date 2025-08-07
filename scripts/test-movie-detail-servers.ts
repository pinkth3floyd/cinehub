import { config } from 'dotenv';
config();

import { getMovieById } from '../src/app/core/entities/movies/actions';

async function testMovieDetailServers() {
  try {
    console.log('Testing movie detail servers...');
    
    const movieId = 'r40ymvek4obfbss3zc4mlsdo';
    const result = await getMovieById(movieId);
    
    if (result.success && result.data) {
      const movie = result.data;
      console.log('Movie found:', movie.title);
      console.log('Servers:', movie.servers);
      console.log('Links:', movie.links);
      
      if (movie.servers && movie.servers.length > 0) {
        console.log('First server URL:', movie.servers[0].url);
        console.log('First server name:', movie.servers[0].name);
      } else {
        console.log('No servers found for this movie');
      }
    } else {
      console.log('Failed to get movie:', result.error);
    }
  } catch (error) {
    console.error('Error testing movie detail servers:', error);
  }
}

testMovieDetailServers(); 