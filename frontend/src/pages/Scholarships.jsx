import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Scholarships = ({ user }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Admin Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScholarship, setNewScholarship] = useState({
    title: '',
    description: '',
    provider: '',
    eligibility: '',
    classLevel: 'All Classes',
    deadline: '',
    applicationUrl: '',
    category: 'General',
  });
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/api/scholarships');
      setScholarships(res.data || []);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      setError('Unable to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/api/scholarships', newScholarship);
      setScholarships([res.data, ...scholarships]);
      setShowAddModal(false);
      setNewScholarship({
        title: '',
        description: '',
        provider: '',
        eligibility: '',
        classLevel: 'All Classes',
        deadline: '',
        applicationUrl: '',
        category: 'General',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create scholarship');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScholarship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await API.delete(`/api/scholarships/${id}`);
      setScholarships(scholarships.filter((s) => s._id !== id));
    } catch (err) {
      alert('Error deleting scholarship');
    }
  };

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
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
            Financial Aid &amp; Opportunities
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.4rem', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>
            🎓 Educational Scholarships
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', margin: 0 }}>
            Discover grants, merit awards, and financial support opportunities for your academic journey.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#059669',
              fontWeight: '800',
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            + Add Scholarship
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 250px' }}>
          <input
            type="text"
            placeholder="Search by title, provider, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '700' }}>Category:</span>
          {['All', 'General', 'STEM', 'Need-Based'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: selectedCategory === cat ? '#10b981' : '#f3f4f6',
                color: selectedCategory === cat ? '#ffffff' : '#374151',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Loading scholarships...</h3>
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: '#f9fafb',
            borderRadius: '16px',
            border: '2px dashed #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <h3>No scholarships found</h3>
          <p style={{ color: '#6b7280' }}>Try broadening your search term or filter selection.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {filteredScholarships.map((s) => (
            <div
              key={s._id}
              className="card"
              style={{
                borderRadius: '18px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                    }}
                  >
                    {s.category}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: '700' }}>
                    📅 Deadline: {s.deadline}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: '800', color: '#111827' }}>
                  {s.title}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#059669', fontWeight: '700', marginBottom: '0.8rem' }}>
                  Provided by: {s.provider}
                </div>

                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {s.description}
                </p>

                <div
                  style={{
                    background: '#f9fafb',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    color: '#374151',
                    marginBottom: '1.5rem',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <strong>Eligibility:</strong> {s.eligibility}
                </div>
              </div>

              <div>
                <a
                  href={s.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.7rem',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    background: '#059669',
                    borderColor: '#059669',
                  }}
                >
                  🔗 Apply Official Link ↗
                </a>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteScholarship(s._id)}
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                    }}
                  >
                    Delete Scholarship
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Modal */}
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
              maxWidth: '550px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.25rem' }}>Add New Scholarship</h2>
            <form onSubmit={handleCreateScholarship}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Title</label>
                <input
                  type="text"
                  required
                  value={newScholarship.title}
                  onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Provider</label>
                <input
                  type="text"
                  required
                  value={newScholarship.provider}
                  onChange={(e) => setNewScholarship({ ...newScholarship, provider: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={newScholarship.description}
                  onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Eligibility</label>
                  <input
                    type="text"
                    required
                    value={newScholarship.eligibility}
                    onChange={(e) => setNewScholarship({ ...newScholarship, eligibility: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Deadline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Nov 2026"
                    value={newScholarship.deadline}
                    onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>Official Application URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newScholarship.applicationUrl}
                  onChange={(e) => setNewScholarship({ ...newScholarship, applicationUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ccc' }}
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
                  style={{ padding: '0.6rem 1.4rem', borderRadius: '8px', background: '#059669', borderColor: '#059669' }}
                >
                  {submitting ? 'Creating...' : 'Save Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Scholarships;
