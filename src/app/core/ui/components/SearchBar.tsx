'use client';

import React, { useState } from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = ''
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setQuery('');
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <form className={`header__search ${isOpen ? 'header__search--active' : ''}`}>
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="header__search-input"
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="header__search-button"
        >
          <i className="ti ti-search"></i>
        </Button>
        <Button
          type="button"
          onClick={toggleSearch}
          className="header__search-close"
        >
          <i className="ti ti-x"></i>
        </Button>
      </form>

      <Button
        type="button"
        onClick={toggleSearch}
        className="header__search-btn"
      >
        <i className="ti ti-search"></i>
      </Button>
    </div>
  );
} 