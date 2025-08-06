'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(option.value)
  );

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className={`multi-select ${className}`} ref={dropdownRef}>
      <div className="multi-select__container">
        <div className="multi-select__selected">
          {selectedOptions.map(option => (
            <span key={option.value} className="multi-select__tag">
              {option.label}
              <button
                type="button"
                className="multi-select__remove"
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="multi-select__input"
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
          />
        </div>
        <button
          type="button"
          className="multi-select__toggle"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <i className="ti ti-chevron-down"></i>
        </button>
      </div>

      {isOpen && (
        <div className="multi-select__dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className="multi-select__option"
                onClick={() => handleToggle(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="multi-select__no-results">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 