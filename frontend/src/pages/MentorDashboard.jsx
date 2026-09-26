import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const MentorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnswerId, setActiveAnswerId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/questions');
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id) => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const res = await API.put(`/api/questions/${id}/answer`, { answer: answerText.trim() });
      setQuestions(questions.map((q) => (q._id === id ? res.data : q)));
      setActiveAnswerId(null);
      setAnswerText('');
    } catch (err) {
      alert('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingQuestions = questions.filter((q) => q.status === 'Pending');
  const answeredQuestions = questions.filter((q) => q.status === 'Answered');

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Mentor Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(30, 64, 175, 0.25)',
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
          }}
        >
          Mentor Portal
        </span>
        <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
          👨‍🏫 Welcome, {user?.name || 'Mentor'}
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
          Manage student doubts, post solutions, and foster student academic success.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Pending Doubts
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>
            {pendingQuestions.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Needs answer</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Answered Questions
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
            {answeredQuestions.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Solutions provided</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #3b82f6' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Doubts Submitted
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#3b82f6', marginTop: '0.2rem' }}>
            {questions.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Across all subjects</div>
        </div>
      </div>

      {/* Questions Feed */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }}>
        Pending Student Doubts ({pendingQuestions.length})
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading questions...</div>
      ) : pendingQuestions.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
          <h3>🎉 No pending questions right now!</h3>
          <p style={{ color: '#6b7280' }}>All student doubts have been answered.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {pendingQuestions.map((q) => (
            <div key={q._id} className="card" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
                  {q.subject}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>From: {q.studentName}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>{q.title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1rem' }}>{q.description}</p>

              {activeAnswerId === q._id ? (
                <div>
                  <textarea
                    rows={3}
                    placeholder="Write clear, step-by-step guidance..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.6rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleAnswer(q._id)} disabled={submitting} className="btn btn-primary" style={{ background: '#16a34a' }}>
                      {submitting ? 'Submitting...' : 'Post Solution'}
                    </button>
                    <button onClick={() => setActiveAnswerId(null)} className="btn btn-outline">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveAnswerId(q._id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#2563eb' }}>
                  ✏️ Answer Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MentorDashboard;
