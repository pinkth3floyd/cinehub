'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import CrudForm from '../../../../core/ui/components/CrudForm';
import { getYearById, updateYear } from '../../../../core/entities/year/actions';

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

const EditYearPage = () => {
  const params = useParams();
  const yearId = params.id as string;
  const [year, setYear] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYear = async () => {
      if (yearId) {
        try {
          const result = await getYearById(yearId);
          if (result.success && result.data) {
            setYear(result.data);
          } else {
            console.error('Failed to load year:', result.error);
          }
        } catch (error) {
          console.error('Error loading year:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadYear();
  }, [yearId]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateYear(yearId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update year' };
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

  if (!year) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Year not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudForm
        title="Edit Year"
        fields={fields}
        initialData={year}
        onSubmit={handleSubmit}
        successRedirect="/admin/years"
      />
    </AdminLayout>
  );
};

export default EditYearPage; 