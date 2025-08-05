'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CrudTableProps {
  title: string;
  icon: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  addLink?: string;
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const CrudTable: React.FC<CrudTableProps> = ({
  title,
  icon,
  data,
  columns,
  onDelete,
  onEdit,
  onView,
  addLink,
  isLoading = false,
  pagination
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete?.(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const renderValue = (column: { key: string; render?: (value: any, item: any) => React.ReactNode }, item: any) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }

    // Default rendering based on data type
    if (typeof value === 'boolean') {
      return (
        <span className={`badge ${value ? 'badge-success' : 'badge-secondary'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    if (typeof value === 'number' && column.key === 'rating') {
      return (
        <div className="dashbox__table-text dashbox__table-text--rate">
          <i className="ti ti-star"></i> {value}
        </div>
      );
    }

    if (column.key === 'status') {
      const statusColors: { [key: string]: string } = {
        'active': 'badge-success',
        'inactive': 'badge-secondary',
        'banned': 'badge-danger',
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger',
        'draft': 'badge-secondary',
        'published': 'badge-success',
        'archived': 'badge-secondary'
      };
      
      return (
        <span className={`badge ${statusColors[String(value)?.toLowerCase()] || 'badge-secondary'}`}>
          {String(value)}
        </span>
      );
    }

    return <div className="dashbox__table-text">{String(value)}</div>;
  };

  return (
    <div className="dashbox">
      <div className="dashbox__title">
        <h3>
          <i className={icon}></i> {title}
        </h3>
        <div className="dashbox__wrap">
          {addLink && (
            <Link className="dashbox__more" href={addLink}>
              Add New
            </Link>
          )}
        </div>
      </div>

      <div className="dashbox__table-wrap">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <table className="dashbox__table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={String(item.id)}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {renderValue(column, item)}
                      </td>
                    ))}
                    <td>
                      <div className="dashbox__table-text">
                        {onView && (
                          <button
                            className="btn btn-sm btn-info me-1"
                            onClick={() => onView(String(item.id))}
                            title="View"
                          >
                            <i className="ti ti-eye"></i>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => onEdit(String(item.id))}
                            title="Edit"
                          >
                            <i className="ti ti-edit"></i>
                          </button>
                        )}
                        {onDelete && (
                          deleteConfirm === item.id ? (
                            <div className="d-inline-block">
                              <button
                                className="btn btn-sm btn-danger me-1"
                                onClick={() => handleDelete(String(item.id))}
                                title="Confirm Delete"
                              >
                                <i className="ti ti-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelDelete}
                                title="Cancel"
                              >
                                <i className="ti ti-x"></i>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(String(item.id))}
                              title="Delete"
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} entries
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <li
                          key={page}
                          className={`page-item ${pagination.page === page ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => pagination.onPageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CrudTable; 