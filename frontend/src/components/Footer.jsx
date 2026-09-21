import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                <FileSearch size={18} />
              </div>
              <span>AI Resume Analyzer</span>
            </div>
            <p className="footer-desc">
              Empowering job seekers and students to land more interviews by decoding Applicant Tracking Systems (ATS) and aligning resumes with real job demands.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/analyze">Analyze Resume</Link></li>
              <li><Link to="/about">About & FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Core Features</h4>
            <ul className="footer-links">
              <li><span>Real ATS Score</span></li>
              <li><span>Skill Gap Detection</span></li>
              <li><span>Job Keyword Analysis</span></li>
              <li><span>Actionable Fixes</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Technology</h4>
            <ul className="footer-links">
              <li><span>PyMuPDF & python-docx</span></li>
              <li><span>Rule-Based NLP Engine</span></li>
              <li><span>Flask & SQLite REST API</span></li>
              <li><span>React & Vite Frontend</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for engineering excellence and career growth.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--primary-400)" />
            <span>Privacy First: Files processed locally without external data sharing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
