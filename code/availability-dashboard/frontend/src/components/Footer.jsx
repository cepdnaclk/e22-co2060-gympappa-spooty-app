// src/components/Footer.tsx
import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GymPappa Spooty</h3>
            <p>Your complete sports equipment management solution for students and staff.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/equipment-availability">Equipment Availability</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>📧 support@gympassaspooty.com</p>
            <p>📞 +94 11 234 5678</p>
            <div className="social-links">
              <a href="#">FB</a>
              <a href="#">TW</a>
              <a href="#">IG</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 GymPappa Spooty. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;