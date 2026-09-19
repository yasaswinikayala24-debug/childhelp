import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const MyProgress = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/api/quiz-attempts/my');
      setAttempts(res.data || []);
    } catch (err) {
      console.error('Error fetching student attempts:', err);
      setError('Unable to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real attempt data
  const totalCompleted = attempts.length;
  const averagePercentage =
    totalCompleted > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / totalCompleted)
      : 0;
  const bestPercentage =
    totalCompleted > 0 ? Math.max(...attempts.map((a) => a.percentage || 0)) : 0;

  return (
    <main className="main-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.35rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Phase 3 • Learning Analytics
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
            📊 My Learning Progress
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
            Track your quiz history, performance metrics, and academic milestones over time.
          </p>
        </div>

        <button
          onClick={() => navigate('/quizzes')}
          className="btn"
          style={{
            background: '#ffffff',
            color: '#4f46e5',
            fontWeight: '700',
            padding: '0.75rem 1.6rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          📝 Take a Quiz
        </button>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Summary Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Total Completed */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #6366f1' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Completed Quizzes
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', marginTop: '0.2rem' }}>
            {totalCompleted}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Attempts logged</div>
        </div>

        {/* Average Score */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Average Score
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
            {averagePercentage}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Overall accuracy</div>
        </div>

        {/* Best Score */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Best Score
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>
            🏆 {bestPercentage}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Highest score achieved</div>
        </div>
      </div>

      {/* Attempts History Table */}
      <div
        className="card"
        style={{
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }}>
          Quiz History &amp; Attempt Logs
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Loading quiz history...</h3>
          </div>
        ) : attempts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: '#f9fafb',
              borderRadius: '16px',
              border: '2px dashed #e5e7eb',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No quiz attempts recorded yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Take your first quiz to see your performance logs here!
            </p>
            <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
              Take a Quiz Now
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280', fontWeight: '700' }}>
                    QUIZ NAME
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280', fontWeight: '700' }}>
                    SCORE
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280', fontWeight: '700' }}>
                    PERCENTAGE
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280', fontWeight: '700' }}>
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => {
                  const quizTitle = att.quiz?.title || 'Quiz Assessment';
                  const dateStr = att.completedAt
                    ? new Date(att.completedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={att._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: '#111827' }}>
                        {quizTitle}
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', fontWeight: '700', color: '#4338ca' }}>
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span
                          style={{
                            background: att.percentage >= 80 ? '#d1fae5' : att.percentage >= 60 ? '#fef3c7' : '#fee2e2',
                            color: att.percentage >= 80 ? '#065f46' : att.percentage >= 60 ? '#92400e' : '#991b1b',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                          }}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.9rem', color: '#6b7280' }}>
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyProgress;
