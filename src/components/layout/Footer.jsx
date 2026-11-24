import React from 'react';

const Footer = () => {
  return (
    <footer className="cinematic-footer">
      <div className="footer-inner">
        <div className="footer-col-brand">
          <div className="footer-logo">
            <h3>PopcornPulse</h3>
          </div>
          <p className="footer-desc">
            The premier cinema destination engineered for film enthusiasts, 70mm screenings, and community watch parties.
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
          <h4>Cinephile Experience</h4>
          <ul>
            <li>Community Watch Parties</li>
            <li>Auditorium Seat Selection</li>
            <li>Gourmet Concessions Tray</li>
            <li>Multi-Axis Movie Critiques</li>
          </ul>
        </div>

        <div className="footer-col-links">
          <h4>Policies & Terms</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy & Ticket Policies</li>
            <li>Auditorium Accessibility</li>
            <li>Refund Guidelines</li>
          </ul>
          <p className="footer-copy">
            © {new Date().getFullYear()} PopcornPulse Cinema Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
