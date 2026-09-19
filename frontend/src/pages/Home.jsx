import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div className="landing-wrapper" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      {/* Hero Section matching screenshot */}
      <Hero />

      {/* Feature Showcase Section */}
      <main className="main-content" style={{ paddingBottom: '5rem' }}>
        <section className="features-section" id="about">
          <div className="section-header">
            <h2 className="section-title" style={{ color: '#0f172a' }}>Core Pillars of Support</h2>
            <p className="section-subtitle" style={{ color: '#64748b' }}>
              Designed specifically to nurture every child's potential with structured guidance and rich learning resources.
            </p>
          </div>

          <div className="features-grid">
            {/* 1. Free Learning Resources */}
            <div className="feature-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="feature-icon">📚</div>
              <h3 className="feature-title" style={{ color: '#0f172a' }}>Free Learning Resources</h3>
              <p className="feature-desc" style={{ color: '#64748b' }}>
                Comprehensive study materials, interactive guides, and subject workbooks tailored to build strong academic foundations.
              </p>
            </div>

            {/* 2. Scholarship Support */}
            <div className="feature-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="feature-icon">🎓</div>
              <h3 className="feature-title" style={{ color: '#0f172a' }}>Scholarship Support</h3>
              <p className="feature-desc" style={{ color: '#64748b' }}>
                Verified financial aid opportunities and scholarship programs to help deserving students continue their education without barrier.
              </p>
            </div>

            {/* 3. Mentor Support */}
            <div className="feature-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="feature-icon">💬</div>
              <h3 className="feature-title" style={{ color: '#0f172a' }}>Mentor Support</h3>
              <p className="feature-desc" style={{ color: '#64748b' }}>
                Direct access to passionate educators and mentors ready to clear doubts, offer guidance, and foster academic growth.
              </p>
            </div>

            {/* 4. Learning Progress */}
            <div className="feature-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="feature-icon">📊</div>
              <h3 className="feature-title" style={{ color: '#0f172a' }}>Learning Progress</h3>
              <p className="feature-desc" style={{ color: '#64748b' }}>
                Track learning milestones, complete practice quizzes, and visualize individual progress over time for continuous growth.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
