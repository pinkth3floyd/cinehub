'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import CrudForm from '../../../../core/ui/components/CrudForm';
import { getTypeById, updateType } from '../../../../core/entities/type/actions';

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

const EditTypePage = () => {
  const params = useParams();
  const typeId = params.id as string;
  const [type, setType] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadType = async () => {
      if (typeId) {
        try {
          const result = await getTypeById(typeId);
          if (result.success && result.data) {
            setType(result.data);
          } else {
            console.error('Failed to load type:', result.error);
          }
        } catch (error) {
          console.error('Error loading type:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadType();
  }, [typeId]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateType(typeId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update type' };
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

  if (!type) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Type not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudForm
        title="Edit Type"
        fields={fields}
        initialData={type}
        onSubmit={handleSubmit}
        successRedirect="/admin/types"
      />
    </AdminLayout>
  );
};

export default EditTypePage; 