import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConstellationField } from '../shaders/constellation-field/ConstellationField';
import '../shaders/threeui.css';
import './Hero.css';

const Hero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <section className="futuristic-hero-container">
      {/* ThreeUI Animated Constellation Field Background */}
      <div className="constellation-bg-wrapper" aria-hidden="true">
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

      {/* Top Navigation */}
      <header className="hero-nav">
        <div className="hero-nav-container">
          <Link to="/" className="hero-brand" aria-label="ChildHelp Home">
            <div className="brand-symbol">
              <span className="symbol-spark">✦</span>
            </div>
            <span className="brand-text">ChildHelp <span className="brand-accent">AI</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hero-desktop-nav" aria-label="Main Navigation">
            <ul className="hero-nav-links">
              <li><a href="#home" className="hero-nav-link active">Home</a></li>
              <li><a href="#features" className="hero-nav-link">Features</a></li>
              <li><a href="#solutions" className="hero-nav-link">Solutions</a></li>
              <li><a href="#about" className="hero-nav-link">About</a></li>
            </ul>
          </nav>

          {/* Right Side CTA */}
          <div className="hero-nav-actions">
            <Link to="/register" className="btn-hero-cta btn-hero-nav">
              Get Started
            </Link>
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
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
              <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
              <li><a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</a></li>
              <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
              <li>
                <Link to="/register" className="btn-hero-primary btn-mobile-cta" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Main Hero Content */}
      <div className="hero-content-wrapper">
        <div className="hero-content">
          {/* Eyebrow Badge */}
          <div className="hero-eyebrow-badge">
            <span className="badge-pulse-dot"></span>
            <span className="eyebrow-text">THE NEXT GENERATION OF INTELLIGENT TECHNOLOGY</span>
          </div>

          {/* Large Headline */}
          <h1 className="hero-headline">
            Build the Future With <span className="highlight-glow-text">Intelligent Systems</span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-supporting-text">
            Transform ideas into powerful digital experiences with AI, automation, and modern full-stack technology.
          </p>

          {/* CTA Buttons */}
          <div className="hero-button-group">
            <Link to="/register" className="btn-hero-primary">
              Get Started
              <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <a href="#features" className="btn-hero-secondary">
              Explore More
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator" aria-hidden="true">
          <span className="scroll-label">SCROLL TO EXPLORE</span>
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
