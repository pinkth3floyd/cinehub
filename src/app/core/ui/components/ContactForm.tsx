'use client';

import React, { useState } from 'react';
import { Input, Textarea, Button } from '../elements';

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleInputChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`sign__form sign__form--full ${className}`}>
      <div className="row">
        <div className="col-12 col-xl-6">
          <div className="sign__group">
            <label className="sign__label" htmlFor="name">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
            />
            {errors.name && <span className="sign__text--small" style={{ color: '#ff6b6b' }}>{errors.name}</span>}
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="sign__group">
            <label className="sign__label" htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />
            {errors.email && <span className="sign__text--small" style={{ color: '#ff6b6b' }}>{errors.email}</span>}
          </div>
        </div>

        <div className="col-12">
          <div className="sign__group">
            <label className="sign__label" htmlFor="subject">Subject</label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Partnership"
              value={formData.subject}
              onChange={handleInputChange('subject')}
              required
            />
            {errors.subject && <span className="sign__text--small" style={{ color: '#ff6b6b' }}>{errors.subject}</span>}
          </div>
        </div>

        <div className="col-12">
          <div className="sign__group">
            <label className="sign__label" htmlFor="message">Message</label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message..."
              value={formData.message}
              onChange={handleInputChange('message')}
              required
              rows={6}
            />
            {errors.message && <span className="sign__text--small" style={{ color: '#ff6b6b' }}>{errors.message}</span>}
          </div>
        </div>

        <div className="col-12">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="sign__btn sign__btn--small"
          >
            Send
          </Button>
        </div>
      </div>
    </form>
  );
} 