import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="main-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          padding: '3.5rem 2rem',
          borderRadius: '24px',
          textAlign: 'center',
          marginBottom: '3rem',
          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.3)',
        }}
      >
        <span
          style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '0.4rem 1.2rem',
            borderRadius: '20px',
            fontSize: '0.88rem',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1rem',
          }}
        >
          Educational Support Platform
        </span>
        <h1 style={{ color: '#ffffff', fontSize: '2.8rem', fontWeight: '800', marginBottom: '1rem' }}>
          About ChildHelp
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            maxWidth: '750px',
            margin: '0 auto',
            opacity: 0.95,
            fontWeight: '500',
            lineHeight: 1.6,
          }}
        >
          Empowering children with education, support and opportunities.
        </p>
      </section>

      {/* 2. About ChildHelp & Our Mission */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        <div
          className="card"
          style={{
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌱</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: '800' }}>About ChildHelp</h2>
          <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            ChildHelp is a platform designed to help children access educational resources, learning support, and opportunities in one place.
          </p>
        </div>

        <div
          className="card"
          style={{
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: '800' }}>Our Mission</h2>
          <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            ChildHelp aims to make educational resources easier to discover and access for students from all backgrounds, fostering continuous academic growth and self-empowerment.
          </p>
        </div>
      </section>

      {/* 3. What ChildHelp Provides */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>What ChildHelp Provides</h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
            Comprehensive core features designed for holistic student success.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Study Materials */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: '18px',
              border: '2px solid #6366f1',
              background: '#f5f3ff',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📚</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Study Materials</h3>
              <span style={{ background: '#6366f1', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                Active (Phase 2)
              </span>
            </div>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Access useful educational resources in one place.
            </p>
          </div>

          {/* Card 2: Learning Support */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🎯</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Learning Support</h3>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                Upcoming
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Help students improve their learning and track their progress.
            </p>
          </div>

          {/* Card 3: Opportunities */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🎓</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Opportunities</h3>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                Upcoming
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Provide access to educational opportunities such as scholarships and programs.
            </p>
          </div>

          {/* Card 4: Mentor Support */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>👨‍🏫</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Mentor Support</h3>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                Upcoming
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Allow students to receive academic guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Why ChildHelp? Problem Statement */}
      <section
        style={{
          background: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          marginBottom: '3.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#111827' }}>
          Why ChildHelp?
        </h2>
        <blockquote
          style={{
            margin: 0,
            paddingLeft: '1.5rem',
            borderLeft: '4px solid #6366f1',
            color: '#4b5563',
            fontSize: '1.15rem',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          "Students often need to search multiple platforms to find study materials, educational opportunities, and academic support. ChildHelp aims to bring these resources together in one simple platform."
        </blockquote>
      </section>

      {/* 5. Future Vision */}
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>Future Vision</h2>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            padding: '2.5rem 1.5rem',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            boxShadow: '0 10px 30px rgba(30, 27, 75, 0.3)',
            width: '100%',
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem 1.5rem', borderRadius: '14px', fontWeight: '700', fontSize: '1.2rem' }}>
            📖 Learning
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#818cf8' }}>+</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem 1.5rem', borderRadius: '14px', fontWeight: '700', fontSize: '1.2rem' }}>
            🎯 Support
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#818cf8' }}>+</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem 1.5rem', borderRadius: '14px', fontWeight: '700', fontSize: '1.2rem' }}>
            🎓 Opportunities
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>=</div>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '1rem 2rem', borderRadius: '14px', fontWeight: '800', fontSize: '1.4rem' }}>
            🌱 ChildHelp
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
