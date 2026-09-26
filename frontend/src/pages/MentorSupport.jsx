import React, { useState, useEffect } from 'react';
import API from '../services/api';

const MentorSupport = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ask question form state
  const [subject, setSubject] = useState('Mathematics');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mentor answer state
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answering, setAnswering] = useState(false);

  const isMentorOrAdmin = user && (user.role === 'mentor' || user.role === 'admin');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      // Mentors see all questions; students see their own questions
      const endpoint = isMentorOrAdmin ? '/api/questions' : '/api/questions/my';
      const res = await API.get(endpoint);
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Unable to load questions. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/api/questions', {
        subject,
        title: title.trim(),
        description: description.trim(),
      });
      setQuestions([res.data, ...questions]);
      setTitle('');
      setDescription('');
      alert('Question submitted successfully! A mentor will review it shortly.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    if (!answerText.trim()) return;
    setAnswering(true);
    try {
      const res = await API.put(`/api/questions/${questionId}/answer`, {
        answer: answerText.trim(),
      });

      setQuestions(questions.map((q) => (q._id === questionId ? res.data : q)));
      setActiveQuestionId(null);
      setAnswerText('');
    } catch (err) {
      alert('Error submitting answer');
    } finally {
      setAnswering(false);
    }
  };

  return (
    <main className="main-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.25)',
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
          {isMentorOrAdmin ? 'Mentor Portal • Doubt Resolution' : 'Student Assistance • 1-on-1 Help'}
        </span>
        <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
          💬 Mentor Support &amp; Doubts
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
          {isMentorOrAdmin
            ? 'Review student questions, provide step-by-step guidance, and support academic success.'
            : 'Ask subject-specific questions and receive step-by-step guidance from verified educators.'}
        </p>
      </div>

      {/* Ask Question Form (Student Only) */}
      {!isMentorOrAdmin && (
        <div
          className="card"
          style={{
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', color: '#111827' }}>
            ❓ Ask a New Question
          </h2>

          <form onSubmit={handleAskQuestion}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Programming">Programming</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                  Question Title / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do I solve quadratic equations using the formula?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                Detailed Description / Problem Details
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain what concept or exercise you are having trouble with..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.6rem', borderRadius: '10px', fontWeight: '700', background: '#2563eb', borderColor: '#2563eb' }}
            >
              {submitting ? 'Submitting Question...' : 'Submit Question'}
            </button>
          </form>
        </div>
      )}

      {/* Questions Feed / List */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }}>
        {isMentorOrAdmin ? '📋 Student Questions Feed' : '📝 My Questions & Answers'}
      </h2>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Loading questions...</h3>
        </div>
      ) : questions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            background: '#f9fafb',
            borderRadius: '16px',
            border: '2px dashed #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
          <h3>No questions submitted yet</h3>
          <p style={{ color: '#6b7280' }}>
            {isMentorOrAdmin ? 'All student questions have been answered!' : 'Submit your first question above!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q) => (
            <div
              key={q._id}
              className="card"
              style={{
                borderRadius: '18px',
                padding: '1.75rem',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
                    {q.subject}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#6b7280', fontWeight: '600' }}>
                    Asked by <strong>{q.studentName || 'Student'}</strong>
                  </span>
                </div>

                <span
                  style={{
                    background: q.status === 'Answered' ? '#d1fae5' : '#fef3c7',
                    color: q.status === 'Answered' ? '#065f46' : '#92400e',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                  }}
                >
                  {q.status === 'Answered' ? '✓ Answered' : '⏳ Pending'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>
                {q.title}
              </h3>

              <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                {q.description}
              </p>

              {/* Answer Box if answered */}
              {q.answer ? (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '1.25rem',
                    borderRadius: '14px',
                    marginTop: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#166534' }}>
                      👨‍🏫 Answer from {q.mentorName || 'Mentor'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#15803d' }}>
                      {q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#166534', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                    {q.answer}
                  </p>
                </div>
              ) : isMentorOrAdmin ? (
                /* Mentor Answer Action Form */
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  {activeQuestionId === q._id ? (
                    <div>
                      <textarea
                        rows={3}
                        placeholder="Write your step-by-step mentor solution..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '0.75rem', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleAnswerSubmit(q._id)}
                          disabled={answering}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', background: '#16a34a', borderColor: '#16a34a' }}
                        >
                          {answering ? 'Submitting...' : 'Submit Answer'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveQuestionId(null);
                            setAnswerText('');
                          }}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveQuestionId(q._id);
                        setAnswerText('');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', background: '#2563eb' }}
                    >
                      ✏️ Answer Question
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '0.5rem' }}>
                  Waiting for mentor review...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MentorSupport;
