import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import ProgressBar from '../components/ProgressBar';

const MaterialDetails = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState({ progressPercentage: 0, completed: false, timeSpent: 0 });
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [secondsSpent, setSecondsSpent] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterialDetails();
    startStudySession();

    // Timer for active study session
    const timerInterval = setInterval(() => {
      setSecondsSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      endStudySession();
    };
  }, [id]);

  const fetchMaterialDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const [matRes, bookRes, progRes, noteRes] = await Promise.allSettled([
        API.get(`/api/materials/${id}`),
        API.get('/api/bookmarks'),
        API.get(`/api/progress/${id}`),
        API.get(`/api/notes/${id}`),
      ]);

      if (matRes.status === 'fulfilled') {
        setMaterial(matRes.value.data);
      } else {
        setError('Material not found');
      }

      if (bookRes.status === 'fulfilled') {
        const bookmarkedIds = bookRes.value.data.map((b) => b.material?._id || b.material);
        setIsBookmarked(bookmarkedIds.includes(id));
      }

      if (progRes.status === 'fulfilled' && progRes.value.data) {
        setProgress(progRes.value.data);
      }

      if (noteRes.status === 'fulfilled') {
        setNotes(noteRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching material details:', err);
    } finally {
      setLoading(false);
    }
  };

  const startStudySession = async () => {
    try {
      const res = await API.post('/api/study-sessions/start', { materialId: id });
      if (res.data && res.data._id) {
        setSessionId(res.data._id);
      }
    } catch (err) {
      console.error('Error starting session:', err);
    }
  };

  const endStudySession = async () => {
    try {
      await API.post('/api/study-sessions/end', {
        sessionId,
        durationSeconds: secondsSpent,
      });
    } catch (err) {
      console.error('Error ending session:', err);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await API.delete(`/api/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await API.post('/api/bookmarks', { materialId: id });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleUpdateProgress = async (newPercentage) => {
    try {
      const res = await API.put(`/api/progress/${id}`, {
        progressPercentage: newPercentage,
        timeSpent: secondsSpent,
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const res = await API.post('/api/notes', {
        materialId: id,
        content: newNoteContent.trim(),
      });
      setNotes([res.data, ...notes]);
      setNewNoteContent('');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await API.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleOpenResource = () => {
    if (material && material.resourceUrl) {
      // Mark as 100% completed when opened
      handleUpdateProgress(100);
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
        <Link to="/materials" className="btn btn-primary">
          Back to Study Materials
        </Link>
      </div>
    );
  }

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Navigation Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link
            to="/materials"
            style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none', fontSize: '1rem' }}
          >
            ← Back to Study Materials
          </Link>

          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', background: '#ffffff', padding: '0.4rem 0.9rem', borderRadius: '50px', border: '1px solid #e2e8f0' }}>
            ⏱ Active Study Timer: {formatTimer(secondsSpent)}
          </span>
        </div>

        {/* Main Content Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '3rem 2.5rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#6366f1', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
                {material.type || 'PDF'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0d9488', background: 'rgba(13, 148, 136, 0.12)', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
                {material.difficulty || 'Beginner'}
              </span>
            </div>

            <button
              onClick={handleToggleBookmark}
              className="btn btn-outline"
              style={{ borderColor: isBookmarked ? '#6366f1' : '#cbd5e1', color: isBookmarked ? '#6366f1' : '#64748b' }}
            >
              {isBookmarked ? '🔖 Saved' : '📑 Save Material'}
            </button>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', lineHeight: '1.25' }}>
            {material.title}
          </h1>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4f46e5', background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem 0.9rem', borderRadius: '8px' }}>
              Subject: {material.subject}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0d9488', background: 'rgba(13, 148, 136, 0.1)', padding: '0.4rem 0.9rem', borderRadius: '8px' }}>
              Class: {material.classLevel}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569', background: '#f1f5f9', padding: '0.4rem 0.9rem', borderRadius: '8px' }}>
              ⏱ Est. Time: {material.estimatedTime || 15} minutes
            </span>
          </div>

          {/* Progress Tracker Widget */}
          <div style={{ background: '#f8fafc', padding: '1.4rem 1.8rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <ProgressBar percentage={progress.progressPercentage} color="#6366f1" />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleUpdateProgress(progress.progressPercentage >= 100 ? 0 : 100)}
                className="btn"
                style={{
                  background: progress.completed ? '#10b981' : '#6366f1',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                }}
              >
                {progress.completed ? '✓ Completed (Click to Reset)' : 'Start / Mark as Completed'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.6rem', fontWeight: '700' }}>
              Description
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7' }}>
              {material.description}
            </p>
          </div>

          {/* Learning Objectives */}
          <div style={{ marginBottom: '2.5rem', background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#4f46e5', marginBottom: '0.8rem', fontWeight: '700' }}>
              🎯 Learning Objectives
            </h3>
            <ul style={{ paddingLeft: '1.4rem', color: '#334155', lineHeight: '1.7', fontSize: '0.98rem' }}>
              <li>Understand fundamental concepts of {material.subject}</li>
              <li>Apply key principles to practical problem solving</li>
              <li>Complete practice exercises and test your knowledge</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '1.8rem' }}>
            <button
              onClick={handleOpenResource}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: '700', borderRadius: '12px' }}
            >
              🚀 Start Learning / Open Resource
            </button>
          </div>
        </div>

        {/* Personal Notes Section */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem' }}>
            📝 My Notes
          </h2>

          <form onSubmit={handleAddNote} style={{ marginBottom: '2rem' }}>
            <textarea
              placeholder="Write your study notes here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.98rem',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: '0.8rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ fontWeight: '600' }}>
              Save Note
            </button>
          </form>

          {/* Saved Notes List */}
          {notes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>No personal notes saved for this material yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notes.map((note) => (
                <div
                  key={note._id}
                  style={{
                    background: '#f8fafc',
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: '1.6', margin: '0 0 0.5rem 0', whiteSpace: 'pre-line' }}>
                      {note.content}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
