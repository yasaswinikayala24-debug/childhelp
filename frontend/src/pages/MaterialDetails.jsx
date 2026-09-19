import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const MaterialDetails = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterialDetails();
  }, [id]);

  const fetchMaterialDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get(`/api/materials/${id}`);
      setMaterial(response.data);
    } catch (err) {
      console.error('Error fetching material details:', err);
      if (err.response && err.response.status === 404) {
        setError('Material not found');
      } else {
        setError('Failed to fetch material details. Please check server connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResource = () => {
    if (material && material.resourceUrl) {
      window.open(material.resourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Loading material details...</h2>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div style={{ maxWidth: '700px', margin: '4rem auto', padding: '2.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'Material not found'}</h2>
        <Link to="/materials" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Study Materials
        </Link>
      </div>
    );
  }

  const formattedDate = material.createdAt
    ? new Date(material.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link
          to="/materials"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6366f1',
            fontWeight: '600',
            textDecoration: 'none',
            marginBottom: '1.5rem',
          }}
        >
          ← Back to Study Materials
        </Link>

        {/* Card Container */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '3rem 2.5rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header Badge & Type */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: material.type === 'VIDEO' ? '#6366f1' : material.type === 'LINK' ? '#14b8a6' : '#ef4444',
                padding: '0.35rem 1rem',
                borderRadius: '50px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Format: {material.type || 'PDF'}
            </span>

            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              Uploaded: {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '1.2rem',
              lineHeight: '1.25',
            }}
          >
            {material.title}
          </h1>

          {/* Metadata Badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: '#4f46e5',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              📖 Subject: <strong>{material.subject}</strong>
            </div>

            <div
              style={{
                background: 'rgba(13, 148, 136, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: '#0d9488',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              🎓 Class: <strong>{material.classLevel}</strong>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '0.6rem', fontWeight: '700' }}>
              Description
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {material.description}
            </p>
          </div>

          {/* Open Resource CTA Button */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button
              onClick={handleOpenResource}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2.2rem',
                fontSize: '1.05rem',
                fontWeight: '700',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
              }}
            >
              🔗 Open Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
