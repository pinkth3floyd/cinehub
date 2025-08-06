'use client';

import React from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createTag } from '../../../core/entities/tags/actions';

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter tag name (e.g., Action)'
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter URL slug (e.g., action)'
  }
];

const AddTagPage = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createTag(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create tag' };
    }
  };

  return (
    <AdminLayout>
      <CrudForm
        title="Add New Tag"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/tags"
      />
    </AdminLayout>
  );
};

export default AddTagPage; 