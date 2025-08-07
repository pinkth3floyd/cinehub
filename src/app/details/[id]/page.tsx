import { notFound } from 'next/navigation';
import { getMovieById, getFeaturedMovies, getLatestMovies } from '../../core/entities/movies/actions';
import { getReviewsByMovieId } from '../../core/entities/reviews/actions';
import { Header, Footer } from '../../core/ui';
import MovieDetailContent from './components/MovieDetailContent';
import MovieDetailSidebar from './components/MovieDetailSidebar';
// import MovieDetailSidebar from './components/MovieDetailSidebar';

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  // Await params before accessing its properties
  const { id } = await params;
  
  // Fetch movie data
  const movieResult = await getMovieById(id);
  
  if (!movieResult.success || !movieResult.data) {
    notFound();
  }

  const movie = movieResult.data;

  // Fetch related data
  const [featuredResult, latestResult, reviewsResult] = await Promise.all([
    getFeaturedMovies(6),
    getLatestMovies(6),
    getReviewsByMovieId(id, 10)
  ]);

  const featuredMovies = featuredResult.success ? featuredResult.data || [] : [];
  const latestMovies = latestResult.success ? latestResult.data || [] : [];
  const reviews = reviewsResult.success ? reviewsResult.data || [] : [];

  return (
    <>
      <Header />
      
      <div className="content">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-12 col-xl-9">
              <MovieDetailContent 
                movie={movie} 
                reviews={reviews}
              />
            </div>
            
            {/* Sidebar */}
            <div className="col-12 col-xl-3">
              <MovieDetailSidebar 
                featuredMovies={featuredMovies}
                latestMovies={latestMovies}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 