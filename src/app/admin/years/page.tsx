'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getYears, deleteYear } from '../../core/entities/year/actions';

interface Year {
  id: string;
  year: number;
  createdAt: Date;
}

const YearsPage = () => {
  const router = useRouter();
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadYears = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getYears({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setYears(result.data.years);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load years:', result.error);
      }
    } catch (error) {
      console.error('Error loading years:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteYear(id);
      if (result.success) {
        loadYears(currentPage, searchTerm);
      } else {
        alert('Failed to delete year: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting year:', error);
      alert('Error deleting year');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/years/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/years/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'year', 
      label: 'Year',
      render: (value: number) => (
        <div className="dashbox__table-text">
          {value}
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
            <h2>Years Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search years..."
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Years"
            icon="ti ti-calendar"
            data={years}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/years/add"
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

export default YearsPage; 