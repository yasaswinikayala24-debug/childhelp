import React from 'react';
import { Link } from 'react-router-dom';

const MaterialCard = ({ material, isBookmarked = false, isCompleted = false, onToggleBookmark }) => {
  if (!material) return null;

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'PDF':
        return '#ef4444';
      case 'VIDEO':
        return '#6366f1';
      case 'ARTICLE':
        return '#8b5cf6';
      case 'LINK':
        return '#14b8a6';
      default:
        return '#64748b';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
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
        padding: '1.6rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: getTypeBadgeColor(material.type),
                padding: '0.2rem 0.65rem',
                borderRadius: '50px',
                textTransform: 'uppercase',
              }}
            >
              {material.type || 'PDF'}
            </span>

            {isCompleted && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '50px',
                }}
              >
                ✓ Completed
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(material._id)}
              aria-label="Bookmark Material"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                opacity: isBookmarked ? 1 : 0.5,
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Material'}
            >
              {isBookmarked ? '🔖' : '📑'}
            </button>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.7rem',
            lineHeight: '1.35',
          }}
        >
          📚 {material.title}
        </h3>

        {/* Subject & Class & Difficulty */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#4f46e5',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
            }}
          >
            {material.subject}
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#0d9488',
              background: 'rgba(13, 148, 136, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
            }}
          >
            Class {material.classLevel}
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: getDifficultyColor(material.difficulty),
              background: `${getDifficultyColor(material.difficulty)}15`,
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
            }}
          >
            {material.difficulty || 'Beginner'}
          </span>
        </div>

        {/* Estimated Time */}
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem', fontWeight: '500' }}>
          ⏱ {material.estimatedTime || 15} minutes
        </div>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: '#64748b',
            lineHeight: '1.55',
            marginBottom: '1.4rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {material.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <Link
          to={`/materials/${material._id}`}
          className="btn btn-primary"
          style={{
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}
        >
          Open
        </Link>
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(material._id)}
            className="btn btn-outline"
            style={{
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              borderColor: isBookmarked ? '#6366f1' : '#cbd5e1',
              color: isBookmarked ? '#6366f1' : '#64748b',
            }}
          >
            {isBookmarked ? '🔖 Saved' : '🔖 Save'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;
