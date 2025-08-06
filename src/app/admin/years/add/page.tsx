'use client';

import React from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createYear } from '../../../core/entities/year/actions';

const fields = [
  {
    name: 'year',
    label: 'Year',
    type: 'number' as const,
    required: true,
    placeholder: 'Enter year (e.g., 2024)',
    validation: (value: unknown) => {
      const numValue = Number(value);
      const currentYear = new Date().getFullYear();
      if (numValue < 1900) {
        return 'Year must be at least 1900';
      }
      if (numValue > currentYear + 10) {
        return `Year cannot be more than ${currentYear + 10}`;
      }
      return null;
    }
  }
];

const AddYearPage = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createYear(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create year' };
    }
  };

  return (
    <AdminLayout>
      <CrudForm
        title="Add New Year"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/years"
      />
    </AdminLayout>
  );
};

export default AddYearPage; 