import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';
import GoalCard from '../components/GoalCard';
import MaterialCard from '../components/MaterialCard';

const MyLearning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('in-progress'); // 'in-progress' | 'completed' | 'saved' | 'goals' | 'activity'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({
    totalMaterialsEnrolled: 0,
    completedMaterialsCount: 0,
    inProgressMaterialsCount: 0,
    overallProgressPercentage: 0,
  });
  const [studyStats, setStudyStats] = useState({
    totalStudyMinutes: 0,
    totalSessions: 0,
    streakDays: 0,
    recentSessions: [],
  });

  // Modal / Form state for goals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetHours: 5, targetDate: '' });
  const [goalSubmitting, setGoalSubmitting] = useState(false);

  useEffect(() => {
    fetchAllLearningData();
  }, []);

  const fetchAllLearningData = async () => {
    setLoading(true);
    setError('');
    try {
      const [progressRes, bookmarksRes, goalsRes, studyRes] = await Promise.all([
        API.get('/api/progress/all').catch(() => ({ data: { overallStats: {}, inProgress: [], completed: [] } })),
        API.get('/api/bookmarks').catch(() => ({ data: [] })),
        API.get('/api/goals').catch(() => ({ data: [] })),
        API.get('/api/study-sessions/user-stats').catch(() => ({ data: { totalStudyMinutes: 0, totalSessions: 0, streakDays: 0, recentSessions: [] } })),
      ]);

      if (progressRes.data) {
        setInProgress(progressRes.data.inProgress || []);
        setCompleted(progressRes.data.completed || []);
        if (progressRes.data.overallStats) {
          setStats(progressRes.data.overallStats);
        }
      }

      if (bookmarksRes.data) {
        // Extract material objects from bookmarks
        const materials = (bookmarksRes.data || []).map((b) => b.materialId).filter(Boolean);
        setSavedMaterials(materials);
      }

      if (goalsRes.data) {
        setGoals(goalsRes.data);
      }

      if (studyRes.data) {
        setStudyStats(studyRes.data);
      }
    } catch (err) {
      console.error('Error fetching My Learning data:', err);
      setError('Failed to load learning data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    setGoalSubmitting(true);
    try {
      const res = await API.post('/api/goals', newGoal);
      setGoals([res.data, ...goals]);
      setNewGoal({ title: '', targetHours: 5, targetDate: '' });
      setShowGoalModal(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
      alert('Failed to save learning goal.');
    } finally {
      setGoalSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await API.delete(`/api/goals/${goalId}`);
      setGoals(goals.filter((g) => g._id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const handleUpdateGoalStatus = async (goalId, isCompleted) => {
    try {
      const res = await API.put(`/api/goals/${goalId}`, { isCompleted });
      setGoals(goals.map((g) => (g._id === goalId ? res.data : g)));
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleBookmarkToggle = async (materialId) => {
    try {
      await API.delete(`/api/bookmarks/${materialId}`);
      setSavedMaterials(savedMaterials.filter((m) => m._id !== materialId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  const formatMinutes = (minutes) => {
    if (!minutes) return '0 mins';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} mins`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
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
            Phase 2 • Smart Learning Hub
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.3rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
            My Learning &amp; Progress
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
            Track your study courses, completion goals, reading notes, and learning streak.
          </p>
        </div>

        <button
          onClick={() => navigate('/materials')}
          className="btn"
          style={{
            background: '#ffffff',
            color: '#4f46e5',
            fontWeight: '700',
            padding: '0.75rem 1.6rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          🔍 Browse Materials
        </button>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '5px solid #6366f1' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            In Progress
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginTop: '0.25rem' }}>
            {stats.inProgressMaterialsCount || inProgress.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Active courses</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '5px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem' }}>
            {stats.completedMaterialsCount || completed.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Finished materials</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '5px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Learning Streak
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.25rem' }}>
            🔥 {studyStats.streakDays || 0} <span style={{ fontSize: '1rem', fontWeight: '600' }}>Days</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Keep it up!</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Study Time
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#8b5cf6', marginTop: '0.25rem' }}>
            ⏱️ {formatMinutes(studyStats.totalStudyMinutes)}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>
            {studyStats.totalSessions || 0} study sessions logged
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('in-progress')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            background: activeTab === 'in-progress' ? '#4f46e5' : '#f3f4f6',
            color: activeTab === 'in-progress' ? '#ffffff' : '#4b5563',
          }}
        >
          📖 In Progress ({inProgress.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            background: activeTab === 'completed' ? '#10b981' : '#f3f4f6',
            color: activeTab === 'completed' ? '#ffffff' : '#4b5563',
          }}
        >
          ✅ Completed ({completed.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            background: activeTab === 'saved' ? '#f59e0b' : '#f3f4f6',
            color: activeTab === 'saved' ? '#ffffff' : '#4b5563',
          }}
        >
          ⭐ Saved Bookmarks ({savedMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            background: activeTab === 'goals' ? '#8b5cf6' : '#f3f4f6',
            color: activeTab === 'goals' ? '#ffffff' : '#4b5563',
          }}
        >
          🎯 Learning Goals ({goals.length})
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            background: activeTab === 'activity' ? '#3b82f6' : '#f3f4f6',
            color: activeTab === 'activity' ? '#ffffff' : '#4b5563',
          }}
        >
          📊 Study Log
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Loading your learning hub...</h3>
        </div>
      ) : (
        <>
          {/* TAB 1: IN PROGRESS */}
          {activeTab === 'in-progress' && (
            <div>
              {inProgress.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#f9fafb',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No active materials in progress yet</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Start reading any study material to automatically track your progress here.
                  </p>
                  <button onClick={() => navigate('/materials')} className="btn btn-primary">
                    Browse Available Materials
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {inProgress.map((item) => {
                    const material = item.materialId || item;
                    return (
                      <div
                        key={item._id || material._id}
                        className="card"
                        style={{
                          borderRadius: '16px',
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
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
                              {material.subject}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                              ⏱️ {material.estimatedTime || 15} mins
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{material.title}</h3>
                          <p
                            style={{
                              fontSize: '0.88rem',
                              color: '#6b7280',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '1rem',
                            }}
                          >
                            {material.description}
                          </p>
                        </div>

                        <div>
                          <div style={{ marginBottom: '1rem' }}>
                            <ProgressBar progress={item.completionPercentage || 0} color="#4f46e5" />
                          </div>

                          <button
                            onClick={() => navigate(`/materials/${material._id}`)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px' }}
                          >
                            ▶️ Continue Learning
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLETED MATERIALS */}
          {activeTab === 'completed' && (
            <div>
              {completed.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#f9fafb',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No completed materials yet</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Finish 100% of a study topic to earn your completion badge!
                  </p>
                  <button onClick={() => navigate('/materials')} className="btn btn-primary">
                    Start Learning Now
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {completed.map((item) => {
                    const material = item.materialId || item;
                    return (
                      <div
                        key={item._id || material._id}
                        className="card"
                        style={{
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '2px solid #10b981',
                          background: '#f0fdf4',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span
                            style={{
                              background: '#d1fae5',
                              color: '#065f46',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                            }}
                          >
                            {material.subject}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
                            ✅ Completed
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#065f46' }}>
                          {material.title}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#4b5563', marginBottom: '1rem' }}>
                          {material.description}
                        </p>

                        <button
                          onClick={() => navigate(`/materials/${material._id}`)}
                          className="btn"
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '10px',
                            background: '#10b981',
                            color: '#ffffff',
                            fontWeight: '700',
                            border: 'none',
                          }}
                        >
                          📖 Review Material
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED BOOKMARKS */}
          {activeTab === 'saved' && (
            <div>
              {savedMaterials.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#f9fafb',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No bookmarked materials</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Click the star icon on any material card to save it for quick reference here.
                  </p>
                  <button onClick={() => navigate('/materials')} className="btn btn-primary">
                    Explore Materials
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {savedMaterials.map((material) => (
                    <MaterialCard
                      key={material._id}
                      material={material}
                      isBookmarked={true}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LEARNING GOALS */}
          {activeTab === 'goals' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Your Learning Goals</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    Set weekly or monthly target hours to keep your learning structured.
                  </p>
                </div>

                <button
                  onClick={() => setShowGoalModal(true)}
                  className="btn btn-primary"
                  style={{ borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: '700' }}
                >
                  ➕ Add New Goal
                </button>
              </div>

              {/* Goal Modal Form */}
              {showGoalModal && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '2px solid #8b5cf6',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)',
                  }}
                >
                  <h4 style={{ margin: '0 0 1rem 0', color: '#8b5cf6' }}>Create New Learning Goal</h4>
                  <form onSubmit={handleCreateGoal}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Goal Title / Target Subject
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Study Mathematics for 10 Hours this week"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Target Study Hours
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={newGoal.targetHours}
                          onChange={(e) => setNewGoal({ ...newGoal, targetHours: Number(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Target Target Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={newGoal.targetDate}
                          onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowGoalModal(false)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={goalSubmitting}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.2rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}
                      >
                        {goalSubmitting ? 'Saving...' : 'Save Goal'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {goals.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#f9fafb',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No goals defined yet</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Setting goals helps you stay consistent and build strong daily study habits.
                  </p>
                  <button onClick={() => setShowGoalModal(true)} className="btn btn-primary">
                    Create Your First Goal
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      onUpdate={handleUpdateGoalStatus}
                      onDelete={handleDeleteGoal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RECENT STUDY LOG / ACTIVITY */}
          {activeTab === 'activity' && (
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Recent Study Activity Log</h3>
              {studyStats.recentSessions && studyStats.recentSessions.length > 0 ? (
                <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280' }}>MATERIAL / TOPIC</th>
                        <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280' }}>SUBJECT</th>
                        <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280' }}>DURATION</th>
                        <th style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280' }}>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studyStats.recentSessions.map((session) => (
                        <tr key={session._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>
                            {session.materialId?.title || 'General Study'}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span
                              style={{
                                background: '#f3f4f6',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                              }}
                            >
                              {session.materialId?.subject || session.subject || 'General'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#4f46e5' }}>
                            ⏱️ {session.durationMinutes} mins
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6b7280' }}>
                            {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#f9fafb',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏱️</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No study sessions recorded yet</h3>
                  <p style={{ color: '#6b7280' }}>
                    Open any material page and use the live study session timer to automatically record your study time!
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default MyLearning;
