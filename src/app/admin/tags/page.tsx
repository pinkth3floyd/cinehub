'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getTags, deleteTag } from '../../core/entities/tags/actions';

interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

const TagsPage = () => {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadTags = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getTags({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setTags(result.data.tags);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load tags:', result.error);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTag(id);
      if (result.success) {
        loadTags(currentPage, searchTerm);
      } else {
        alert('Failed to delete tag: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Error deleting tag');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/tags/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/tags/view/${id}`);
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
            <h2>Tags Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search tags by name..."
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Tags"
            icon="ti ti-tag"
            data={tags}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/tags/add"
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

export default TagsPage; 