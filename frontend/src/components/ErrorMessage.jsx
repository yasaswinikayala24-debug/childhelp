import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div style={{
      backgroundColor: '#fff5f5',
      borderLeft: '4px solid #e53e3e',
      color: '#c53030',
      padding: '1rem 1.25rem',
      borderRadius: '6px',
      margin: '1rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
