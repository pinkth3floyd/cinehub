'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminSidebarProps {
  isOpen?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar--active' : ''}`}>
      {/* sidebar logo */}
      <Link href="/" className="sidebar__logo">
        <Image src="/core/assets/img/logo.svg" alt="CineHub" width={120} height={40} />
      </Link>
      {/* end sidebar logo */}
      
      {/* sidebar user */}
      <div className="sidebar__user">
        <div className="sidebar__user-img">
          <Image src="/core/assets/img/user.svg" alt="Admin" width={40} height={40} />
        </div>

        <div className="sidebar__user-title">
          <span>Admin</span>
          <p>John Doe</p>
        </div>

        <button className="sidebar__user-btn" type="button">
          <i className="ti ti-logout"></i>
        </button>
      </div>
      {/* end sidebar user */}

      {/* sidebar nav */}
      <div className="sidebar__nav-wrap">
        <ul className="sidebar__nav">
          <li className="sidebar__nav-item">
            <Link href="/admin" className="sidebar__nav-link sidebar__nav-link--active">
              <i className="ti ti-layout-grid"></i> <span>Dashboard</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/catalog" className="sidebar__nav-link">
              <i className="ti ti-movie"></i> <span>Movies</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/users" className="sidebar__nav-link">
              <i className="ti ti-users"></i> <span>Users</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/reviews" className="sidebar__nav-link">
              <i className="ti ti-message"></i> <span>Reviews</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/genres" className="sidebar__nav-link">
              <i className="ti ti-category"></i> <span>Genres</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/types" className="sidebar__nav-link">
              <i className="ti ti-layout"></i> <span>Types</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/tags" className="sidebar__nav-link">
              <i className="ti ti-tag"></i> <span>Tags</span>
            </Link>
          </li>

          <li className="sidebar__nav-item">
            <Link href="/admin/settings" className="sidebar__nav-link">
              <i className="ti ti-settings"></i> <span>Settings</span>
            </Link>
          </li>

          {/* dropdown */}
          <li className="sidebar__nav-item">
            <a 
              className="sidebar__nav-link" 
              href="#" 
              role="button" 
              onClick={handleDropdownToggle}
              aria-expanded={dropdownOpen}
            >
              <i className="ti ti-files"></i> <span>Pages</span> <i className="ti ti-chevron-down"></i>
            </a>

            <ul className={`dropdown-menu sidebar__dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <li><Link href="/admin/add-item">Add item</Link></li>
              <li><Link href="/admin/edit-user">Edit user</Link></li>
              <li><Link href="/admin/signin">Sign In</Link></li>
              <li><Link href="/admin/signup">Sign Up</Link></li>
              <li><Link href="/admin/forgot">Forgot password</Link></li>
              <li><Link href="/admin/404">404 Page</Link></li>
            </ul>
          </li>
          {/* end dropdown */}

          <li className="sidebar__nav-item">
            <Link href="/" className="sidebar__nav-link">
              <i className="ti ti-arrow-left"></i> <span>Back to CineHub</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* end sidebar nav */}
      
      {/* sidebar copyright */}
      <div className="sidebar__copyright">
        © CINEHUB, 2019—2024. <br />
        Create by <a href="https://prakashniraula.info" target="_blank" rel="noopener noreferrer">CineHUB</a>
      </div>
      {/* end sidebar copyright */}
    </div>
  );
};

export default AdminSidebar; 