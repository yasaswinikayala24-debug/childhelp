import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">🌱 ChildHelp</div>
        <p className="footer-desc">
          One Platform for Children's Education & Support. Empowering students with free learning materials, scholarship guidance, and mentor support.
        </p>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} ChildHelp Platform. All rights reserved. Phase 1 - Foundation & Authentication.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
