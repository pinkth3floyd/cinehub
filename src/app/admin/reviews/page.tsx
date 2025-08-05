'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../core/ui/components/AdminLayout';
import CrudTable from '../../core/ui/components/CrudTable';
import SearchFilter from '../../core/ui/components/SearchFilter';
import { getReviews, deleteReview, approveReview, rejectReview } from '../../core/entities/reviews/actions';

interface Review {
  id: string;
  content: string;
  rating: number;
  status: string;
  movieId: string;
  userId: string;
  createdAt: Date;
}

const ReviewsPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadReviews = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const result = await getReviews({
        page,
        limit: 10,
        search
      });
      if (result.success && result.data) {
        setReviews(result.data.reviews);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load reviews:', result.error);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteReview(id);
      if (result.success) {
        loadReviews(currentPage, searchTerm);
      } else {
        alert('Failed to delete review: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const result = await approveReview(id);
      if (result.success) {
        loadReviews(currentPage, searchTerm);
      } else {
        alert('Failed to approve review: ' + result.error);
      }
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Error approving review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await rejectReview(id);
      if (result.success) {
        loadReviews(currentPage, searchTerm);
      } else {
        alert('Failed to reject review: ' + result.error);
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Error rejecting review');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/reviews/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/reviews/view/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'content', 
      label: 'Content',
      render: (value: string) => (
        <div className="dashbox__table-text">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </div>
      )
    },
    { key: 'rating', label: 'Rating' },
    { key: 'status', label: 'Status' },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value: Date) => (
        <div className="dashbox__table-text">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Reviews Management</h2>
          </div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        placeholder="Search reviews by content..."
        filters={filterOptions}
      />

      <div className="row">
        <div className="col-12">
          <CrudTable
            title="All Reviews"
            icon="ti ti-message"
            data={reviews}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            addLink="/admin/reviews/add"
            isLoading={loading}
            pagination={{
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.totalPages,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsPage; 