import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';
import RecommendationCard from '../components/RecommendationCard';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Dashboard Stats
  const [materialsCount, setMaterialsCount] = useState(0);
  const [progressStats, setProgressStats] = useState({
    totalMaterialsEnrolled: 0,
    completedMaterialsCount: 0,
    inProgressMaterialsCount: 0,
    overallProgressPercentage: 0,
  });
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [studyStats, setStudyStats] = useState({
    totalStudyMinutes: 0,
    streakDays: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user profile
      const profileRes = await API.get('/api/auth/profile').catch((err) => {
        console.error('Failed profile fetch:', err);
        return null;
      });
      if (profileRes?.data) setProfile(profileRes.data);

      // 2. Fetch parallel dashboard analytics
      const [matRes, progRes, bkmkRes, studyRes, recRes] = await Promise.all([
        API.get('/api/materials').catch(() => ({ data: [] })),
        API.get('/api/progress/all').catch(() => ({ data: { overallStats: {}, inProgress: [] } })),
        API.get('/api/bookmarks').catch(() => ({ data: [] })),
        API.get('/api/study-sessions/user-stats').catch(() => ({ data: { totalStudyMinutes: 0, streakDays: 0 } })),
        API.get('/api/recommendations').catch(() => ({ data: [] })),
      ]);

      if (matRes.data) setMaterialsCount(matRes.data.length);

      if (progRes.data) {
        if (progRes.data.overallStats) setProgressStats(progRes.data.overallStats);
        if (progRes.data.inProgress) setRecentMaterials(progRes.data.inProgress.slice(0, 3));
      }

      if (bkmkRes.data) setBookmarksCount(bkmkRes.data.length);
      if (studyRes.data) setStudyStats(studyRes.data);
      if (recRes.data) setRecommendations(recRes.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setApiError('Notice: Could not load some live stats.');
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

  const formatStudyTime = (mins) => {
    if (!mins) return '0 hrs';
    const hrs = (mins / 60).toFixed(1);
    return `${hrs} hrs`;
  };

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Welcome & Overview Header */}
      <div className="dashboard-header" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', fontWeight: '800' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            Role: <strong style={{ color: 'var(--primary-color)' }}>{userRole}</strong> • Phase 2 Smart Student Hub
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/my-learning')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
          >
            📊 My Learning Hub
          </button>
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.6rem 1rem' }}>
            Logout
          </button>
        </div>
      </div>

      {apiError && <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>{apiError}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Loading smart dashboard metrics...</h3>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* 1. Study Materials Available */}
            <div
              className="card"
              style={{
                padding: '1.3rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                AVAILABLE MATERIALS
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {materialsCount}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Explore curated library
              </div>
            </div>

            {/* 2. Completed Courses */}
            <div
              className="card"
              style={{
                padding: '1.3rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                COMPLETED
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {progressStats.completedMaterialsCount || 0}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Finished study topics
              </div>
            </div>

            {/* 3. Learning Streak */}
            <div
              className="card"
              style={{
                padding: '1.3rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                LEARNING STREAK
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                🔥 {studyStats.streakDays || 0} <span style={{ fontSize: '1.1rem' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Active consecutive study
              </div>
            </div>

            {/* 4. Total Study Time */}
            <div
              className="card"
              style={{
                padding: '1.3rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase' }}>
                TOTAL STUDY TIME
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.2rem' }}>
                ⏱️ {formatStudyTime(studyStats.totalStudyMinutes)}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                Tracked reading hours
              </div>
            </div>
          </div>

          {/* Analytics & Quick Action Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Learning Analytics Card */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                borderRadius: '18px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>📊 Learning Analytics</h3>
                <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700' }}>
                  {progressStats.overallProgressPercentage || 0}% Overall Complete
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Mathematics &amp; Algebra</span>
                  <span>75%</span>
                </div>
                <ProgressBar progress={75} color="#6366f1" height={10} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Science &amp; Physics</span>
                  <span>60%</span>
                </div>
                <ProgressBar progress={60} color="#10b981" height={10} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>English Grammar &amp; Literature</span>
                  <span>90%</span>
                </div>
                <ProgressBar progress={90} color="#f59e0b" height={10} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Computer Science &amp; Coding</span>
                  <span>40%</span>
                </div>
                <ProgressBar progress={40} color="#8b5cf6" height={10} />
              </div>
            </div>

            {/* In Progress Quick Resume */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                borderRadius: '18px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>📖 Continue Learning</h3>
                  <Link to="/my-learning" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>
                    View All →
                  </Link>
                </div>

                {recentMaterials.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recentMaterials.map((item) => {
                      const mat = item.materialId || item;
                      return (
                        <div
                          key={item._id || mat._id}
                          style={{
                            background: '#f9fafb',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderLeft: '4px solid #4f46e5',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{mat.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                              {mat.subject} • {item.completionPercentage || 0}% Done
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/materials/${mat._id}`)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', borderRadius: '8px' }}
                          >
                            Resume
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                    <p style={{ margin: '0 0 1rem 0' }}>No active courses in progress right now.</p>
                    <button
                      onClick={() => navigate('/materials')}
                      className="btn btn-primary"
                      style={{ borderRadius: '10px', padding: '0.55rem 1.2rem' }}
                    >
                      Browse Available Materials
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => navigate('/my-learning')}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', fontWeight: '700' }}
                >
                  🚀 Open My Learning Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Widget Section */}
          {recommendations.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>✨ Recommended for You</h2>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    Personalized study recommendations based on your grade and subject interest.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/materials')}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  View All Materials
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {recommendations.map((item) => (
                  <RecommendationCard key={item._id} material={item} />
                ))}
              </div>
            </div>
          )}

          {/* Platform Modules */}
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800' }}>Platform Modules</h2>

          <div className="dashboard-grid">
            {/* 1. Study Materials (Active in Phase 2) */}
            <div className="module-card" style={{ border: '2px solid #6366f1' }}>
              <div className="module-icon">📚</div>
              <h3 className="module-title">Study Materials</h3>
              <p className="module-desc">
                Access curated textbooks, practice sheets, and interactive lessons across grade levels.
              </p>
              <button
                onClick={() => navigate('/materials')}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.55rem' }}
              >
                Explore Study Materials
              </button>
            </div>

            {/* 2. My Learning & Progress (Active in Phase 2) */}
            <div className="module-card" style={{ border: '2px solid #10b981' }}>
              <div className="module-icon">📊</div>
              <h3 className="module-title">My Learning Hub</h3>
              <p className="module-desc">
                Track learning streak, active study time, notes, goals, and saved bookmarks.
              </p>
              <button
                onClick={() => navigate('/my-learning')}
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
                  cursor: 'pointer',
                }}
              >
                Open Learning Hub
              </button>
            </div>

            {/* 3. Scholarships */}
            <div className="module-card">
              <div className="module-icon">🎓</div>
              <h3 className="module-title">Scholarships</h3>
              <p className="module-desc">
                Explore eligible educational grants, financial support, and application deadlines.
              </p>
              <span className="module-badge">Coming Soon (Phase 3)</span>
            </div>

            {/* 4. Quizzes */}
            <div className="module-card">
              <div className="module-icon">📝</div>
              <h3 className="module-title">Quizzes</h3>
              <p className="module-desc">
                Interactive subject quizzes to test knowledge and earn performance badges.
              </p>
              <span className="module-badge">Coming Soon (Phase 3)</span>
            </div>

            {/* 5. Doubts & Mentorship */}
            <div className="module-card">
              <div className="module-icon">💬</div>
              <h3 className="module-title">Doubts</h3>
              <p className="module-desc">
                Ask questions directly to verified mentors and receive step-by-step solutions.
              </p>
              <span className="module-badge">Coming Soon (Phase 3)</span>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;
