'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import CrudForm from '../../../../core/ui/components/CrudForm';
import { getTagById, updateTag } from '../../../../core/entities/tags/actions';

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

const EditTagPage = () => {
  const params = useParams();
  const tagId = params.id as string;
  const [tag, setTag] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTag = async () => {
      if (tagId) {
        try {
          const result = await getTagById(tagId);
          if (result.success && result.data) {
            setTag(result.data);
          } else {
            console.error('Failed to load tag:', result.error);
          }
        } catch (error) {
          console.error('Error loading tag:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTag();
  }, [tagId]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateTag(tagId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update tag' };
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

  if (!tag) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Tag not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudForm
        title="Edit Tag"
        fields={fields}
        initialData={tag}
        onSubmit={handleSubmit}
        successRedirect="/admin/tags"
      />
    </AdminLayout>
  );
};

export default EditTagPage; 