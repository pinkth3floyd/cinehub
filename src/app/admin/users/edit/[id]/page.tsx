'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import CrudForm from '../../../../core/ui/components/CrudForm';
import { getUserById, updateUser } from '../../../../core/entities/user/actions';

const fields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    required: true,
    placeholder: 'Enter email address',
    validation: (value: unknown) => {
      const strValue = String(value);
      if (!strValue.includes('@')) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter username'
  },
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter full name'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    required: false,
    placeholder: 'Leave blank to keep current password',
    validation: (value: unknown) => {
      const strValue = String(value);
      if (strValue && strValue.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    }
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'banned', label: 'Banned' }
    ]
  },
  {
    name: 'avatar',
    label: 'Avatar URL',
    type: 'text' as const,
    required: false,
    placeholder: 'Enter avatar URL (optional)'
  }
];

const EditUserPage = () => {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (userId) {
        try {
          const result = await getUserById(userId);
          if (result.success && result.data) {
            setUser(result.data);
          } else {
            console.error('Failed to load user:', result.error);
          }
        } catch (error) {
          console.error('Error loading user:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUser();
  }, [userId]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateUser(userId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update user' };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              User not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudForm
        title="Edit User"
        fields={fields}
        initialData={user}
        onSubmit={handleSubmit}
        successRedirect="/admin/users"
      />
    </AdminLayout>
  );
};

export default EditUserPage; 