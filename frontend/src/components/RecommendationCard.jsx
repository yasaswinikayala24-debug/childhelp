import React from 'react';
import { Link } from 'react-router-dom';

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const { reason, recommendations } = recommendation;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        padding: '1.6rem',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
        <span style={{ fontSize: '1.4rem' }}>💡</span>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>
            Recommended For You
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600', margin: 0 }}>
            {reason || 'Based on your recent study activity'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((m) => (
            <div
              key={m._id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#4f46e5',
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {m.subject} • {m.classLevel ? `Class ${m.classLevel}` : 'General'}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.4', marginBottom: '1rem' }}>
                  ⏱ {m.estimatedTime || 15} mins • {m.difficulty || 'Beginner'}
                </p>
              </div>

              <Link
                to={`/materials/${m._id}`}
                className="btn btn-primary"
                style={{ padding: '0.45rem', fontSize: '0.85rem', textAlign: 'center', justifyContent: 'center' }}
              >
                Open Material
              </Link>
            </div>
          ))
        ) : (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No specific recommendations available yet. Explore study materials to personalize!</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
