import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div className="landing-wrapper" style={{ background: '#030712', minHeight: '100vh' }}>
      {/* Full-Screen Immersive ThreeUI Constellation Hero Section */}
      <Hero />

      {/* Feature Showcase Section */}
      <main className="main-content" style={{ paddingBottom: '5rem' }}>
        <section className="features-section" id="features">
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
    </div>
  );
};

export default Home;
