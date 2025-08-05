'use client';

import React, { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  onSearch: (search: string) => void;
  onFilter?: (filter: string, value: string) => void;
  filters?: {
    name: string;
    label: string;
    options: FilterOption[];
  }[];
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  filters = [],
  placeholder = 'Search...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterName]: value
    }));
    
    if (onFilter) {
      onFilter(filterName, value);
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSearch} className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="ti ti-search"></i>
                  </button>
                </div>
              </div>
              
              {filters.map((filter) => (
                <div key={filter.name} className="col-md-3">
                  <select
                    className="form-control"
                    value={filterValues[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter; 