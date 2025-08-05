import React from 'react';

export interface TextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  rows?: number;
  cols?: number;
}

export default function Textarea({
  id,
  name,
  placeholder,
  value,
  onChange,
  onKeyPress,
  onKeyDown,
  onFocus,
  onBlur,
  className = '',
  required = false,
  disabled = false,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  rows = 4,
  cols,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`sign__textarea ${className}`}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      readOnly={readOnly}
      rows={rows}
      cols={cols}
    />
  );
} 