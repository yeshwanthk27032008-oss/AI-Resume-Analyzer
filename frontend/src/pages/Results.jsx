import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  Calendar,
  RotateCcw,
  Download,
  CheckCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import ScoreBreakdown from '../components/ScoreBreakdown';
import SkillCard from '../components/SkillCard';
import KeywordTable from '../components/KeywordTable';
import StrengthCard from '../components/StrengthCard';
import WeaknessCard from '../components/WeaknessCard';
import RecommendationCard from '../components/RecommendationCard';
import { getReportUrl } from '../services/api';

// Fallback preview data in case the user navigates directly without uploading
const FALLBACK_DATA = {
  analysis_id: 1,
  resume_filename: "Alex_Morgan_Resume.pdf",
  job_title: "Senior Full Stack Engineer",
  ats_score: 82,
  created_at: "September 17, 2026 06:30 PM",
  score_breakdown: {
    skills: 85,
    keywords: 80,
    structure: 90,
    relevance: 75
  },
  matched_skills: [
    "Python", "JavaScript", "TypeScript", "React", "Node.js",
    "SQL", "PostgreSQL", "Docker", "AWS", "Git", "REST API", "Agile"
  ],
  missing_skills: [
    "Kubernetes", "GraphQL", "CI/CD", "Redis"
  ],
  keywords: [
    { keyword: "python", required: true, found: true, status: "Matched" },
    { keyword: "react", required: true, found: true, status: "Matched" },
    { keyword: "docker", required: true, found: true, status: "Matched" },
    { keyword: "aws", required: true, found: true, status: "Matched" },
    { keyword: "kubernetes", required: true, found: false, status: "Missing" },
    { keyword: "graphql", required: true, found: false, status: "Missing" },
    { keyword: "microservices", required: true, found: true, status: "Matched" },
    { keyword: "postgresql", required: true, found: true, status: "Matched" },
    { keyword: "agile", required: true, found: true, status: "Matched" }
  ],
  strengths: [
    "Strong technical alignment across modern web engineering (React, TypeScript, Python).",
    "Clear, ATS-compliant section hierarchy with Education, Skills, and Experience present.",
    "Effective usage of impact verbs and metrics in project descriptions."
  ],
  weaknesses: [
    "Missing high-demand cloud orchestration tools (Kubernetes).",
    "Limited mention of automated CI/CD deployment pipelines."
  ],
  recommendations: [
    "Incorporate missing skills (Kubernetes, GraphQL) into your Projects or Work Experience sections.",
    "Tailor your profile summary to explicitly emphasize full-stack architecture and backend scalability.",
    "Add quantifiable business metrics to demonstrate user impact and performance improvements."
  ],
  summary: "The candidate demonstrates strong technical proficiency (82/100) aligned with modern full-stack web development. Bolstering cloud deployment and container orchestration coverage will further improve callback probabilities."
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Check if state passed from navigation
    if (location.state?.result) {
      setData(location.state.result);
      return;
    }

    // 2. Check session storage
    const saved = sessionStorage.getItem('lastAnalysisResult');
    if (saved) {
      try {
        setData(JSON.parse(saved));
        return;
      } catch (e) {
        console.error('Failed to parse cached analysis:', e);
      }
    }

    // 3. Fallback to sample preview data
    setData(FALLBACK_DATA);
  }, [location.state]);

  if (!data) return null;

  const handleDownloadReport = () => {
    if (data.analysis_id) {
      window.open(getReportUrl(data.analysis_id), '_blank');
    } else {
      // Generate client-side text download if direct backend id is absent
      const textContent = `AI RESUME ANALYZER AUDIT REPORT
File: ${data.resume_filename}
Job Title: ${data.job_title}
ATS Score: ${data.ats_score}/100
Date: ${data.created_at}

Score Breakdown:
- Skills: ${data.score_breakdown?.skills}%
- Keywords: ${data.score_breakdown?.keywords}%
- Structure: ${data.score_breakdown?.structure}%
- Relevance: ${data.score_breakdown?.relevance}%

Matched Skills: ${data.matched_skills?.join(', ')}
Missing Skills: ${data.missing_skills?.join(', ')}

Summary:
${data.summary}
`;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Report_${data.resume_filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="results-page">
      <div className="container">
        {/* Top Header Bar */}
        <div className="results-topbar">
          <div className="results-meta-title">
            <h1>Resume Analysis Results</h1>
            <div className="results-meta-details">
              <span className="meta-pill">
                <FileText size={15} color="var(--primary-600)" />
                <span>{data.resume_filename}</span>
              </span>
              {data.job_title && (
                <span className="meta-pill">
                  <Briefcase size={15} color="var(--primary-600)" />
                  <span>{data.job_title}</span>
                </span>
              )}
              <span className="meta-pill">
                <Calendar size={15} color="var(--gray-500)" />
                <span>{data.created_at || 'Just Now'}</span>
              </span>
            </div>
          </div>

          <div className="results-actions">
            <button
              type="button"
              className="btn-action-outline"
              onClick={handleDownloadReport}
            >
              <Download size={16} />
              <span>Download Report</span>
            </button>

            <Link to="/analyze" className="btn-action-primary">
              <RotateCcw size={16} />
              <span>Analyze Again</span>
            </Link>
          </div>
        </div>

        {/* ATS Score & Breakdown Grid */}
        <div className="scores-grid">
          <ScoreCard score={data.ats_score} />
          <ScoreBreakdown breakdown={data.score_breakdown} />
        </div>

        {/* Resume Summary Card */}
        {data.summary && (
          <div className="summary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileCheck2 size={20} color="var(--primary-700)" />
              <h3 style={{ margin: 0 }}>Executive Profile Summary</h3>
            </div>
            <p>{data.summary}</p>
          </div>
        )}

        {/* Matched & Missing Skills */}
        <SkillCard
          matchedSkills={data.matched_skills}
          missingSkills={data.missing_skills}
        />

        {/* Keyword Analysis Table */}
        <KeywordTable keywords={data.keywords} />

        {/* Strengths & Weaknesses Side-by-Side */}
        <div className="insights-grid">
          <StrengthCard strengths={data.strengths} />
          <WeaknessCard weaknesses={data.weaknesses} />
        </div>

        {/* Actionable Recommendations */}
        <RecommendationCard recommendations={data.recommendations} />

        {/* Bottom CTA Bar */}
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '30px', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
            Ready to test another version?
          </h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>
            Apply the recommendations above to your resume, re-export as PDF/DOCX, and re-run the scan to track your score improvement.
          </p>
          <Link to="/analyze" className="btn-primary">
            <span>Scan Another Resume</span>
            <RotateCcw size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
