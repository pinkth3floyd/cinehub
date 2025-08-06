'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getTypes, deleteType } from '../../core/entities/type/actions';

interface Type {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

const TypesPage = () => {
  const router = useRouter();
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadTypes = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getTypes({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setTypes(result.data.types);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load types:', result.error);
      }
    } catch (error) {
      console.error('Error loading types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteType(id);
      if (result.success) {
        loadTypes(currentPage, searchTerm);
      } else {
        alert('Failed to delete type: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting type:', error);
      alert('Error deleting type');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/types/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/types/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
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
            <h2>Types Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search types by name..."
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Types"
            icon="ti ti-layout"
            data={types}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/types/add"
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

export default TypesPage; 