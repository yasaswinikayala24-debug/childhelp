import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Form inputs
  const [materialForm, setMaterialForm] = useState({
    title: '', description: '', subject: 'Mathematics', classLevel: '10', type: 'PDF', resourceUrl: ''
  });

  const [scholarshipForm, setScholarshipForm] = useState({
    title: '', description: '', provider: '', eligibility: '', classLevel: 'All Classes', deadline: '', applicationUrl: '', category: 'STEM'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '', message: '', category: 'General'
  });

  const [quizForm, setQuizForm] = useState({
    title: '', description: '', subject: 'Mathematics', classLevel: '10',
    questions: [
      { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const matRes = await api.get('/materials');
      setMaterials(matRes.data);

      const quizRes = await api.get('/quizzes');
      setQuizzes(quizRes.data);

      const schRes = await api.get('/scholarships');
      setScholarships(schRes.data);

      const annRes = await api.get('/announcements');
      setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setSuccessMsg(`User role updated to ${newRole}`);
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccessMsg('User deleted successfully');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Create Material
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materials', materialForm);
      setSuccessMsg('Material created successfully');
      setIsMaterialModalOpen(false);
      setMaterialForm({ title: '', description: '', subject: 'Mathematics', classLevel: '10', type: 'PDF', resourceUrl: '' });
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create material');
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Delete this study material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      setSuccessMsg('Material deleted');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete material');
    }
  };

  // Create Scholarship
  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scholarships', scholarshipForm);
      setSuccessMsg('Scholarship published successfully');
      setIsScholarshipModalOpen(false);
      setScholarshipForm({ title: '', description: '', provider: '', eligibility: '', classLevel: 'All Classes', deadline: '', applicationUrl: '', category: 'STEM' });
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create scholarship');
    }
  };

  const handleDeleteScholarship = async (id) => {
    if (!window.confirm('Delete this scholarship opportunity?')) return;
    try {
      await api.delete(`/scholarships/${id}`);
      setSuccessMsg('Scholarship deleted');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete scholarship');
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', announcementForm);
      setSuccessMsg('Announcement published');
      setIsAnnouncementModalOpen(false);
      setAnnouncementForm({ title: '', message: '', category: 'General' });
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setSuccessMsg('Announcement deleted');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  // Create Quiz
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', quizForm);
      setSuccessMsg('Quiz created successfully');
      setIsQuizModalOpen(false);
      setQuizForm({
        title: '', description: '', subject: 'Mathematics', classLevel: '10',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]
      });
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      setSuccessMsg('Quiz deleted');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  if (loading) return <Loading message="Loading Admin Dashboard..." />;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1a202c', margin: 0 }}>⚙️ Admin Control Panel</h1>
          <p style={{ color: '#718096', marginTop: '0.25rem' }}>Manage users, content, quizzes, scholarships, and announcements.</p>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>Admin Role Authorized</span>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div style={{ backgroundColor: '#f0fff4', color: '#276749', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #c6f6d5' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: '📊 Statistics' },
          { id: 'users', label: `👥 Users (${users.length})` },
          { id: 'materials', label: `📚 Materials (${materials.length})` },
          { id: 'quizzes', label: `🧩 Quizzes (${quizzes.length})` },
          { id: 'scholarships', label: `🎓 Scholarships (${scholarships.length})` },
          { id: 'announcements', label: `📢 Announcements (${announcements.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #3182ce' : '3px solid transparent',
              color: activeTab === tab.id ? '#3182ce' : '#4a5568',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <Card style={{ backgroundColor: '#ebf8ff', borderColor: '#bee3f8' }}>
              <div style={{ fontSize: '2rem' }}>👨‍🎓</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#2b6cb0' }}>{stats.users.students}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Registered Students</p>
            </Card>

            <Card style={{ backgroundColor: '#f0fff4', borderColor: '#c6f6d5' }}>
              <div style={{ fontSize: '2rem' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#276749' }}>{stats.users.mentors}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Active Mentors</p>
            </Card>

            <Card style={{ backgroundColor: '#faf5ff', borderColor: '#e9d8fd' }}>
              <div style={{ fontSize: '2rem' }}>📚</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#6b46c1' }}>{stats.content.materials}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Study Materials</p>
            </Card>

            <Card style={{ backgroundColor: '#fffaf0', borderColor: '#feebc8' }}>
              <div style={{ fontSize: '2rem' }}>🧩</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#c05621' }}>{stats.content.quizzes}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Active Quizzes</p>
            </Card>

            <Card style={{ backgroundColor: '#fff5f5', borderColor: '#fed7d7' }}>
              <div style={{ fontSize: '2rem' }}>📝</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#9b2c2c' }}>{stats.quizzes.attempts}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Total Quiz Attempts</p>
            </Card>

            <Card style={{ backgroundColor: '#ebf8ff', borderColor: '#bee3f8' }}>
              <div style={{ fontSize: '2rem' }}>❓</div>
              <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0 0', color: '#2b6cb0' }}>{stats.questions.total}</h3>
              <p style={{ color: '#4a5568', margin: 0, fontWeight: 500 }}>Doubts ({stats.questions.pending} Pending)</p>
            </Card>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <Card>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#2d3748' }}>Manage System Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Current Role</th>
                  <th style={{ padding: '0.75rem' }}>Change Role</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: '#4a5568' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'mentor' ? 'badge-success' : ''}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                      >
                        <option value="student">student</option>
                        <option value="mentor">mentor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Button variant="danger" size="small" onClick={() => handleDeleteUser(u._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Study Materials ({materials.length})</h2>
            <Button onClick={() => setIsMaterialModalOpen(true)}>+ Add New Material</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {materials.map((mat) => (
              <Card key={mat._id}>
                <h3>{mat.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>{mat.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', margin: '0.75rem 0' }}>
                  <span className="badge">{mat.subject}</span>
                  <span className="badge">Class {mat.classLevel}</span>
                  <span className="badge">{mat.type}</span>
                </div>
                <Button variant="danger" size="small" onClick={() => handleDeleteMaterial(mat._id)}>
                  Delete Material
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Quizzes ({quizzes.length})</h2>
            <Button onClick={() => setIsQuizModalOpen(true)}>+ Add New Quiz</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {quizzes.map((q) => (
              <Card key={q._id}>
                <h3>{q.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>{q.description}</p>
                <p><strong>Questions:</strong> {q.questions?.length || 0}</p>
                <Button variant="danger" size="small" onClick={() => handleDeleteQuiz(q._id)}>
                  Delete Quiz
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SCHOLARSHIPS TAB */}
      {activeTab === 'scholarships' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Scholarships ({scholarships.length})</h2>
            <Button onClick={() => setIsScholarshipModalOpen(true)}>+ Add Scholarship</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {scholarships.map((sch) => (
              <Card key={sch._id}>
                <h3>{sch.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>{sch.description}</p>
                <p><strong>Deadline:</strong> {sch.deadline}</p>
                <Button variant="danger" size="small" onClick={() => handleDeleteScholarship(sch._id)}>
                  Delete Opportunity
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>Announcements ({announcements.length})</h2>
            <Button onClick={() => setIsAnnouncementModalOpen(true)}>+ Post Announcement</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {announcements.map((ann) => (
              <Card key={ann._id}>
                <h3>{ann.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>{ann.message}</p>
                <Button variant="danger" size="small" onClick={() => handleDeleteAnnouncement(ann._id)}>
                  Delete Announcement
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ADD MATERIAL MODAL */}
      <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title="Create Study Material">
        <form onSubmit={handleCreateMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={materialForm.title}
              onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Description</label>
            <textarea
              required
              rows={3}
              className="form-control"
              value={materialForm.description}
              onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Subject</label>
              <input
                type="text"
                required
                className="form-control"
                value={materialForm.subject}
                onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Class Level</label>
              <input
                type="text"
                required
                className="form-control"
                value={materialForm.classLevel}
                onChange={(e) => setMaterialForm({ ...materialForm, classLevel: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Type</label>
              <select
                className="form-control"
                value={materialForm.type}
                onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
              >
                <option value="PDF">PDF Document</option>
                <option value="VIDEO">Video Lesson</option>
                <option value="LINK">External Link / Web Article</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Resource URL</label>
              <input
                type="url"
                required
                className="form-control"
                value={materialForm.resourceUrl}
                onChange={(e) => setMaterialForm({ ...materialForm, resourceUrl: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" style={{ marginTop: '0.5rem' }}>Save & Publish Material</Button>
        </form>
      </Modal>

      {/* ADD SCHOLARSHIP MODAL */}
      <Modal isOpen={isScholarshipModalOpen} onClose={() => setIsScholarshipModalOpen(false)} title="Publish Scholarship Opportunity">
        <form onSubmit={handleCreateScholarship} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={scholarshipForm.title}
              onChange={(e) => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Description</label>
            <textarea
              required
              rows={3}
              className="form-control"
              value={scholarshipForm.description}
              onChange={(e) => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Provider</label>
              <input
                type="text"
                required
                className="form-control"
                value={scholarshipForm.provider}
                onChange={(e) => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Deadline</label>
              <input
                type="text"
                required
                placeholder="e.g. 15 Dec 2026"
                className="form-control"
                value={scholarshipForm.deadline}
                onChange={(e) => setScholarshipForm({ ...scholarshipForm, deadline: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Eligibility Criteria</label>
            <input
              type="text"
              required
              className="form-control"
              value={scholarshipForm.eligibility}
              onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibility: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Official Application URL</label>
            <input
              type="url"
              required
              className="form-control"
              value={scholarshipForm.applicationUrl}
              onChange={(e) => setScholarshipForm({ ...scholarshipForm, applicationUrl: e.target.value })}
            />
          </div>
          <Button type="submit">Publish Scholarship</Button>
        </form>
      </Modal>

      {/* ADD ANNOUNCEMENT MODAL */}
      <Modal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} title="Create Platform Announcement">
        <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Message</label>
            <textarea
              required
              rows={4}
              className="form-control"
              value={announcementForm.message}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
            />
          </div>
          <Button type="submit">Broadcast Announcement</Button>
        </form>
      </Modal>

      {/* ADD QUIZ MODAL */}
      <Modal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} title="Create Quiz">
        <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Quiz Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Description</label>
            <textarea
              required
              rows={2}
              className="form-control"
              value={quizForm.description}
              onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Subject</label>
              <input
                type="text"
                required
                className="form-control"
                value={quizForm.subject}
                onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Class Level</label>
              <input
                type="text"
                required
                className="form-control"
                value={quizForm.classLevel}
                onChange={(e) => setQuizForm({ ...quizForm, classLevel: e.target.value })}
              />
            </div>
          </div>

          <h4 style={{ margin: '0.5rem 0 0.25rem 0' }}>First Question Details:</h4>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Question Text</label>
            <input
              type="text"
              required
              className="form-control"
              value={quizForm.questions[0].questionText}
              onChange={(e) => {
                const updatedQ = [...quizForm.questions];
                updatedQ[0].questionText = e.target.value;
                setQuizForm({ ...quizForm, questions: updatedQ });
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Option A</label>
            <input
              type="text"
              required
              className="form-control"
              value={quizForm.questions[0].options[0]}
              onChange={(e) => {
                const updatedQ = [...quizForm.questions];
                updatedQ[0].options[0] = e.target.value;
                setQuizForm({ ...quizForm, questions: updatedQ });
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Option B</label>
            <input
              type="text"
              required
              className="form-control"
              value={quizForm.questions[0].options[1]}
              onChange={(e) => {
                const updatedQ = [...quizForm.questions];
                updatedQ[0].options[1] = e.target.value;
                setQuizForm({ ...quizForm, questions: updatedQ });
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Correct Answer (Must match one option exactly)</label>
            <input
              type="text"
              required
              className="form-control"
              value={quizForm.questions[0].correctAnswer}
              onChange={(e) => {
                const updatedQ = [...quizForm.questions];
                updatedQ[0].correctAnswer = e.target.value;
                setQuizForm({ ...quizForm, questions: updatedQ });
              }}
            />
          </div>
          <Button type="submit">Save & Create Quiz</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
