'use client';

import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="ti ti-alert-triangle text-danger me-2"></i>
            {title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">
            {message}
            {itemName && (
              <span className="modal-item-name">
                <strong>"{itemName}"</strong>
              </span>
            )}
          </p>
          <p className="modal-warning">
            <i className="ti ti-alert-circle text-warning me-1"></i>
            This action cannot be undone.
          </p>
        </div>
        
        <div className="modal-footer">
          <button
            className="sign__btn sign__btn--secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="sign__btn sign__btn--danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="ti ti-trash me-2"></i>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 