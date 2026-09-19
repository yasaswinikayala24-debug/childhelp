import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MaterialCard from '../components/MaterialCard';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSort, setSelectedSort] = useState('Newest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [matRes, bookRes, progRes] = await Promise.allSettled([
        API.get('/api/materials'),
        API.get('/api/bookmarks'),
        API.get('/api/progress'),
      ]);

      if (matRes.status === 'fulfilled') {
        setMaterials(matRes.value.data);
      } else {
        setError('Unable to load study materials. Please check server connection.');
      }

      if (bookRes.status === 'fulfilled') {
        const bookmarkedIds = bookRes.value.data.map((b) => b.material?._id || b.material);
        setBookmarks(bookmarkedIds);
      }

      if (progRes.status === 'fulfilled') {
        const pMap = {};
        progRes.value.data.forEach((p) => {
          if (p.material) {
            const matId = p.material._id || p.material;
            pMap[matId] = p.completed;
          }
        });
        setProgressMap(pMap);
      }
    } catch (err) {
      console.error('Error loading materials page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (materialId) => {
    try {
      if (bookmarks.includes(materialId)) {
        await API.delete(`/api/bookmarks/${materialId}`);
        setBookmarks((prev) => prev.filter((id) => id !== materialId));
      } else {
        await API.post('/api/bookmarks', { materialId });
        setBookmarks((prev) => [...prev, materialId]);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedMaterials = materials
    .filter((m) => {
      // Title, Description, Keyword Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const inTitle = m.title.toLowerCase().includes(query);
        const inDesc = m.description.toLowerCase().includes(query);
        const inSubject = m.subject.toLowerCase().includes(query);
        const inKeywords = Array.isArray(m.keywords) && m.keywords.some((k) => k.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inSubject && !inKeywords) return false;
      }

      // Subject Filter
      if (selectedSubject !== 'All Subjects' && m.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }

      // Class Filter
      if (selectedClass !== 'All Classes') {
        const classNum = selectedClass.replace('Class ', '').trim();
        if (String(m.classLevel).trim() !== classNum) return false;
      }

      // Difficulty Filter
      if (selectedDifficulty !== 'All Levels' && m.difficulty !== selectedDifficulty) {
        return false;
      }

      // Type Filter
      if (selectedType !== 'All Types' && m.type !== selectedType) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (selectedSort === 'Shortest Learning Time') {
        return (a.estimatedTime || 15) - (b.estimatedTime || 15);
      }
      if (selectedSort === 'Longest Learning Time') {
        return (b.estimatedTime || 15) - (a.estimatedTime || 15);
      }
      if (selectedSort === 'Beginner Friendly') {
        const diffRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return (diffRank[a.difficulty] || 1) - (diffRank[b.difficulty] || 1);
      }
      // Default: Newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
            Smart Study Materials
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6366f1', fontWeight: '600' }}>
            Learn • Explore • Grow
          </p>
        </div>

        {/* Search, Filter & Sort Panel */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.6rem',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            marginBottom: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem',
            alignItems: 'end',
          }}
        >
          {/* Search */}
          <div style={{ gridColumn: 'span 2 minmax(200px, 1fr)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Search Materials
            </label>
            <input
              type="text"
              placeholder="Search Python, Algebra, Physics..."
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
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
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
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Class Level
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
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

          {/* Difficulty Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
              }}
            >
              <option value="All Levels">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Format Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Format Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
              }}
            >
              <option value="All Types">All Types</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">VIDEO</option>
              <option value="ARTICLE">ARTICLE</option>
              <option value="LINK">LINK</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                background: '#ffffff',
              }}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Shortest Learning Time">Shortest Time</option>
              <option value="Longest Learning Time">Longest Time</option>
              <option value="Beginner Friendly">Beginner Friendly</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#1e293b', fontWeight: '700' }}>
            {searchTerm ? `Search Results: "${searchTerm}"` : 'All Learning Resources'}
          </h2>
          <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '600' }}>
            {filteredAndSortedMaterials.length} materials found
          </span>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3>Loading study materials...</h3>
          </div>
        ) : filteredAndSortedMaterials.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              No learning resources found.
            </h3>
            <p style={{ color: '#64748b' }}>Try another search term or reset your filter criteria.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredAndSortedMaterials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                isBookmarked={bookmarks.includes(material._id)}
                isCompleted={!!progressMap[material._id]}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
