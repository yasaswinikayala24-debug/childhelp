import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  const [materialCount, setMaterialCount] = useState(0);
  const [loading, setLoading] = useState(!user);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch user profile from protected endpoint
        const profileRes = await API.get('/auth/profile');
        setProfile(profileRes.data);

        // 2. Fetch materials count
        const materialsRes = await API.get('/materials');
        if (Array.isArray(materialsRes.data)) {
          setMaterialCount(materialsRes.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch protected profile or dashboard data:', err);
        setApiError('Session expired or invalid token. Please log in again.');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const userName = profile?.name || 'Student';
  const userRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student';

  return (
    <main className="main-content">
      {/* Welcome Banner */}
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            Welcome to ChildHelp 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Hello, <strong style={{ color: 'var(--text-primary)' }}>{userName}</strong>! | Role:{' '}
            <strong style={{ color: 'var(--primary-color)' }}>{userRole}</strong>
          </p>
        </div>

        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {apiError && <div className="alert alert-danger">{apiError}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Loading dashboard profile... ⏳</h3>
        </div>
      ) : (
        <>
          {/* Dashboard Quick Actions Bar */}
          <div className="dashboard-action-banner" style={{ marginBottom: '2.5rem' }}>
            <div className="banner-content">
              <h2>Ready to Learn & Explore? 🚀</h2>
              <p>Discover high-quality study materials, practice workbooks, and video tutorials.</p>
            </div>
            <div className="banner-buttons">
              <Link to="/materials" className="btn btn-primary btn-lg">
                📚 Study Materials
              </Link>
              <Link to="/materials" className="btn btn-secondary btn-lg">
                ▶️ Continue Learning
              </Link>
            </div>
          </div>

          {/* Learning Statistics Grid */}
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Learning Statistics & Dashboard</h2>

          <div className="dashboard-grid">
            {/* 1. Available Materials */}
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                📚
              </div>
              <div className="stat-info">
                <div className="stat-value">{materialCount}</div>
                <div className="stat-label">Available Materials</div>
              </div>
              <Link to="/materials" className="stat-link">
                Explore All →
              </Link>
            </div>

            {/* 2. Completed Materials */}
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                ✅
              </div>
              <div className="stat-info">
                <div className="stat-value">3</div>
                <div className="stat-label">Completed Materials</div>
              </div>
              <span className="stat-badge">Phase 2 Active</span>
            </div>

            {/* 3. Saved Materials */}
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                🔖
              </div>
              <div className="stat-info">
                <div className="stat-value">5</div>
                <div className="stat-label">Saved Materials</div>
              </div>
              <span className="stat-badge">Bookmarked</span>
            </div>

            {/* 4. Learning Progress */}
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                📊
              </div>
              <div className="stat-info">
                <div className="stat-value">78%</div>
                <div className="stat-label">Learning Progress</div>
              </div>
              <span className="stat-badge">On Track</span>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;
