'use client';

import React from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createType } from '../../../core/entities/type/actions';

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter type name (e.g., Movie)'
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter URL slug (e.g., movie)'
  }
];

const AddTypePage = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createType(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create type' };
    }
  };

  return (
    <AdminLayout>
      <CrudForm
        title="Add New Type"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/types"
      />
    </AdminLayout>
  );
};

export default AddTypePage; 