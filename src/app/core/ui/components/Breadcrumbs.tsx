'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`}>
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.current ? (
              <span 
                className="breadcrumb-current"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link href={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb-text">{item.label}</span>
            )}
            
            {index < items.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                <i className="ti ti-chevron-right"></i>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
