'use client';

import React from 'react';

const filterOptions = [
  {
    name: 'genre',
    label: 'All genres',
    options: [
      { value: 'all', label: 'All genres' },
      { value: 'action', label: 'Action' },
      { value: 'comedy', label: 'Comedy' },
      { value: 'drama', label: 'Drama' },
      { value: 'horror', label: 'Horror' },
      { value: 'romance', label: 'Romance' },
      { value: 'thriller', label: 'Thriller' },
      { value: 'sci-fi', label: 'Sci-Fi' },
      { value: 'animation', label: 'Animation' }
    ]
  },
  {
    name: 'quality',
    label: 'Any quality',
    options: [
      { value: 'all', label: 'Any quality' },
      { value: 'hd', label: 'HD' },
      { value: '4k', label: '4K' },
      { value: 'uhd', label: 'UHD' }
    ]
  },
  {
    name: 'rating',
    label: 'Any rating',
    options: [
      { value: 'all', label: 'Any rating' },
      { value: '9+', label: '9.0+' },
      { value: '8+', label: '8.0+' },
      { value: '7+', label: '7.0+' },
      { value: '6+', label: '6.0+' }
    ]
  },
  {
    name: 'sort',
    label: 'Relevance',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'latest', label: 'Latest' },
      { value: 'rating', label: 'Rating' },
      { value: 'popularity', label: 'Popularity' },
      { value: 'title', label: 'Title' }
    ]
  }
];

export default function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter-bar__content">
              <div className="filter-bar__filters">
                {filterOptions.map((filter, index) => (
                  <div key={index} className="filter-bar__item">
                    <select 
                      className="filter-bar__select" 
                      name={filter.name}
                      defaultValue={filter.options[0].value}
                    >
                      {filter.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              
              <div className="filter-bar__actions">
                <button className="filter-bar__btn" type="button">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 