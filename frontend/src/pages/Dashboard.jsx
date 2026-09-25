import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    if (user) return user;
    try {
      const saved = localStorage.getItem('childhelp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Dashboard Metrics
  const [materialsCount, setMaterialsCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);

  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get('/api/auth/profile').catch(() => null);
      if (profileRes?.data) {
        setProfile(profileRes.data);
        localStorage.setItem('childhelp_user', JSON.stringify(profileRes.data));
      }

      const [matRes, quizRes, attRes, progRes] = await Promise.all([
        API.get('/api/materials').catch(() => ({ data: [] })),
        API.get('/api/quizzes').catch(() => ({ data: [] })),
        API.get('/api/quiz-attempts/my').catch(() => ({ data: [] })),
        API.get('/api/progress/all').catch(() => ({ data: { inProgress: [] } })),
      ]);

      if (matRes.data) setMaterialsCount(matRes.data.length);
      if (quizRes.data) setQuizzesCount(quizRes.data.length);
      if (attRes.data) setQuizAttempts(attRes.data);
      if (progRes.data?.inProgress) setRecentMaterials(progRes.data.inProgress.slice(0, 3));
    } catch (err) {
      console.error('Failed loading dashboard metrics:', err);
      setApiError('Notice: Could not sync some statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('childhelp_token');
      localStorage.removeItem('childhelp_user');
      navigate('/login');
    }
  };

  const userName = profile?.name || 'Student';
  const userRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student';

  // Compute quiz stats
  const completedQuizzesCount = quizAttempts.length;
  const averageScore =
    completedQuizzesCount > 0
      ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / completedQuizzesCount)
      : 0;
  const bestScore =
    completedQuizzesCount > 0 ? Math.max(...quizAttempts.map((a) => a.percentage || 0)) : 0;

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div className="dashboard-header" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', fontWeight: '800' }}>
            Welcome to ChildHelp 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            Hello <strong>{userName}</strong> ({userRole}) • Your Learning &amp; Assessment Portal
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
          >
            📝 Take a Quiz
          </button>
          <button
            onClick={() => navigate('/my-progress')}
            className="btn btn-outline"
            style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
          >
            📊 View My Progress
          </button>
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.6rem 1rem' }}>
            Logout
          </button>
        </div>
      </div>

      {apiError && <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>{apiError}</div>}

      {/* Top Metrics Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* 1. Available Study Materials */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.25)',
          }}
        >
          <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
            STUDY MATERIALS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
            {loading ? '...' : materialsCount}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
            Available Resources
          </div>
        </div>

            {/* 2. Available Quizzes */}
            <div
              className="card"
              style={{
                padding: '1.4rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                QUIZZES
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {quizzesCount}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Available Quizzes
              </div>
            </div>

            {/* 3. Completed Quizzes */}
            <div
              className="card"
              style={{
                padding: '1.4rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                COMPLETED QUIZZES
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {completedQuizzesCount}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Attempts Logged
              </div>
            </div>

            {/* 4. Average Score & Best Score */}
            <div
              className="card"
              style={{
                padding: '1.4rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                AVERAGE / BEST SCORE
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {averageScore}% <span style={{ fontSize: '1.1rem', opacity: 0.9 }}>/ {bestScore}%</span>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                🏆 Best: {bestScore}%
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts Banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.75rem',
              marginBottom: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: '800' }}>
                🚀 Ready to learn and test your knowledge?
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Access curated study materials or attempt a subject quiz to measure your performance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/materials')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.4rem', borderRadius: '10px', fontWeight: '700' }}
              >
                📚 Study Materials
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', borderRadius: '10px', fontWeight: '700' }}
              >
                📝 Take a Quiz
              </button>
              <button
                onClick={() => navigate('/my-progress')}
                className="btn"
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  background: '#8b5cf6',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                📊 My Progress
              </button>
            </div>
          </div>

          {/* Core Modules Grid */}
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800' }}>Platform Modules</h2>

          <div className="dashboard-grid">
            {/* 1. Study Materials (Phase 2) */}
            <div className="module-card" style={{ border: '2px solid #6366f1' }}>
              <div className="module-icon">📚</div>
              <h3 className="module-title">Study Materials</h3>
              <p className="module-desc">
                Access curated textbooks, practice sheets, and video tutorials for all grade levels.
              </p>
              <button
                onClick={() => navigate('/materials')}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.55rem' }}
              >
                Explore Study Materials
              </button>
            </div>

            {/* 2. Quizzes (Phase 3 Active) */}
            <div className="module-card" style={{ border: '2px solid #10b981' }}>
              <div className="module-icon">📝</div>
              <h3 className="module-title">Quizzes</h3>
              <p className="module-desc">
                Interactive subject quizzes to test knowledge and earn performance score badges.
              </p>
              <button
                onClick={() => navigate('/quizzes')}
                className="btn"
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.55rem',
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                Available Quizzes
              </button>
            </div>

            {/* 3. My Progress (Phase 3 Active) */}
            <div className="module-card" style={{ border: '2px solid #8b5cf6' }}>
              <div className="module-icon">📊</div>
              <h3 className="module-title">Progress &amp; Results</h3>
              <p className="module-desc">
                Track learning statistics, quiz score history, average scores, and best performance.
              </p>
              <button
                onClick={() => navigate('/my-progress')}
                className="btn"
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.55rem',
                  background: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                View My Progress
              </button>
            </div>

            {/* 4. Scholarships (Upcoming) */}
            <div className="module-card">
              <div className="module-icon">🎓</div>
              <h3 className="module-title">Scholarships</h3>
              <p className="module-desc">
                Explore eligible educational grants, financial support, and application deadlines.
              </p>
              <span className="module-badge">Upcoming</span>
            </div>

            {/* 5. Doubts (Upcoming) */}
            <div className="module-card">
              <div className="module-icon">💬</div>
              <h3 className="module-title">Mentor Doubts</h3>
              <p className="module-desc">
                Ask questions directly to verified mentors and receive step-by-step solutions.
              </p>
              <span className="module-badge">Upcoming</span>
            </div>
          </div>
    </main>
  );
};

export default Dashboard;
