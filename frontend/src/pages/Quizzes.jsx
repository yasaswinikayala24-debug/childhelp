import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/api/quizzes');
      setQuizzes(res.data || []);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      setError('Unable to load quizzes. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Page Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
        }}
      >
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
          Phase 3 • Interactive Assessment
        </span>
        <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
          📝 Available Quizzes
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
          Test your subject knowledge, reinforce key concepts, and track your progress.
        </p>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Loading available quizzes...</h3>
        </div>
      ) : quizzes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: '#f9fafb',
            borderRadius: '16px',
            border: '2px dashed #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
          <h3>No quizzes available right now</h3>
          <p style={{ color: '#6b7280' }}>Check back soon for new subject assessments.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="card"
              style={{
                borderRadius: '18px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                    }}
                  >
                    {quiz.subject}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '600' }}>
                    Class {quiz.classLevel}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', fontWeight: '800' }}>
                  {quiz.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {quiz.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  <span>❓ {quiz.questions ? quiz.questions.length : 0} Questions</span>
                  <span>•</span>
                  <span>Multiple Choice</span>
                </div>

                <button
                  onClick={() => navigate(`/quizzes/${quiz._id}`)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                  }}
                >
                  ▶️ Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Quizzes;
