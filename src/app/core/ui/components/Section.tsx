'use client';

import React from 'react';
import Link from 'next/link';

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
  variant?: 'default' | 'border' | 'no-padding';
  className?: string;
}

export default function Section({
  children,
  title,
  subtitle,
  showViewAll = false,
  viewAllHref,
  viewAllText = 'View All',
  variant = 'default',
  className = ''
}: SectionProps) {
  const sectionClass = `section ${variant === 'border' ? 'section--border' : ''} ${className}`.trim();

  return (
    <section className={sectionClass}>
      <div className="container">
        {(title || showViewAll) && (
          <div className="row">
            <div className="col-12">
              <div className="section__title-wrap">
                {title && (
                  <h2 className="section__title">
                    {title}
                    {subtitle && <span className="section__subtitle">{subtitle}</span>}
                  </h2>
                )}
                {showViewAll && viewAllHref && (
                  <Link href={viewAllHref} className="section__view">
                    {viewAllText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="row">
          <div className="col-12">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
} 