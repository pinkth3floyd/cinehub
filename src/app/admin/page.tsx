import React from 'react';
import AdminLayout from '../core/ui/components/AdminLayout';
import AdminDashboard from '../core/ui/components/AdminDashboard';

const AdminPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;