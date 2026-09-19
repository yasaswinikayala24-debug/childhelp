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
      <div className="dashboard-header">
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

      {apiError && <div className="alert alert-danger">{apiError}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Loading dashboard profile...</h3>
        </div>
      ) : (
        <>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Platform Modules</h2>

          <div className="dashboard-grid">
            {/* 1. Study Materials */}
            <div className="module-card">
              <div className="module-icon">📚</div>
              <h3 className="module-title">Study Materials</h3>
              <p className="module-desc">
                Access curated textbooks, practice sheets, and video tutorials for all grade levels.
              </p>
              <span className="module-badge">Phase 2 Module</span>
            </div>

            {/* 2. Scholarships */}
            <div className="module-card">
              <div className="module-icon">🎓</div>
              <h3 className="module-title">Scholarships</h3>
              <p className="module-desc">
                Explore eligible educational grants, financial support, and application deadlines.
              </p>
              <span className="module-badge">Phase 2 Module</span>
            </div>

            {/* 3. Quizzes */}
            <div className="module-card">
              <div className="module-icon">📝</div>
              <h3 className="module-title">Quizzes</h3>
              <p className="module-desc">
                Interactive subject quizzes to test knowledge and earn performance badges.
              </p>
              <span className="module-badge">Phase 2 Module</span>
            </div>

            {/* 4. Doubts */}
            <div className="module-card">
              <div className="module-icon">💬</div>
              <h3 className="module-title">Doubts</h3>
              <p className="module-desc">
                Ask questions directly to verified mentors and receive step-by-step solutions.
              </p>
              <span className="module-badge">Phase 2 Module</span>
            </div>

            {/* 5. Progress */}
            <div className="module-card">
              <div className="module-icon">📊</div>
              <h3 className="module-title">Progress</h3>
              <p className="module-desc">
                Track learning statistics, quiz scores, and academic growth history.
              </p>
              <span className="module-badge">Phase 2 Module</span>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;
