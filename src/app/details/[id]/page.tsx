import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getMovieById, getFeaturedMovies, getLatestMovies } from '../../core/entities/movies/actions';
import { getReviewsByMovieId } from '../../core/entities/reviews/actions';
import { Header, Footer, Breadcrumbs } from '../../core/ui';
import MovieDetailContent from './components/MovieDetailContent';
import MovieDetailSidebar from './components/MovieDetailSidebar';
import StructuredData from './components/StructuredData';
// import StructuredData from './components/StructuredData';

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate dynamic metadata for each movie
export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const movieResult = await getMovieById(id);
    
    if (!movieResult.success || !movieResult.data) {
      return {
        title: 'Movie Not Found - CineHub',
        description: 'The requested movie could not be found.',
      };
    }

    const movie = movieResult.data;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinehub.com';
    
    // Format duration
    const formatDuration = (minutes?: number) => {
      if (!minutes) return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Format year
    const formatYear = (date?: Date | null) => {
      if (!date) return '';
      return new Date(date).getFullYear().toString();
    };

    const title = `${movie.title} (${formatYear(movie.releaseDate)}) - Watch Online - CineHub`;
    const description = movie.description 
      ? `${movie.description.substring(0, 150)}... Watch ${movie.title} online in HD quality.`
      : `Watch ${movie.title} online. Stream the latest movies and TV shows on CineHub.`;
    
    const keywords = [
      movie.title,
      'watch online',
      'stream',
      'movie',
      'HD',
      formatYear(movie.releaseDate),
      'CineHub'
    ].filter(Boolean).join(', ');

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'video.movie',
        url: `${baseUrl}/details/${movie.id}`,
        images: movie.poster ? [
          {
            url: movie.poster,
            width: 800,
            height: 1200,
            alt: movie.title,
          }
        ] : undefined,
        siteName: 'CineHub',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: movie.poster ? [movie.poster] : undefined,
      },
      alternates: {
        canonical: `${baseUrl}/details/${movie.id}`,
      },
      other: {
        'movie:duration': formatDuration(movie.duration || undefined),
        'movie:rating': movie.rating?.toString() || '',
        'movie:release_date': movie.releaseDate?.toISOString() || '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie Details - CineHub',
      description: 'Watch the latest movies and TV shows online.',
    };
  }
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
      
      {/* Structured Data */}
      <StructuredData movie={movie} reviews={reviews} />
      
      <div className="content">
        <div className="container">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Catalog', href: '/catalog' },
              { label: movie.title, current: true }
            ]}
            className="mb-4"
          />
          
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