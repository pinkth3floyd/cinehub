'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getGenres, deleteGenre } from '../../core/entities/genre/actions';

interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

const GenresPage = () => {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadGenres = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getGenres({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setGenres(result.data.genres);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load genres:', result.error);
      }
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteGenre(id);
      if (result.success) {
        loadGenres(currentPage, searchTerm);
      } else {
        alert('Failed to delete genre: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting genre:', error);
      alert('Error deleting genre');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/genres/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/genres/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'description', 
      label: 'Description',
      render: (value: string) => (
        <div className="dashbox__table-text">
          {value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'}
        </div>
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

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Genres Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search genres by name..."
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Genres"
            icon="ti ti-category"
            data={genres}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/genres/add"
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

export default GenresPage; 