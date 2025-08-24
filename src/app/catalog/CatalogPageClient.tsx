'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header, Footer, MovieGrid, Section } from '../core/ui';
import { getMovies } from '../core/entities/movies/actions';
import { getAllTypes, getAllYears, getAllGenres } from '../core/entities/client';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

interface Movie {
  id: string;
  title: string;
  poster?: string | null;
  banner?: string | null;
  rating: number | null;
  status: string;
  featured: boolean;
  createdAt: Date;
  description?: string | null;
  duration?: number | null;
}

interface FilterOptions {
  types: Array<{ id: string; name: string }>;
  years: Array<{ id: string; year: number }>;
  genres: Array<{ id: string; name: string }>;
}

export default function CatalogPageClient() {
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
    featured: undefined as boolean | undefined,
    sortBy: 'newest' as 'newest' | 'oldest' | 'rating' | 'title'
  });

  const ITEMS_PER_PAGE = 12;

  // Fetch filter options using TanStack Query
  const { data: filterOptions, isLoading: filterOptionsLoading } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async (): Promise<FilterOptions> => {
      const [typesResult, yearsResult, genresResult] = await Promise.all([
        getAllTypes(),
        getAllYears(),
        getAllGenres()
      ]);

      return {
        types: typesResult.success ? typesResult.data || [] : [],
        years: yearsResult.success ? yearsResult.data || [] : [],
        genres: genresResult.success ? genresResult.data || [] : []
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      fetchMovies(1, query, true);
    }, 500),
    []
  );

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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.cancel();
    setSearchQuery(searchQuery);
    setCurrentPage(1);
    fetchMovies(1, searchQuery, true);
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'published',
      typeId: '',
      yearId: '',
      genreId: '',
      featured: undefined,
      sortBy: 'newest'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.typeId || filters.yearId || filters.genreId || filters.featured !== undefined || searchQuery;

  return (
    <>
      <Header />
      
      <Section title="Movie Catalog" variant="border">
        {/* Search Bar */}
        <div className="catalog__search-section">
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSearchSubmit} className="catalog__search-form">
                <div className="search-input-group">
                  <div className="search-input-wrapper">
                    <i className="ti ti-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search movies by title or description..."
                      defaultValue={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => {
                          setSearchQuery('');
                          fetchMovies(1, '', true);
                        }}
                      >
                        <i className="ti ti-x"></i>
                      </button>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary search-submit-btn">
                    <i className="ti ti-search"></i>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="catalog__filters-section">
          <div className="row">
            <div className="col-12">
              <div className="catalog__filter-controls">
                <div className="row g-3">
                  {/* Status Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.typeId}
                      onChange={(e) => handleFilterChange('typeId', e.target.value)}
                      disabled={filterOptionsLoading}
                    >
                      <option value="">All Types</option>
                      {filterOptions?.types.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.yearId}
                      onChange={(e) => handleFilterChange('yearId', e.target.value)}
                      disabled={filterOptionsLoading}
                    >
                      <option value="">All Years</option>
                      {filterOptions?.years.map(year => (
                        <option key={year.id} value={year.id}>
                          {year.year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Genre Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.genreId}
                      onChange={(e) => handleFilterChange('genreId', e.target.value)}
                      disabled={filterOptionsLoading}
                    >
                      <option value="">All Genres</option>
                      {filterOptions?.genres.map(genre => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.featured === undefined ? '' : filters.featured.toString()}
                      onChange={(e) => handleFilterChange('featured', e.target.value === '' ? undefined : e.target.value === 'true')}
                    >
                      <option value="">All Movies</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Non-Featured</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="col-md-2">
                    <select 
                      className="form-select filter-select"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="catalog__filter-actions">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="catalog__results-info">
                        <span className="results-count">
                          {totalMovies} {totalMovies === 1 ? 'movie' : 'movies'} found
                        </span>
                        {hasActiveFilters && (
                          <span className="active-filters-indicator">
                            <i className="ti ti-filter"></i>
                            Filters active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      {hasActiveFilters && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={clearFilters}
                        >
                          <i className="ti ti-x"></i>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div className="catalog__loading">
            <div className="loading-content">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading movies...</span>
              </div>
              <p className="mt-3">Loading movies...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="catalog__error">
            <div className="alert alert-danger" role="alert">
              <i className="ti ti-alert-triangle me-2"></i>
              {error}
              <button
                type="button"
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={() => fetchMovies(1, searchQuery, true)}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <div className="catalog__movies">
            <MovieGrid
              movies={movies}
              columns={6}
              variant="default"
              showLoadMore={hasMore}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
          </div>
        )}

        {/* No Results */}
        {!loading && !error && movies.length === 0 && (
          <div className="catalog__no-results">
            <div className="no-results-content">
              <i className="ti ti-movie-off"></i>
              <h3>No movies found</h3>
              <p>
                {searchQuery 
                  ? `No movies match your search for "${searchQuery}"`
                  : hasActiveFilters
                  ? 'No movies match your current filters. Try adjusting your search criteria.'
                  : 'No movies are available at the moment.'
                }
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Loading */}
        {loading && movies.length > 0 && (
          <div className="catalog__load-more-loading">
            <div className="text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading more movies...</span>
              </div>
              <span className="ms-2">Loading more movies...</span>
            </div>
          </div>
        )}
      </Section>

      <Footer />
    </>
  );
}
