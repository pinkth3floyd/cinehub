
import {
  Header,
  Footer,
  HeroSection,
  FilterBar,
  MovieGrid,
  MovieSection
} from './core/ui';
import { 
  getFeaturedMovies, 
  getLatestMovies, 
  getTopRatedMovies 
} from './core/entities/movies/actions';
import { getSiteInfo } from './core/utils/siteSettings';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

export default async function Home() {
  // const router = useRouter();
  // Fetch movies for different sections
  const [featuredResult, latestResult, topRatedResult, siteInfo] = await Promise.all([
    getFeaturedMovies(6),
    getLatestMovies(12),
    getTopRatedMovies(12),
    getSiteInfo()
  ]);

  const featuredMovies = featuredResult.success ? featuredResult.data || [] : [];
  const latestMovies = latestResult.success ? latestResult.data || [] : [];
  const topRatedMovies = topRatedResult.success ? topRatedResult.data || [] : [];

  return (
    <>
      <Header />
      
      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <HeroSection movies={featuredMovies} />
      </section>
      
      {/* Filter Bar */}
      <FilterBar />
      
      {/* Recently Updated Section */}
      <section className="recently-updated">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="ti ti-clock"></i>
              Recently Updated
            </h2>
            <a href="/catalog" className="view-all-btn">
              View All
              <i className="ti ti-arrow-right"></i>
            </a>
          </div>
          
          <div className="movies-grid">
            {latestMovies.map((movie) => (
              <Link key={movie.id} className="movie-card"
              href={`/details/${movie.id}`}
              // onClick={() => {
              //   router.push(`/details/${movie.id}`);
              // }}
              >
                <div className="movie-poster">
                  <img 
                    src={movie.poster || '/core/assets/img/covers/cover.jpg'} 
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="movie-badge">HD</div>
                  <div className="movie-overlay">
                    <Link className="play-btn"
                    href={`/details/${movie.id}`}
                    >
                      {/* https://cinehub-red.vercel.app/details/jn8xe4b2gwu3q17fm72lk5t9 */}
                      <i className="ti ti-player-play"></i>
                    </Link>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="episode">Duration: {movie.duration}</span>
                      <span className="quality">Quality: {movie.server || 'HD'}</span>
                      {/* <span className="language">Language: {movie.servers[0]?.language || 'English'}</span> */}
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Releases Section */}
      {/* <MovieSection
        title="Latest Releases"
        subtitle="Discover the newest movies added to our collection"
        movies={latestMovies}
        columns={6}
        variant="default"
      /> */}
      
      {/* Top Rated Section */}
      {/* <MovieSection
        title="Top Rated"
        subtitle="Highest rated movies by our community"
        movies={topRatedMovies}
        columns={6}
        variant="default"
      /> */}
      
      {/* Recommended Section */}
      {/* <MovieSection
        title="Recommended for You"
        subtitle="Personalized recommendations based on your preferences"
        movies={[...featuredMovies, ...topRatedMovies].slice(0, 12)}
        columns={6}
        variant="default"
      /> */}
      
      {/* Trending Section */}
      {/* <MovieSection
        title="Trending Now"
        subtitle="Movies that are gaining popularity"
        movies={latestMovies.filter(movie => (movie.rating || 0) >= 7).slice(0, 12)}
        columns={6}
        variant="default"
      /> */}
      
      <Footer />
    </>
  );
}
