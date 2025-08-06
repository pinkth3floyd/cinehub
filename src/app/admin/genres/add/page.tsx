'use client';

import React from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createGenre } from '../../../core/entities/genre/actions';

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter genre name (e.g., Action)'
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter URL slug (e.g., action)'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    required: false,
    placeholder: 'Enter genre description'
  }
];

const AddGenrePage = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createGenre(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create genre' };
    }
  };

  return (
    <AdminLayout>
      <CrudForm
        title="Add New Genre"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/genres"
      />
    </AdminLayout>
  );
};

export default AddGenrePage; 