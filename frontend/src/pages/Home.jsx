import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BarChart2,
  Cpu,
  Search,
  CheckCircle2,
  FileCheck,
  Upload,
  FileText,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function Home() {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Next-Gen ATS Optimization</span>
          </div>

          <h1 className="hero-title">
            Build a Resume That <span className="highlight">Gets Noticed</span>
          </h1>

          <p className="hero-subtitle">
            Analyze your resume against any job description and discover how to improve your ATS compatibility.
            Get instant feedback on missing skills, keywords, and structural health.
          </p>

          <div className="hero-buttons">
            <Link to="/analyze" className="btn-primary">
              <span>Analyze My Resume</span>
              <ArrowRight size={18} />
            </Link>

            <button type="button" onClick={scrollToHowItWorks} className="btn-secondary">
              <span>How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Core Capabilities</span>
            <h2 className="section-title">Everything You Need to Beat the ATS</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BarChart2 size={26} />
              </div>
              <h3 className="feature-title">Dynamic ATS Score</h3>
              <p className="feature-desc">
                Receive an objective 0-100 compatibility score calculated across technical skills, keyword frequency, resume formatting, and relevance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Cpu size={26} />
              </div>
              <h3 className="feature-title">Skill Matching</h3>
              <p className="feature-desc">
                Automatically maps your competencies against languages, frameworks, cloud platforms, databases, and soft skills required by the employer.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Search size={26} />
              </div>
              <h3 className="feature-title">Missing Keywords</h3>
              <p className="feature-desc">
                Uncover critical industry terms and job-specific keywords that recruiters' automated filter filters search for before a human reads your resume.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles size={26} />
              </div>
              <h3 className="feature-title">AI Recommendations</h3>
              <p className="feature-desc">
                Receive tailored, high-impact suggestions explaining exactly where to insert missing skills, improve action verbs, and strengthen bullet points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple 4-Step Process</span>
            <h2 className="section-title">How AI Resume Analyzer Works</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div style={{ color: 'var(--primary-600)', marginBottom: '12px' }}>
                <Upload size={28} />
              </div>
              <h3 className="step-title">1. Upload Resume</h3>
              <p className="step-desc">
                Upload your resume in PDF or DOCX format. Our parser extracts clean text, bullet points, and section hierarchy.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div style={{ color: 'var(--primary-600)', marginBottom: '12px' }}>
                <FileText size={28} />
              </div>
              <h3 className="step-title">2. Add Job Description</h3>
              <p className="step-desc">
                Paste the target job description or requirements. You can also specify the target job title for customized parsing.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div style={{ color: 'var(--primary-600)', marginBottom: '12px' }}>
                <TrendingUp size={28} />
              </div>
              <h3 className="step-title">3. Analyze</h3>
              <p className="step-desc">
                Our local Python NLP engine extracts skills, computes keyword density, verifies section structures, and scores compatibility.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div style={{ color: 'var(--primary-600)', marginBottom: '12px' }}>
                <CheckCircle2 size={28} />
              </div>
              <h3 className="step-title">4. Improve Your Resume</h3>
              <p className="step-desc">
                Review your detailed visual score breakdown, matched/missing skills, and download your comprehensive audit report.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/analyze" className="btn-primary">
              <span>Try It Now — It's Free</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
