'use client';

import React from 'react';
import Link from 'next/link';

interface DashboxProps {
  title: string;
  icon: string;
  viewAllLink?: string;
  children: React.ReactNode;
}

const Dashbox: React.FC<DashboxProps> = ({ 
  title, 
  icon, 
  viewAllLink, 
  children 
}) => {
  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  return (
    <div className="dashbox">
      <div className="dashbox__title">
        <h3>
          <i className={icon}></i> {title}
        </h3>

        <div className="dashbox__wrap">
          <a className="dashbox__refresh" href="#" onClick={handleRefresh}>
            <i className="ti ti-refresh"></i>
          </a>
          {viewAllLink && (
            <Link className="dashbox__more" href={viewAllLink}>
              View All
            </Link>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

export default Dashbox; 