import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`cinema-badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
