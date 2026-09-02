import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusProps = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { className: 'badge-success', label: 'Accepted' };
      case 'rejected':
        return { className: 'badge-danger', label: 'Rejected' };
      case 'pending':
        return { className: 'badge-pending', label: 'Pending' };
      default:
        return { className: 'badge-neutral', label: status || 'Unknown' };
    }
  };

  const { className, label } = getStatusProps();

  return (
    <span className={`badge ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
