'use client';

import React from 'react';

export interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
}

export default function Dropdown({
  trigger,
  items,
  align = 'left',
  className = '',
  menuClassName = ''
}: DropdownProps) {
  const dropdownClass = `dropdown ${className}`.trim();
  const menuClass = `dropdown-menu header__dropdown-menu ${align === 'right' ? 'dropdown-menu-end' : ''} ${menuClassName}`.trim();

  return (
    <div className={dropdownClass}>
      {trigger}
      <ul className={menuClass}>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <a 
                href={item.href} 
                className={item.disabled ? 'disabled' : ''}
                onClick={item.onClick}
              >
                {item.icon && <i className={item.icon}></i>}
                {item.label}
              </a>
            ) : (
              <button
                type="button"
                className={item.disabled ? 'disabled' : ''}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon && <i className={item.icon}></i>}
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 