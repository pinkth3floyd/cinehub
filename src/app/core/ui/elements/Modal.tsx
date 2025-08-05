'use client';

import React from 'react';

export interface ModalProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  className?: string;
}

export default function Modal({
  id,
  title,
  children,
  size = 'md',
  centered = true,
  className = ''
}: ModalProps) {
  const modalClass = `modal fade ${className}`.trim();
  const dialogClass = `modal-dialog modal-${size}${centered ? ' modal-dialog-centered' : ''}`;

  return (
    <div className={modalClass} id={id} tabIndex={-1} aria-labelledby={`${id}-label`} aria-hidden="true">
      <div className={dialogClass}>
        <div className="modal-content">
          <div className="modal__content">
            {title && (
              <div className="modal__header">
                <h4 className="modal__title" id={`${id}-label`}>{title}</h4>
                <button className="modal__close" type="button" data-bs-dismiss="modal" aria-label="Close">
                  <i className="ti ti-x"></i>
                </button>
              </div>
            )}
            <div className="modal__body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 