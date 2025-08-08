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

export default async function Home() {
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
      
      {/* Movie Grid Section */}
      <MovieGrid />
      
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
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  <img 
                    src={movie.poster || '/core/assets/img/covers/cover.jpg'} 
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="movie-badge">HD</div>
                  <div className="movie-overlay">
                    <button className="play-btn">
                      <i className="ti ti-player-play"></i>
                    </button>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="episode">Ep {Math.floor(Math.random() * 20) + 1}</span>
                    <span className="quality">HD</span>
                    <span className="language">SUB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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
      
      {/* Recommended Section */}
      <MovieSection
        title="Recommended for You"
        subtitle="Personalized recommendations based on your preferences"
        movies={[...featuredMovies, ...topRatedMovies].slice(0, 12)}
        columns={6}
        variant="default"
      />
      
      {/* Trending Section */}
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
