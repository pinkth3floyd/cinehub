'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MultiSelect from './MultiSelect';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'multiselect';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: (value: unknown) => string | null;
}

interface Server {
  name: string;
  url: string;
  quality?: string;
  language?: string;
  videoType: 'mp4' | 'iframe' | 'youtube';
}

interface MovieFormProps {
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  isLoading?: boolean;
  successRedirect?: string;
}

const MovieForm: React.FC<MovieFormProps> = ({
  title,
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  successRedirect
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);

  // Memoize the initial data to prevent unnecessary re-renders
  const memoizedInitialData = useMemo(() => initialData, [JSON.stringify(initialData)]);

  useEffect(() => {
    if (memoizedInitialData && typeof memoizedInitialData === 'object') {
      setFormData(memoizedInitialData);
      
      // Initialize servers from initial data
      if (memoizedInitialData.servers && Array.isArray(memoizedInitialData.servers)) {
        setServers(memoizedInitialData.servers.map((server: any) => ({
          ...server,
          videoType: server.videoType || 'mp4'
        })));
      }
    }
  }, [memoizedInitialData]);

  const handleInputChange = (name: string, value: unknown, fieldType?: string) => {
    // Convert string to number for number fields
    let processedValue = value;
    if (fieldType === 'number' && typeof value === 'string') {
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (fields && Array.isArray(fields)) {
      fields.forEach((field) => {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to ensure proper types
      const transformedData = { ...formData };
      fields.forEach(field => {
        if (field.type === 'number' && transformedData[field.name] !== undefined) {
          const value = transformedData[field.name];
          if (typeof value === 'string' && value !== '') {
            transformedData[field.name] = Number(value);
          } else if (value === '') {
            transformedData[field.name] = undefined;
          }
        }
        
        if (field.type === 'date' && transformedData[field.name] !== undefined) {
          const value = transformedData[field.name];
          if (typeof value === 'string' && value !== '') {
            transformedData[field.name] = new Date(value);
          } else if (value === '') {
            transformedData[field.name] = undefined;
          }
        }
      });

      // Filter out empty servers before submission
      const filteredServers = servers.filter(server => 
        server.name.trim() !== '' && server.url.trim() !== ''
      );

      // Add servers to the form data
      transformedData.servers = filteredServers;

      const result = await onSubmit(transformedData);
      
      if (result && result.success) {
        if (successRedirect) {
          router.push(successRedirect);
        } else {
          router.back();
        }
      } else {
        setErrors({ submit: result?.error || 'An error occurred' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'An error occurred while saving' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addServer = () => {
    setServers([...servers, { name: '', url: '', quality: '', language: '', videoType: 'mp4' }]);
  };

  const removeServer = (index: number) => {
    setServers(servers.filter((_, i) => i !== index));
  };

  const updateServer = (index: number, field: keyof Server, value: string) => {
    const newServers = [...servers];
    newServers[index] = { ...newServers[index], [field]: value };
    setServers(newServers);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={`sign__input ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            className={`sign__select ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options && Array.isArray(field.options) && field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="sign__group sign__group--checkbox">
            <input
              className="sign__input"
              type="checkbox"
              name={field.name}
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              id={field.name}
            />
            <label className="sign__label" htmlFor={field.name}>
              {field.label}
            </label>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className={`sign__input ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={`sign__input ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value, 'number')}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'multiselect':
        return (
          <MultiSelect
            options={field.options || []}
            value={Array.isArray(value) ? value : []}
            onChange={(newValue) => handleInputChange(field.name, newValue)}
            placeholder={field.placeholder}
            className={error ? 'is-invalid' : ''}
          />
        );

      default:
        return (
          <input
            type={field.type}
            className={`sign__input ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  // Ensure fields is an array
  if (!fields || !Array.isArray(fields)) {
    return (
      <div className="alert alert-danger" role="alert">
        Invalid form configuration
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>{title}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="dashbox">
            <div className="dashbox__wrap">
              <form onSubmit={handleSubmit} className="sign__form sign__form--full">
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <div className="row">
                  {fields.map((field) => (
                    <div key={field.name} className="col-12 mb-3">
                      <label htmlFor={field.name} className="sign__label">
                        {field.label}
                        {field.required && <span className="text-danger">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.name] && (
                        <div className="invalid-feedback d-block">
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Servers Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4>Movie Servers</h4>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={addServer}
                      >
                        <i className="ti ti-plus me-1"></i>
                        Add Server
                      </button>
                    </div>
                    
                    {servers.length === 0 && (
                      <div className="alert alert-info" role="alert">
                        <i className="ti ti-info-circle me-2"></i>
                        No servers added yet. Click "Add Server" to add streaming servers for this movie.
                      </div>
                    )}
                    
                    {servers.map((server, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-2">
                              <label className="sign__label">
                                Server Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="sign__input"
                                value={server.name}
                                onChange={(e) => updateServer(index, 'name', e.target.value)}
                                placeholder="e.g., Server 1"
                                required
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="sign__label">
                                URL <span className="text-danger">*</span>
                              </label>
                              <input
                                type="url"
                                className="sign__input"
                                value={server.url}
                                onChange={(e) => updateServer(index, 'url', e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                required
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="sign__label">
                                Video Type <span className="text-danger">*</span>
                              </label>
                              <select
                                className="sign__select"
                                value={server.videoType}
                                onChange={(e) => updateServer(index, 'videoType', e.target.value as 'mp4' | 'iframe' | 'youtube')}
                                required
                              >
                                <option value="mp4">MP4 Direct</option>
                                <option value="iframe">iFrame Embed</option>
                                <option value="youtube">YouTube</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="sign__label">
                                Quality
                              </label>
                              <input
                                type="text"
                                className="sign__input"
                                value={server.quality || ''}
                                onChange={(e) => updateServer(index, 'quality', e.target.value)}
                                placeholder="HD, 4K, etc."
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="sign__label">
                                Language
                              </label>
                              <input
                                type="text"
                                className="sign__input"
                                value={server.language || ''}
                                onChange={(e) => updateServer(index, 'language', e.target.value)}
                                placeholder="EN, ES, etc."
                              />
                            </div>
                            <div className="col-md-1 d-flex align-items-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeServer(index)}
                                title="Remove Server"
                              >
                                <i className="ti ti-trash"></i>
                              </button>
                            </div>
                          </div>
                          
                          {/* Video Type Help Text */}
                          <div className="row mt-2">
                            <div className="col-12">
                              <div className="video-type-guide">
                                <small className="text-muted">
                                  <strong>Video Type Guide:</strong>
                                  <ul className="mt-1 mb-0">
                                    <li><strong>MP4 Direct:</strong> Direct video file URL (ends with .mp4, .webm, etc.)</li>
                                    <li><strong>iFrame Embed:</strong> Embed code from video hosting sites</li>
                                    <li><strong>YouTube:</strong> YouTube video ID or full URL</li>
                                  </ul>
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="sign__btn sign__btn--primary"
                        disabled={isSubmitting || isLoading}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Movie'
                        )}
                      </button>
                      <button
                        type="button"
                        className="sign__btn sign__btn--secondary"
                        onClick={onCancel || (() => router.back())}
                        disabled={isSubmitting || isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieForm; 