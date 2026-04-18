// src/components/Navigation.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navigation ${menuOpen ? 'active' : ''}`}>
      <div className="nav-container">
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/equipment-availability"
              className={`nav-link ${location.pathname === '/equipment-availability' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Equipment Availability
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;