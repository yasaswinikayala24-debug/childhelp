import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConstellationField } from '../shaders/constellation-field/ConstellationField';
import '../shaders/threeui.css';
import './Hero.css';

const Hero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="futuristic-hero-container">
      {/* ThreeUI Animated Constellation Field Background */}
      <div className="shader-frame constellation-bg-wrapper" aria-hidden="true">
        <ConstellationField
          mode="dark"
          speed={1.00}
          size={1.00}
          strokeWidth={1.00}
          length={1.00}
          density={1.00}
          opacity={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
          className="constellation-canvas"
        />
        <div className="hero-radial-overlay" />
      </div>

      {/* Top Navigation Bar */}
      <header className="hero-nav">
        <div className="hero-nav-container">
          <Link to="/" className="hero-brand" aria-label="ChildHelp Home">
            <span className="sprout-icon">🌱</span>
            <span className="brand-name">ChildHelp</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hero-desktop-nav" aria-label="Main Navigation">
            <ul className="hero-nav-links">
              <li><a href="#home" className="hero-nav-link active">Home</a></li>
              <li><a href="#about" className="hero-nav-link">About</a></li>
            </ul>
          </nav>

          {/* Right Side CTA Buttons */}
          <div className="hero-nav-actions">
            <Link to="/login" className="btn-hero-outline">
              Login
            </Link>
            <Link to="/register" className="btn-hero-primary">
              Register
            </Link>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="hero-mobile-drawer">
            <ul className="mobile-nav-links">
              <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
              <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
              <li>
                <Link to="/login" className="btn-hero-outline" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', margin: '0.5rem 0' }}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn-hero-primary" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center' }}>
                  Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Main Hero Content (Centered, No Right Card) */}
      <div className="hero-content-wrapper">
        <div className="hero-center-content">
          {/* Eyebrow Badge */}
          <div className="hero-eyebrow-badge">
            <span className="badge-icon">🎓</span>
            <span className="eyebrow-text">Educational Empowerment Platform</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            One Platform for <br className="desktop-br" />
            Children's Education &amp; Support
          </h1>

          {/* Subtitle */}
          <p className="hero-supporting-text">
            ChildHelp bridges the gap between eager young learners and quality educational opportunities. Access free learning materials, discover scholarships, and connect with dedicated mentors.
          </p>

          {/* CTA Buttons */}
          <div className="hero-button-group">
            <Link to="/register" className="btn-hero-cta-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-hero-cta-secondary">
              Member Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
