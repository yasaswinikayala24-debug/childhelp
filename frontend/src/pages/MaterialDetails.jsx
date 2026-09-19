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
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/materials/${id}`);
      setMaterial(response.data);
    } catch (err) {
      console.error('Error fetching material details:', err);
      const msg = err.response?.data?.message || 'Failed to load material details or material does not exist.';
      setError(msg);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="main-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/materials" className="btn btn-outline" style={{ padding: '0.45rem 1rem' }}>
          ← Back to Study Materials
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>Loading resource details... 📖</h3>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>{error}</h3>
          <Link to="/materials" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Materials Explorer
          </Link>
        </div>
      ) : (
        <div className="details-card">
          <div className="details-header">
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span className={`material-type-badge ${getTypeBadgeClass(material.type)}`}>
                {getTypeIcon(material.type)} {material.type}
              </span>
              <span className="class-badge">{material.classLevel}</span>
            </div>

            <h1 className="details-title">📚 {material.title}</h1>

            <div className="details-meta">
              <div>
                Subject: <strong>{material.subject}</strong>
              </div>
              <div>
                Class / Grade: <strong>{material.classLevel}</strong>
              </div>
              <div>
                Uploaded Date: <strong>{formatDate(material.createdAt)}</strong>
              </div>
              {material.uploadedBy && (
                <div>
                  Uploaded By: <strong>{material.uploadedBy.name} ({material.uploadedBy.role})</strong>
                </div>
              )}
            </div>
          </div>

          <div className="details-body">
            <h3 style={{ marginBottom: '0.8rem', fontSize: '1.2rem' }}>About this Material</h3>
            <p className="details-desc">{material.description}</p>
          </div>

          <div className="details-action-box">
            <a
              href={material.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              Open Resource 🚀
            </a>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              (Opens in a new browser window/tab)
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default MaterialDetails;
