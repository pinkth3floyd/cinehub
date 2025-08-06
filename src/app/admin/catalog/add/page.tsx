'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../../core/ui/components/AdminLayout';
import CrudForm from '../../../core/ui/components/CrudForm';
import { createMovie } from '../../../core/entities/movies/actions';
import { getAllTypes } from '../../../core/entities/type/actions';
import { getYears } from '../../../core/entities/year/actions';

// Static fields that don't depend on external data
const staticFields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter movie title'
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter URL slug (e.g., the-lost-city)'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    required: false,
    placeholder: 'Enter movie description'
  },
  {
    name: 'content',
    label: 'Content',
    type: 'textarea' as const,
    required: false,
    placeholder: 'Enter detailed content'
  },
  {
    name: 'poster',
    label: 'Poster URL',
    type: 'text' as const,
    required: false,
    placeholder: 'Enter poster image URL'
  },
  {
    name: 'banner',
    label: 'Banner URL',
    type: 'text' as const,
    required: false,
    placeholder: 'Enter banner image URL'
  },
  {
    name: 'trailer',
    label: 'Trailer URL',
    type: 'text' as const,
    required: false,
    placeholder: 'Enter trailer video URL'
  },
  {
    name: 'duration',
    label: 'Duration (minutes)',
    type: 'number' as const,
    required: false,
    placeholder: 'Enter duration in minutes'
  },
  {
    name: 'rating',
    label: 'Rating',
    type: 'number' as const,
    required: false,
    placeholder: 'Enter rating (0-10)',
    validation: (value: unknown) => {
      const numValue = Number(value);
      if (value && (numValue < 0 || numValue > 10)) {
        return 'Rating must be between 0 and 10';
      }
      return null;
    }
  },
  {
    name: 'releaseDate',
    label: 'Release Date',
    type: 'date' as const,
    required: false
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ]
  },
  {
    name: 'featured',
    label: 'Featured',
    type: 'checkbox' as const,
    required: false
  }
];

const AddMoviePage = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [typesResult, yearsResult] = await Promise.all([
          getAllTypes(),
          getYears()
        ]);

        if (typesResult.success && typesResult.data) {
          setTypes(typesResult.data);
        } else {
          console.error('Failed to load types:', typesResult.error);
        }

        if (yearsResult.success && yearsResult.data) {
          setYears(yearsResult.data);
        } else {
          console.error('Failed to load years:', yearsResult.error);
        }
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Memoize the dynamic fields that depend on types and years
  const dynamicFields = useMemo(() => [
    {
      name: 'typeId',
      label: 'Type',
      type: 'select' as const,
      required: true,
      options: Array.isArray(types) ? types.map(type => ({ value: type.id, label: type.name })) : []
    },
    {
      name: 'yearId',
      label: 'Year',
      type: 'select' as const,
      required: false,
      options: Array.isArray(years) ? years.map(year => ({ value: year.id, label: year.year.toString() })) : []
    }
  ], [types, years]);

  // Combine static and dynamic fields
  const fields = useMemo(() => [...staticFields, ...dynamicFields], [dynamicFields]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await createMovie(data);
      return result;
    } catch {
      return { success: false, error: 'Failed to create movie' };
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

  return (
    <AdminLayout>
      <CrudForm
        title="Add New Movie"
        fields={fields}
        onSubmit={handleSubmit}
        successRedirect="/admin/catalog"
      />
    </AdminLayout>
  );
};

export default AddMoviePage; 