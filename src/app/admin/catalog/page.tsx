'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getMovies, deleteMovie } from '../../core/entities/movies/actions';

interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  poster: string | null;
  rating: number | null;
  status: string;
  featured: boolean;
  typeId: string;
  yearId: string | null;
  createdAt: Date;
}

const CatalogPage = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadMovies = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getMovies({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setMovies(result.data.movies);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load movies:', result.error);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMovie(id);
      if (result.success) {
        // Reload movies after deletion
        loadMovies(currentPage, searchTerm);
      } else {
        alert('Failed to delete movie: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error deleting movie');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/catalog/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/catalog/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'rating', label: 'Rating' },
    { key: 'status', label: 'Status' },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: boolean) => (
        <span className={`badge ${value ? 'badge-success' : 'badge-secondary'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value: Date) => (
        <div className="dashbox__table-text">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      name: 'featured',
      label: 'Featured',
      options: [
        { value: 'true', label: 'Featured' },
        { value: 'false', label: 'Not Featured' }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Catalog Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search movies by title..."
        filters={filterOptions}
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Movies"
            icon="ti ti-movie"
            data={movies}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/catalog/add"
            isLoading={loading}
            pagination={{
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.totalPages,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CatalogPage; 