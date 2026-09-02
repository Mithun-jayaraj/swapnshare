import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="card item-card">
      <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      <div className="item-card-content">
        <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '16px' }}></div>
        <div className="item-card-meta">
          <div className="skeleton" style={{ height: '24px', width: '40%' }}></div>
          <div className="skeleton" style={{ height: '14px', width: '20%' }}></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonText = ({ width = '100%', height = '14px', marginBottom = '8px' }) => {
  return (
    <div className="skeleton" style={{ width, height, marginBottom }}></div>
  );
};
