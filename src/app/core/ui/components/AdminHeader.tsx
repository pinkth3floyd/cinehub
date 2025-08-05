'use client';

import React from 'react';
import Image from 'next/image';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="header">
      <div className="header__content">
        {/* header logo */}
        <a href="/" className="header__logo">
            {/* <Image src="/core/assets/img/logo.svg" alt="CineHub" width={120} height={40} /> */}
          <h1>CineHub</h1>
        </a>
        {/* end header logo */}

        {/* header menu btn */}
        <button className="header__btn" type="button" onClick={onMenuToggle}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* end header menu btn */}
      </div>
    </header>
  );
};

export default AdminHeader; 