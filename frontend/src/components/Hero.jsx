import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="light-landing-wrapper">
      {/* Top Navbar */}
      <header className="light-navbar">
        <div className="light-navbar-container">
          <Link to="/" className="light-brand-logo">
            <span className="sprout-icon">🌱</span>
            <span className="brand-name">ChildHelp</span>
          </Link>

          <nav className="light-nav-menu">
            <ul className="light-nav-links">
              <li>
                <a href="#home" className="light-nav-link active">Home</a>
              </li>
              <li>
                <a href="#about" className="light-nav-link">About</a>
              </li>
            </ul>
          </nav>

          <div className="light-nav-actions">
            <Link to="/login" className="btn-light-outline">
              Login
            </Link>
            <Link to="/register" className="btn-light-primary">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="light-hero-container">
        <div className="light-hero-grid">
          {/* Left Column: Headline & CTAs */}
          <div className="light-hero-left">
            <div className="light-hero-badge">
              <span className="badge-icon">🎓</span>
              <span>Educational Empowerment Platform</span>
            </div>

            <h1 className="light-hero-title">
              One Platform for Children's Education & Support
            </h1>

            <p className="light-hero-subtitle">
              ChildHelp bridges the gap between eager young learners and quality educational opportunities. Access free learning materials, discover scholarships, and connect with dedicated mentors.
            </p>

            <div className="light-hero-cta">
              <Link to="/register" className="btn-light-hero-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-light-hero-secondary">
                Member Login
              </Link>
            </div>
          </div>

          {/* Right Column: Gradient Card with Rocket */}
          <div className="light-hero-right">
            <div className="light-gradient-card">
              <div className="card-rocket-icon">🚀</div>
              <h2 className="card-title">Bright Futures Start Here</h2>
              <p className="card-description">
                Join thousands of students and mentors creating a brighter educational ecosystem together.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
