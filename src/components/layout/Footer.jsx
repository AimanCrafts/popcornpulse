// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="cinematic-footer">
      <div className="footer-inner">
        <div className="footer-col-brand">
          <div className="footer-logo">
            <span>🍿</span>
            <h3>PopcornPulse</h3>
          </div>
          <p className="footer-desc">
            The premier cinema destination engineered for film enthusiasts, 70mm purists, and community movie lovers.
          </p>
        </div>

        <div className="footer-col-links">
          <h4>Auditorium Formats</h4>
          <ul>
            <li>IMAX 70mm Dual Laser</li>
            <li>Dolby Cinema with Atmos</li>
            <li>ScreenX 270° Panoramic</li>
            <li>RealD 3D & 4DX Motion</li>
          </ul>
        </div>

        <div className="footer-col-links">
          <h4>Cinephile Ecosystem</h4>
          <ul>
            <li>Community Movie Night RSVPs</li>
            <li>4-Axis Pulse Sentiment Metrics</li>
            <li>Interactive Collision-Free Seating</li>
            <li>Gourmet Concessions Ordering</li>
          </ul>
        </div>

        <div className="footer-col-status">
          <h4>System Status</h4>
          <div className="status-pill-online">
            <span className="live-dot" />
            <span>Full-Stack Platform Active</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} PopcornPulse Cinema Inc. Crafted with precision for cinephiles.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
