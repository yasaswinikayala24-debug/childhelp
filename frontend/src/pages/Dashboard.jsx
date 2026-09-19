import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // Fetch profile from backend protected endpoint /api/auth/profile
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/auth/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch protected profile:', err);
        setApiError('Session expired or invalid token. Please log in again.');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('childhelp_token');
      localStorage.removeItem('childhelp_user');
      navigate('/login');
    }
  };

  const userName = profile?.name || 'User';
  const userRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student';

  return (
    <main className="main-content">
      {/* Welcome Banner */}
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            Welcome, {userName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Role: <strong style={{ color: 'var(--primary-color)' }}>{userRole}</strong>
          </p>
        </div>

        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {apiError && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{apiError}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Loading dashboard profile...</h3>
        </div>
      ) : (
        <>
          {/* Phase 2 Learning Overview Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '2rem 2.5rem',
              borderRadius: '16px',
              marginBottom: '2.5rem',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.35)',
            }}
          >
            <h2 style={{ color: '#ffffff', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '800' }}>
              Learning Overview
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>📚 Study Materials</div>
                  <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>Available Resources</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>📖 Subjects</div>
                  <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>Explore &amp; Learn</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/materials')}
                className="btn btn-secondary"
                style={{
                  padding: '0.75rem 1.8rem',
                  fontWeight: '700',
                  borderRadius: '10px',
                  background: '#14b8a6',
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                Explore Study Materials
              </button>
            </div>
          </div>

          {/* Platform Modules */}
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Platform Modules</h2>

          <div className="dashboard-grid">
            {/* 1. Study Materials (Active in Phase 2) */}
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

            {/* 2. Scholarships */}
            <div className="module-card">
              <div className="module-icon">🎓</div>
              <h3 className="module-title">Scholarships</h3>
              <p className="module-desc">
                Explore eligible educational grants, financial support, and application deadlines.
              </p>
              <span className="module-badge">Coming Soon</span>
            </div>

            {/* 3. Quizzes */}
            <div className="module-card">
              <div className="module-icon">📝</div>
              <h3 className="module-title">Quizzes</h3>
              <p className="module-desc">
                Interactive subject quizzes to test knowledge and earn performance badges.
              </p>
              <span className="module-badge">Coming Soon</span>
            </div>

            {/* 4. Doubts */}
            <div className="module-card">
              <div className="module-icon">💬</div>
              <h3 className="module-title">Doubts</h3>
              <p className="module-desc">
                Ask questions directly to verified mentors and receive step-by-step solutions.
              </p>
              <span className="module-badge">Coming Soon</span>
            </div>

            {/* 5. Progress */}
            <div className="module-card">
              <div className="module-icon">📊</div>
              <h3 className="module-title">Progress</h3>
              <p className="module-desc">
                Track learning statistics, quiz scores, and academic growth history.
              </p>
              <span className="module-badge">Coming Soon</span>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;
