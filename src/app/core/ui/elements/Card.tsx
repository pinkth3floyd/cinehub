'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick
}: CardProps) {
  const baseClass = 'card';
  const variantClass = {
    default: 'card--default',
    elevated: 'card--elevated',
    outlined: 'card--outlined'
  }[variant];

  const cardClass = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
} 