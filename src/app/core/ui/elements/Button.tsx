'use client';

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  dataBsToggle?: string;
  dataBsTarget?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  dataBsToggle,
  dataBsTarget
}: ButtonProps) {
  const baseClass = 'btn';
  const variantClass = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    outline: 'btn--outline',
    ghost: 'btn--ghost'
  }[variant];
  
  const sizeClass = {
    sm: 'btn--sm',
    md: 'btn--md',
    lg: 'btn--lg'
  }[size];

  const buttonClass = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
    >
      {children}
    </button>
  );
} 