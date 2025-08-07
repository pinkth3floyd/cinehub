import {
  Header,
  Footer,
  HeroSection,
  HomeFilter,
  MovieSection
} from './core/ui';
import { 
  getFeaturedMovies, 
  getLatestMovies, 
  getTopRatedMovies 
} from './core/entities/movies/actions';

export default async function Home() {
  // Fetch movies for different sections
  const [featuredResult, latestResult, topRatedResult] = await Promise.all([
    getFeaturedMovies(6),
    getLatestMovies(12),
    getTopRatedMovies(12)
  ]);

  const featuredMovies = featuredResult.success ? featuredResult.data || [] : [];
  const latestMovies = latestResult.success ? latestResult.data || [] : [];
  const topRatedMovies = topRatedResult.success ? topRatedResult.data || [] : [];

  return (
    <>
      <Header />
      
      {/* Hero Section with Featured Movies */}
      <HeroSection movies={featuredMovies} />
      
      {/* Filter Section */}
      <HomeFilter 
        filters={[
          {
            name: 'genre',
            label: 'Genre',
            options: [
              { value: 'action', label: 'Action' },
              { value: 'comedy', label: 'Comedy' },
              { value: 'drama', label: 'Drama' },
              { value: 'horror', label: 'Horror' },
              { value: 'romance', label: 'Romance' },
              { value: 'thriller', label: 'Thriller' }
            ]
          },
          {
            name: 'year',
            label: 'Year',
            options: [
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
              { value: '2020', label: '2020' }
            ]
          },
          {
            name: 'rating',
            label: 'Rating',
            options: [
              { value: '9+', label: '9+ Stars' },
              { value: '8+', label: '8+ Stars' },
              { value: '7+', label: '7+ Stars' },
              { value: '6+', label: '6+ Stars' }
            ]
          }
        ]}
      />
      
      {/* Latest Releases Section */}
      <MovieSection
        title="Latest Releases"
        subtitle="Discover the newest movies added to our collection"
        movies={latestMovies}
        columns={6}
        variant="default"
      />
      
      {/* Top Rated Section */}
      <MovieSection
        title="Top Rated"
        subtitle="Highest rated movies by our community"
        movies={topRatedMovies}
        columns={6}
        variant="default"
      />
      
      {/* Recommended Section - Using a mix of featured and top rated */}
      <MovieSection
        title="Recommended for You"
        subtitle="Personalized recommendations based on your preferences"
        movies={[...featuredMovies, ...topRatedMovies].slice(0, 12)}
        columns={6}
        variant="default"
      />
      
      {/* Trending Section - Using latest movies with high ratings */}
      <MovieSection
        title="Trending Now"
        subtitle="Movies that are gaining popularity"
        movies={latestMovies.filter(movie => (movie.rating || 0) >= 7).slice(0, 12)}
        columns={6}
        variant="default"
      />
      
      <Footer />
    </>
  );
}
