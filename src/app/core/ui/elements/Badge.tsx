'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}: BadgeProps) {
  const baseClass = 'badge';
  const variantClass = {
    primary: 'badge--primary',
    secondary: 'badge--secondary',
    success: 'badge--success',
    warning: 'badge--warning',
    danger: 'badge--danger',
    info: 'badge--info'
  }[variant];
  
  const sizeClass = {
    sm: 'badge--sm',
    md: 'badge--md',
    lg: 'badge--lg'
  }[size];

  const badgeClass = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
} 