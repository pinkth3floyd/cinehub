'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';
import Navigation from './Navigation';

const navigationItems = [
  {
    label: 'Home',
    items: [
      { label: 'Home style 1', href: '/' },
      { label: 'Home style 2', href: '/' },
      { label: 'Home style 3', href: '/' }
    ]
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Catalog style 1', href: '/catalog' },
      { label: 'Catalog style 2', href: '/catalog' },
      { label: 'Details Movie', href: '/details' },
      { label: 'Details TV Series', href: '/details' }
    ]
  },
  {
    label: 'Pricing plan',
    href: '/pricing'
  },
  {
    label: 'Pages',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Profile', href: '/profile' },
      { label: 'Actor', href: '/actor' },
      { label: 'Contacts', href: '/contact' },
      { label: 'Help center', href: '/faq' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Admin pages', href: '/admin', icon: 'ti ti-external-link' }
    ]
  },
  {
    label: '',
    icon: 'ti ti-dots',
    items: [
      { label: 'Sign in', href: '/login' },
      { label: 'Sign up', href: '/signup' },
      { label: 'Forgot password', href: '/forgot' },
      { label: '404 Page', href: '/404' }
    ]
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
  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              {/* header logo */}
              <Link href="/" className="header__logo">
                <Image src="/core/assets/img/logo.svg" alt="CineHub" width={120} height={40} />
              </Link>
              {/* end header logo */}

              {/* header nav */}
              <Navigation 
                items={navigationItems}
                className="header__nav"
                variant="header"
              />
              {/* end header nav */}

              {/* header auth */}
              <div className="header__auth">
                <SearchBar 
                  placeholder="Search..."
                  className="header__search-container"
                />

                {/* language dropdown */}
                <div className="header__lang">
                  <Navigation
                    items={[
                      {
                        label: 'EN',
                        icon: 'ti ti-chevron-down',
                        items: languageItems
                      }
                    ]}
                    variant="header"
                  />
                </div>
                {/* end language dropdown */}

                {/* user profile dropdown */}
                <div className="header__profile">
                  <Navigation
                    items={[
                      {
                        label: 'Nickname',
                        icon: 'ti ti-user',
                        items: userMenuItems
                      }
                    ]}
                    variant="header"
                  />
                </div>
                {/* end user profile dropdown */}
              </div>
              {/* end header auth */}

              {/* header menu btn */}
              <button className="header__btn" type="button">
                <span></span>
                <span></span>
                <span></span>
              </button>
              {/* end header menu btn */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}