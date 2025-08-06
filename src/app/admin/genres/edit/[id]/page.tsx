'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import CrudForm from '../../../../core/ui/components/CrudForm';
import { getGenreById, updateGenre } from '../../../../core/entities/genre/actions';

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

const EditGenrePage = () => {
  const params = useParams();
  const genreId = params.id as string;
  const [genre, setGenre] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenre = async () => {
      if (genreId) {
        try {
          const result = await getGenreById(genreId);
          if (result.success && result.data) {
            setGenre(result.data);
          } else {
            console.error('Failed to load genre:', result.error);
          }
        } catch (error) {
          console.error('Error loading genre:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadGenre();
  }, [genreId]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateGenre(genreId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update genre' };
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

  if (!genre) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Genre not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CrudForm
        title="Edit Genre"
        fields={fields}
        initialData={genre}
        onSubmit={handleSubmit}
        successRedirect="/admin/genres"
      />
    </AdminLayout>
  );
};

export default EditGenrePage; 