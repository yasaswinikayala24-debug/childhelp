import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MaterialCard from '../components/MaterialCard';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/api/materials');
      setMaterials(response.data);
      setFilteredMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Unable to load study materials. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Filter materials dynamically when search, subject, or class changes
  useEffect(() => {
    let result = [...materials];

    // Search by Title
    if (searchTerm.trim() !== '') {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Subject
    if (selectedSubject !== 'All Subjects') {
      result = result.filter(
        (m) => m.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Filter by Class
    if (selectedClass !== 'All Classes') {
      // Extract numeric string from 'Class 10' -> '10'
      const targetClassNum = selectedClass.replace('Class ', '').trim();
      result = result.filter(
        (m) => String(m.classLevel).trim() === targetClassNum
      );
    }

    setFilteredMaterials(result);
  }, [searchTerm, selectedSubject, selectedClass, materials]);

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
            Study Materials
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6366f1', fontWeight: '600' }}>
            Learn • Explore • Grow
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '1.2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search Bar */}
          <div style={{ flex: '2 min(100%, 300px)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Search Title
            </label>
            <input
              type="text"
              placeholder="Search study materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Subject Filter */}
          <div style={{ flex: '1 min(100%, 180px)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Programming">Programming</option>
              <option value="General Knowledge">General Knowledge</option>
            </select>
          </div>

          {/* Class Filter */}
          <div style={{ flex: '1 min(100%, 180px)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Class Level
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="All Classes">All Classes</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>
        </div>

        {/* Status Messaging */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '10px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3>Loading study materials...</h3>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              No study materials found.
            </h3>
            <p style={{ color: '#64748b' }}>
              Try adjusting your search query or subject/class filters.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredMaterials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
