'use client';

import React from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'search' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitText?: string;
  className?: string;
  variant?: 'default' | 'modal' | 'search';
}

export default function Form({
  fields,
  onSubmit,
  submitText = 'Submit',
  className = '',
  variant = 'default'
}: FormProps) {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const fieldClass = `sign__group ${fieldError ? 'sign__group--error' : ''}`;

    return (
      <div key={field.name} className={fieldClass}>
        <label htmlFor={field.name} className="sign__label">
          {field.label}
        </label>
        
        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            className="sign__select"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.name}
            name={field.name}
            className="sign__input"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            rows={4}
          />
        ) : (
          <Input
            type={field.type}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )}
        
        {fieldError && (
          <span className="sign__error">{fieldError}</span>
        )}
      </div>
    );
  };

  const formClass = `form form--${variant} ${className}`.trim();

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      {fields.map(renderField)}
      
      <Button
        type="submit"
        variant="primary"
        className="sign__btn"
      >
        {submitText}
      </Button>
    </form>
  );
} 