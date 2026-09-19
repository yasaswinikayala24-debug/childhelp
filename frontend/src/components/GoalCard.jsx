import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const GoalCard = ({ goal, onUpdate }) => {
  if (!goal) return null;

  const percentage = Math.round((goal.completedMaterials / (goal.targetMaterials || 1)) * 100);

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No deadline';

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>{goal.title}</h3>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '0.2rem 0.6rem',
            borderRadius: '50px',
            backgroundColor: goal.status === 'COMPLETED' ? '#10b981' : '#6366f1',
            color: '#ffffff',
          }}
        >
          {goal.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
        </span>
      </div>

      {goal.description && (
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>{goal.description}</p>
      )}

      <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>Target: <strong>{goal.targetMaterials} materials</strong></span>
        <span>Completed: <strong>{goal.completedMaterials}</strong></span>
      </div>

      <ProgressBar percentage={percentage} color={goal.status === 'COMPLETED' ? '#10b981' : '#6366f1'} showLabel={false} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        <span>🗓 Deadline: <strong style={{ color: '#475569' }}>{formattedDeadline}</strong></span>
        <Link
          to="/materials"
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderRadius: '8px' }}
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
};

export default GoalCard;
