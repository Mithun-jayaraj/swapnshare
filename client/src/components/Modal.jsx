import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'default' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div 
        className="card" 
        style={modalStyle(type)} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: type === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)' }}>
            {title}
          </h3>
          <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles for modal specifically to avoid cluttering global css unnecessarily
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
  backdropFilter: 'blur(2px)'
};

const modalStyle = (type) => ({
  width: '100%',
  maxWidth: '500px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  borderTop: type === 'danger' ? '4px solid var(--color-danger)' : 'none'
});

const headerStyle = {
  padding: '20px 24px',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  lineHeight: 1
};

const bodyStyle = {
  padding: '24px',
  overflowY: 'auto'
};

const footerStyle = {
  padding: '16px 24px',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  backgroundColor: 'var(--color-surface-hover)'
};

export default Modal;
