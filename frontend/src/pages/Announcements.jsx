import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/api/announcements');
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Unable to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/api/announcements', {
        title: title.trim(),
        message: message.trim(),
        category,
      });
      setAnnouncements([res.data, ...announcements]);
      setTitle('');
      setMessage('');
      setShowAddModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await API.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  return (
    <main className="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(124, 58, 237, 0.25)',
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
            Platform Updates &amp; Notices
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
            📢 Official Announcements
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
            Stay updated with academic notices, new feature releases, and scholarship deadlines.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#7c3aed',
              fontWeight: '800',
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            + Post Announcement
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Feed List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Loading announcements...</h3>
        </div>
      ) : announcements.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            background: '#f9fafb',
            borderRadius: '16px',
            border: '2px dashed #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📢</div>
          <h3>No announcements posted yet</h3>
          <p style={{ color: '#6b7280' }}>Check back soon for new updates.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {announcements.map((a) => (
            <div
              key={a._id}
              className="card"
              style={{
                borderRadius: '18px',
                padding: '1.75rem',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    background: '#f3e8ff',
                    color: '#6b21a8',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                  }}
                >
                  {a.category}
                </span>

                <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.6rem', color: '#111827' }}>
                {a.title}
              </h3>

              <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-line' }}>
                {a.message}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '600' }}>
                  Posted by <strong>{a.authorName || 'ChildHelp Team'}</strong>
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteAnnouncement(a._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Modal */}
      {showAddModal && (
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
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem' }}>Post New Announcement</h2>
            <form onSubmit={handleCreateAnnouncement}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="System">System Update</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.4rem', borderRadius: '8px', background: '#7c3aed', borderColor: '#7c3aed' }}
                >
                  {submitting ? 'Posting...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Announcements;
