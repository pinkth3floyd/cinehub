'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getSystemSettings, deleteSystemSetting } from '../../core/entities/systemsettings/actions';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: Date;
}

const SettingsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadSettings = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getSystemSettings({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setSettings(result.data.settings);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load settings:', result.error);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteSystemSetting(id);
      if (result.success) {
        loadSettings(currentPage, searchTerm);
      } else {
        alert('Failed to delete setting: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Error deleting setting');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/settings/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/settings/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'key', label: 'Key' },
    { 
      key: 'value', 
      label: 'Value',
      render: (value: string) => (
        <div className="dashbox__table-text">
          {value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'}
        </div>
      )
    },
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
            <h2>System Settings Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search settings by key or description..."
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All System Settings"
            icon="ti ti-settings"
            data={settings}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/settings/add"
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

export default SettingsPage; 