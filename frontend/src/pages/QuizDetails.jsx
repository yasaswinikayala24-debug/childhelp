import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedAnswer }
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/api/quizzes/${id}`);
      setQuiz(res.data);
    } catch (err) {
      console.error('Error fetching quiz details:', err);
      setError('Failed to load quiz questions. Please return to Quizzes.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions) return;
    setSubmitting(true);
    try {
      const answersPayload = quiz.questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: selectedAnswers[q._id] || '',
      }));

      const res = await API.post(`/api/quizzes/${id}/submit`, {
        answers: answersPayload,
      });

      // Redirect to result page passing evaluation result
      navigate('/quiz-result', { state: { result: res.data } });
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Error submitting quiz. Please try again.');
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <h3>Loading quiz questions...</h3>
      </main>
    );
  }

  if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <main className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          {error || 'Quiz not found or has no questions.'}
        </div>
        <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
          Back to Quizzes
        </button>
      </main>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <main className="main-content" style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Quiz Header Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase' }}>
            {quiz.subject} • Class {quiz.classLevel}
          </span>
          <h1 style={{ fontSize: '1.75rem', margin: '0.2rem 0 0', fontWeight: '800' }}>{quiz.title}</h1>
        </div>

        <div
          style={{
            background: '#f3f4f6',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#4b5563',
          }}
        >
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div
        className="card"
        style={{
          borderRadius: '20px',
          padding: '2.25rem',
          boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {currentQuestionIndex + 1}. {currentQuestion.questionText}
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion._id] === option;
            return (
              <label
                key={idx}
                onClick={() => handleOptionSelect(currentQuestion._id, option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #6366f1' : '1px solid #e5e7eb',
                  background: isSelected ? '#f5f3ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#4338ca' : '#374151',
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(currentQuestion._id, option)}
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                />
                <span style={{ fontSize: '1.05rem' }}>{option}</span>
              </label>
            );
          })}
        </div>

        {/* Navigation & Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline"
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              fontWeight: '700',
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '10px',
                fontWeight: '700',
                background: '#10b981',
                borderColor: '#10b981',
              }}
            >
              ✅ Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '10px',
                fontWeight: '700',
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Are you sure you want to submit the quiz?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              You have answered <strong>{answeredCount}</strong> of <strong>{quiz.questions.length}</strong> questions.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="btn btn-outline"
                style={{ padding: '0.6rem 1.4rem', borderRadius: '10px', fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  background: '#10b981',
                  borderColor: '#10b981',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default QuizDetails;
