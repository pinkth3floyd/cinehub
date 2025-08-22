'use client';

import React, { useState, useEffect } from 'react';
import { Header, Footer, MovieGrid, Section, SearchBar } from '../core/ui';
import { getMovies } from '../core/entities/movies/actions';

interface Movie {
  id: string;
  title: string;
  poster?: string | null;
  banner?: string | null;
  rating: number | null;
  status: string;
  featured: boolean;
  createdAt: Date;
  genres?: string[];
}

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMovies, setTotalMovies] = useState(0);
  const [filters, setFilters] = useState({
    status: 'published' as 'draft' | 'published' | 'archived',
    typeId: '',
    yearId: '',
    genreId: '',
    featured: undefined as boolean | undefined
  });

  const ITEMS_PER_PAGE = 12;

  // Fetch movies from database
  const fetchMovies = async (page: number = 1, search: string = '', reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMovies({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        ...filters
      });

      if (result.success && result.data) {
        const newMovies = result.data.movies;
        const total = result.data.pagination.total;
        
        if (reset) {
          setMovies(newMovies);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
        }
        
        setTotalMovies(total);
        setHasMore(page < result.data.pagination.totalPages);
        setCurrentPage(page);
      } else {
        setError(result.error || 'Failed to fetch movies');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMovies(1, searchQuery, true);
  }, [filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchMovies(1, query, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMovies(currentPage + 1, searchQuery, false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      
      <Section title="Movie Catalog" variant="border">
        <div className="catalog__filters">
          <div className="row">
            <div className="col-12">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search movies..."
                className="catalog__search"
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="catalog__filter-controls">
                <div className="row">
                  <div className="col-md-3">
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select"
                      value={filters.featured === undefined ? '' : filters.featured.toString()}
                      onChange={(e) => handleFilterChange('featured', e.target.value === '' ? undefined : e.target.value === 'true')}
                    >
                      <option value="">All Movies</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Non-Featured</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="catalog__results-count">
                      {totalMovies} movies found
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="catalog__sort-controls">
                      <select className="form-select">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="rating">Highest Rated</option>
                        <option value="title">Title A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="ti ti-alert-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <MovieGrid
            movies={movies}
            columns={6}
            variant="default"
            showLoadMore={hasMore}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        )}

        {/* No Results */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-5">
            <i className="ti ti-movie-off" style={{ fontSize: '48px', color: '#6c757d' }}></i>
            <h3 className="mt-3">No movies found</h3>
            <p className="text-muted">
              {searchQuery 
                ? `No movies match your search for "${searchQuery}"`
                : 'No movies are available at the moment.'
              }
            </p>
          </div>
        )}

        {/* Load More Loading */}
        {loading && movies.length > 0 && (
          <div className="text-center mt-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading more movies...</span>
          </div>
        )}
      </Section>

      <Footer />
    </>
  );
} 