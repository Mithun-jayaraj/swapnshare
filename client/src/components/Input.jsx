import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  id, 
  className = '', 
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      {type === 'textarea' ? (
        <textarea 
          id={inputId} 
          className="form-control" 
          {...props} 
        />
      ) : (
        <input 
          type={type} 
          id={inputId} 
          className="form-control" 
          {...props} 
        />
      )}
      {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Input;
