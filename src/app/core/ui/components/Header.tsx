'use client';

import { useState } from 'react';
import Link from 'next/link';

const navigationItems = [
  {
    label: 'Home',
    href: '/'
  },
  // {
  //   label: 'Movies',
  //   href: '/allmovies'
  // },
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Contact',
    href: '/contact'
  },
  {
    label: 'FAQ',
    href: '/faq'
  },
  {
    label: 'Privacy Policy',
    href: '/privacy'
  }
];

const languageItems = [
  { label: 'English', href: '#' },
  { label: 'Spanish', href: '#' },
  { label: 'French', href: '#' }
];

const userMenuItems = [
  { label: 'Profile', href: '/profile', icon: 'ti ti-ghost' },
  { label: 'Subscription', href: '/profile', icon: 'ti ti-stereo-glasses' },
  { label: 'Favorites', href: '/profile', icon: 'ti ti-bookmark' },
  { label: 'Settings', href: '/profile', icon: 'ti ti-settings' },
  { label: 'Logout', href: '#', icon: 'ti ti-logout' }
];

export default function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              {/* Header Logo */}
              <Link href="/" className="header__logo">
                {/* <img src="/core/assets/img/logo.svg" alt="CineHUB" /> */}
                <h2>CineHUB</h2>
              </Link>

              {/* Header Navigation */}
              <ul className="header__nav">
                {navigationItems.map((item, index) => (
                  <li key={index} className="header__nav-item">
                    <Link href={item.href || '#'} className="header__nav-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Header Auth */}
              <div className="header__auth">
                {/* Search Form */}
                <form action="#" className="header__search">
                  <input 
                    className="header__search-input" 
                    type="text" 
                    placeholder="Search..."
                  />
                  <button className="header__search-button" type="button">
                    <i className="ti ti-search"></i>
                  </button>
                  <button className="header__search-close" type="button">
                    <i className="ti ti-x"></i>
                  </button>
                </form>

                {/* Search Toggle Button */}
                <button 
                  className="header__search-btn" 
                  type="button"
                  onClick={() => setIsSearchVisible(!isSearchVisible)}
                >
                  <i className="ti ti-search"></i>
                </button>

                {/* Language Dropdown */}
                <div className="header__lang">
                  <a 
                    className="header__nav-link" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    EN <i className="ti ti-chevron-down"></i>
                  </a>

                  <ul className="dropdown-menu header__dropdown-menu">
                    {languageItems.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* User Profile Dropdown */}
                {/* <div className="header__profile">
                  <a 
                    className="header__sign-in header__sign-in--user" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="ti ti-user"></i>
                    <span>Nickname</span>
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                    {userMenuItems.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href}>
                          <i className={item.icon}></i>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>

              {/* Mobile Menu Button */}
              <button className="header__btn" type="button">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}