import React from 'react';

const Card = ({ children, className = '', style = {}, onClick }) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease-in-out',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
