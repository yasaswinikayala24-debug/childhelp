import React from 'react';
import { Link } from 'react-router-dom';

const MaterialCard = ({ material }) => {
  if (!material) return null;

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'PDF':
        return '#ef4444';
      case 'VIDEO':
        return '#6366f1';
      case 'LINK':
        return '#14b8a6';
      default:
        return '#64748b';
    }
  };

  return (
    <div
      className="feature-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.8rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#ffffff',
              backgroundColor: getTypeBadgeColor(material.type),
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {material.type || 'PDF'}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.8rem',
            lineHeight: '1.3',
          }}
        >
          {material.title}
        </h3>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#4f46e5',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
            }}
          >
            Subject: {material.subject}
          </span>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#0d9488',
              background: 'rgba(13, 148, 136, 0.1)',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
            }}
          >
            Class: {material.classLevel}
          </span>
        </div>

        <p
          style={{
            fontSize: '0.92rem',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {material.description}
        </p>
      </div>

      <Link
        to={`/materials/${material._id}`}
        className="btn btn-primary"
        style={{
          width: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          fontWeight: '600',
        }}
      >
        View Material
      </Link>
    </div>
  );
};

export default MaterialCard;
