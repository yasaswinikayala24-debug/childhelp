import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  if (!result) {
    return (
      <main className="main-content" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
          No recent quiz result found.
        </div>
        <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
          Back to Quizzes
        </button>
      </main>
    );
  }

  const { quizTitle, score, correctAnswers, totalQuestions, percentage } = result;

  return (
    <main className="main-content" style={{ maxWidth: '650px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div
        className="card"
        style={{
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          background: '#ffffff',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', color: '#111827' }}>
          Quiz Completed!
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#6366f1', fontWeight: '700', marginBottom: '2rem' }}>
          {quizTitle || 'Subject Assessment'}
        </p>

        {/* Score & Percentage Display */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)',
            padding: '2rem',
            borderRadius: '20px',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: '#4b5563', textTransform: 'uppercase', fontWeight: '700' }}>
              Score
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4338ca', marginTop: '0.2rem' }}>
              {score} / {totalQuestions}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#4b5563', textTransform: 'uppercase', fontWeight: '700' }}>
              Correct Answers
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
              {correctAnswers}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#4b5563', textTransform: 'uppercase', fontWeight: '700' }}>
              Percentage
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6', marginTop: '0.2rem' }}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/my-progress')}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
            }}
          >
            📊 View My Progress
          </button>

          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-outline"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
            }}
          >
            📝 Back to Quizzes
          </button>
        </div>
      </div>
    </main>
  );
};

export default QuizResult;
