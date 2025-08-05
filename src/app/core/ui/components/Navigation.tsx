'use client';

import React from 'react';
import Link from 'next/link';
import Dropdown from '../elements/Dropdown';

export interface NavigationItem {
  label: string;
  href?: string;
  items?: NavigationItem[];
  icon?: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: 'header' | 'footer' | 'sidebar';
}

export default function Navigation({
  items,
  className = '',
  variant = 'header'
}: NavigationProps) {
  const navClass = `nav nav--${variant} ${className}`.trim();

  const renderNavigationItem = (item: NavigationItem, index: number) => {
    if (item.items && item.items.length > 0) {
      const dropdownItems = item.items.map(subItem => ({
        label: subItem.label,
        href: subItem.href,
        icon: subItem.icon
      }));

      return (
        <li key={index} className="nav-item">
          <Dropdown
            trigger={
              <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {item.label} <i className="ti ti-chevron-down"></i>
              </a>
            }
            items={dropdownItems}
            className="nav-dropdown"
          />
        </li>
      );
    }

    return (
      <li key={index} className="nav-item">
        {item.href ? (
          <Link href={item.href} className="nav-link">
            {item.icon && <i className={item.icon}></i>}
            {item.label}
          </Link>
        ) : (
          <a href="#" className="nav-link">
            {item.icon && <i className={item.icon}></i>}
            {item.label}
          </a>
        )}
      </li>
    );
  };

  return (
    <ul className={navClass}>
      {items.map((item, index) => renderNavigationItem(item, index))}
    </ul>
  );
} 