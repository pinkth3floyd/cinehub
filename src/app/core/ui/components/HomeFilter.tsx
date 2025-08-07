'use client';

import React, { useState } from 'react';
import SearchFilter from './SearchFilter';

interface HomeFilterProps {
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
}

export default function HomeFilter({ filters = [] }: HomeFilterProps) {
  const handleSearch = (search: string) => {
    // Handle search - you can implement this later
    console.log('Search:', search);
  };

  const handleFilter = (filter: string, value: string) => {
    // Handle filter - you can implement this later
    console.log('Filter:', filter, value);
  };

  return (
    <section className="section section--filter">
      <div className="container">
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={filters}
          placeholder="Search movies..."
        />
      </div>
    </section>
  );
} 