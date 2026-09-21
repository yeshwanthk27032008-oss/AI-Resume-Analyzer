import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSearch, Sparkles, HelpCircle, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <FileSearch size={22} />
          </div>
          <span>AI Resume <span style={{ color: 'var(--primary-600)' }}>Analyzer</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active' : ''}`}>
            <BarChart3 size={16} />
            Analyze
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            <HelpCircle size={16} />
            About ATS
          </Link>
          <Link to="/analyze" className="nav-cta-btn">
            <Sparkles size={16} />
            <span>Analyze Resume</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
