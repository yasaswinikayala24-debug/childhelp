import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <span className="hero-badge">🎓 Educational Empowerment Platform</span>
          <h1 className="hero-title">One Platform for Children's Education & Support</h1>
          <p className="hero-subtitle">
            ChildHelp bridges the gap between eager young learners and quality educational opportunities. Access free learning materials, discover scholarships, and connect with dedicated mentors.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.85rem 1.8rem' }}>
              Member Login
            </Link>
          </div>
        </div>

        <div className="hero-card-illustration">
          <div className="illustration-icon">🚀</div>
          <h2>Bright Futures Start Here</h2>
          <p style={{ marginTop: '0.8rem', opacity: 0.9 }}>
            Join thousands of students and mentors creating a brighter educational ecosystem together.
          </p>
        </div>
      </section>

      {/* About & Feature Showcase Sections */}
      <section className="features-section" id="about">
        <div className="section-header">
          <h2 className="section-title">Core Pillars of Support</h2>
          <p className="section-subtitle">
            Designed specifically to nurture every child's potential with structured guidance and rich learning resources.
          </p>
        </div>

        <div className="features-grid">
          {/* 1. Free Learning Resources */}
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Free Learning Resources</h3>
            <p className="feature-desc">
              Comprehensive study materials, interactive guides, and subject workbooks tailored to build strong academic foundations.
            </p>
          </div>

          {/* 2. Scholarship Support */}
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3 className="feature-title">Scholarship Support</h3>
            <p className="feature-desc">
              Verified financial aid opportunities and scholarship programs to help deserving students continue their education without barrier.
            </p>
          </div>

          {/* 3. Mentor Support */}
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Mentor Support</h3>
            <p className="feature-desc">
              Direct access to passionate educators and mentors ready to clear doubts, offer guidance, and foster academic growth.
            </p>
          </div>

          {/* 4. Learning Progress */}
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Learning Progress</h3>
            <p className="feature-desc">
              Track learning milestones, complete practice quizzes, and visualize individual progress over time for continuous growth.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
