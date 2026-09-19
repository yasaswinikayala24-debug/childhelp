import React from 'react';

const ProgressBar = ({ percentage = 0, color = '#6366f1', height = '10px', showLabel = true }) => {
  const safePercentage = Math.min(100, Math.max(0, Number(percentage) || 0));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>
          <span>Progress</span>
          <span>{safePercentage}% Completed</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: '#e2e8f0',
          borderRadius: '50px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${safePercentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '50px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
