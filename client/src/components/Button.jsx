import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  block = false, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  const blockClass = block ? 'btn-block' : '';
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
