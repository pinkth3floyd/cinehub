'use client';

import React from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { adminLogout } from '../../entities/auth/actions';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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

        {/* logout button */}
        <button 
          className="header__logout" 
          type="button" 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging out...
            </>
          ) : (
            <>
              <i className="ti ti-logout me-2"></i>
              Logout
            </>
          )}
        </button>
        {/* end logout button */}
      </div>
    </header>
  );
};

export default AdminHeader; 