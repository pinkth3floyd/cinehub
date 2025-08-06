'use client';

import React from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createUser } from '../../../core/entities/user/actions';

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
    required: true,
    placeholder: 'Enter password',
    validation: (value: unknown) => {
      const strValue = String(value);
      if (strValue.length < 6) {
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

const AddUserPage = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createUser(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create user' };
    }
  };

  return (
    <AdminLayout>
      <CrudForm
        title="Add New User"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/users"
      />
    </AdminLayout>
  );
};

export default AddUserPage; 