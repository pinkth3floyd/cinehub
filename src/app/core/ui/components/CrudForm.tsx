'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: (value: unknown) => string | null;
}

interface CrudFormProps {
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CrudForm: React.FC<CrudFormProps> = ({
  title,
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (name: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [name]: value
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

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

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
      const result = await onSubmit(formData);
      
      if (result.success) {
        router.back();
      } else {
        setErrors({ submit: result.error || 'An error occurred' });
      }
    } catch {
      setErrors({ submit: 'An error occurred while saving' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={`form-control ${error ? 'is-invalid' : ''}`}
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
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name={field.name}
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              id={field.name}
            />
            <label className="form-check-label" htmlFor={field.name}>
              {field.label}
            </label>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      default:
        return (
          <input
            type={field.type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={field.name}
            value={String(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

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
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <div className="row">
                  {fields.map((field) => (
                    <div key={field.name} className="col-md-6 mb-3">
                      <label htmlFor={field.name} className="form-label">
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

                <div className="row mt-3">
                  <div className="col-12">
                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || isLoading}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
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

export default CrudForm; 