'use client';

import React, { useState } from 'react';
import SearchFilter from './SearchFilter';

interface HomeFilterProps {
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  variant?: 'default' | 'sidebar';
}

export default function HomeFilter({ filters = [], variant = 'default' }: HomeFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleSearch = (search: string) => {
    // Handle search - you can implement this later
    console.log('Search:', search);
  };

  const handleFilter = (filter: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: value
    }));
    // Handle filter - you can implement this later
    console.log('Filter:', filter, value);
  };

  const handleFilterSubmit = () => {
    // Handle filter submission
    console.log('Applied filters:', selectedFilters);
  };

  if (variant === 'sidebar') {
    // Group filters into rows of 2
    const filterRows = [];
    for (let i = 0; i < filters.length; i += 2) {
      filterRows.push(filters.slice(i, i + 2));
    }

    return (
      <div className="sidebar-filter">
        {filterRows.map((row, rowIndex) => (
          <div key={rowIndex} className="filter-row">
            {row.map((filter) => (
              <div key={filter.name} className="filter-group">
                <label className="filter-label">{filter.label}</label>
                <select
                  className="filter-select"
                  value={selectedFilters[filter.name] || ''}
                  onChange={(e) => handleFilter(filter.name, e.target.value)}
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
        
        <div className="filter-actions">
          <button 
            className="filter-btn"
            onClick={handleFilterSubmit}
          >
            <i className="ti ti-filter"></i>
            Filter
          </button>
        </div>
      </div>
    );
  }

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