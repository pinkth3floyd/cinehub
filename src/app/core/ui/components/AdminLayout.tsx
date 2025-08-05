'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminHeader onMenuToggle={handleMenuToggle} />
      <AdminSidebar isOpen={sidebarOpen} />
      
      {/* main content */}
      <main className="main">
        <div className="container-fluid">
          {children}
        </div>
      </main>
      {/* end main content */}
    </div>
  );
};

export default AdminLayout; 