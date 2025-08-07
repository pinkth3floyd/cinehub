'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../core/ui/components/AdminLayout';
import MovieForm from '../../../../core/ui/components/MovieForm';
import { getMovieById, updateMovie } from '../../../../core/entities/movies/actions';
import { getAllTypes } from '../../../../core/entities/type/actions';
import { getAllYears } from '../../../../core/entities/year/actions';
import { getAllGenres } from '../../../../core/entities/genre/actions';
import { getAllTags } from '../../../../core/entities/tags/actions';

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

const EditMoviePage = () => {
  const params = useParams();
  const movieId = params.id as string;
  const [movie, setMovie] = useState<any>(null);
  const [types, setTypes] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (movieId) {
        try {
          const [movieResult, typesResult, yearsResult, genresResult, tagsResult] = await Promise.all([
            getMovieById(movieId),
            getAllTypes(),
            getAllYears(),
            getAllGenres(),
            getAllTags()
          ]);

          if (movieResult.success && movieResult.data) {
            setMovie(movieResult.data);
          } else {
            console.error('Failed to load movie:', movieResult.error);
          }

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

          if (genresResult.success && genresResult.data) {
            setGenres(genresResult.data);
          } else {
            console.error('Failed to load genres:', genresResult.error);
          }

          if (tagsResult.success && tagsResult.data) {
            setTags(tagsResult.data);
          } else {
            console.error('Failed to load tags:', tagsResult.error);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [movieId]);

  // Memoize the dynamic fields that depend on external data
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
    },
    {
      name: 'genreId',
      label: 'Genre',
      type: 'select' as const,
      required: false,
      options: Array.isArray(genres) ? genres.map(genre => ({ value: genre.id, label: genre.name })) : []
    },
    {
      name: 'tagIds',
      label: 'Tags',
      type: 'multiselect' as const,
      required: false,
      placeholder: 'Select tags...',
      options: Array.isArray(tags) ? tags.map(tag => ({ value: tag.id, label: tag.name })) : []
    }
  ], [types, years, genres, tags]);

  // Combine static and dynamic fields
  const fields = useMemo(() => [...staticFields, ...dynamicFields], [dynamicFields]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateMovie(movieId, data);
      return result;
    } catch {
      return { success: false, error: 'Failed to update movie' };
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

  if (!movie) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Movie not found
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <MovieForm
        title="Edit Movie"
        fields={fields}
        initialData={movie}
        onSubmit={handleSubmit}
        successRedirect="/admin/catalog"
      />
    </AdminLayout>
  );
};

export default EditMoviePage; 