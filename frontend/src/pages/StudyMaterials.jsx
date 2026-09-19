import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const subjectsList = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'Programming',
  'General Knowledge',
];

const classLevelsList = [
  'All Classes',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  useEffect(() => {
    fetchMaterials();
  }, [selectedSubject, selectedClass]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedSubject !== 'All Subjects') params.subject = selectedSubject;
      if (selectedClass !== 'All Classes') params.classLevel = selectedClass;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const response = await API.get('/materials', { params });
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Unable to load study materials. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'PDF':
        return 'badge-type-pdf';
      case 'VIDEO':
        return 'badge-type-video';
      case 'LINK':
        return 'badge-type-link';
      default:
        return 'badge-type-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'VIDEO':
        return '🎬';
      case 'LINK':
        return '🔗';
      default:
        return '📚';
    }
  };

  return (
    <main className="main-content">
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
          Study Materials
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>
          Learn. Explore. Grow.
        </p>
      </div>

      {/* Search & Filters Control Bar */}
      <div className="filter-card" style={{ marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search materials by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Filter Bar */}
        <div className="filter-bar" style={{ marginTop: '1.5rem' }}>
          {/* Subject Pills */}
          <div className="subject-pills">
            {subjectsList.map((subject) => (
              <button
                key={subject}
                type="button"
                className={`pill-btn ${selectedSubject === subject ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Class Filter Dropdown */}
          <div className="class-filter-wrapper">
            <label htmlFor="classSelect" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Grade / Class:
            </label>
            <select
              id="classSelect"
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 1rem' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classLevelsList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>Loading educational resources... 📚</h3>
        </div>
      ) : materials.length === 0 ? (
        /* Empty State */
        <div className="empty-state-card">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔎</div>
          <h3>No study materials found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Try adjusting your search terms or filter selections.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('All Subjects');
              setSelectedClass('All Classes');
            }}
            className="btn btn-outline"
            style={{ marginTop: '1.2rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Material Cards Grid */
        <div className="materials-grid">
          {materials.map((item) => (
            <div key={item._id} className="material-card">
              <div className="material-card-header">
                <span className={`material-type-badge ${getTypeBadgeClass(item.type)}`}>
                  {getTypeIcon(item.type)} {item.type}
                </span>
                <span className="class-badge">{item.classLevel}</span>
              </div>

              <h3 className="material-card-title">📚 {item.title}</h3>
              <div className="material-subject">Subject: <strong>{item.subject}</strong></div>
              <p className="material-card-desc">{item.description}</p>

              <div className="material-card-footer">
                <Link to={`/materials/${item._id}`} className="btn btn-primary btn-block">
                  View Material
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default StudyMaterials;
