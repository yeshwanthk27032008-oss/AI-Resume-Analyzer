import React from 'react';
import {
  HelpCircle,
  Cpu,
  Search,
  CheckCircle,
  FileText,
  AlertTriangle,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About AI Resume Analyzer</h1>
          <p>
            Demystifying Applicant Tracking Systems (ATS) through automated parsing, skill taxonomy matching, and transparent recommendations.
          </p>
        </div>

        <div className="about-content-grid">
          {/* Section 1: What is ATS */}
          <div className="about-card">
            <h2>
              <Search size={22} color="var(--primary-600)" />
              <span>What is an ATS (Applicant Tracking System)?</span>
            </h2>
            <p>
              An <strong>Applicant Tracking System (ATS)</strong> is software utilized by over 95% of Fortune 500 companies and growing tech employers to manage the recruitment process. When you submit your application online, an ATS automatically:
            </p>
            <ul>
              <li>Extracts the raw text, headers, and bullet points from your resume.</li>
              <li>Scans for required hard skills, qualifications, certifications, and technical tools.</li>
              <li>Assigns an automated compatibility score or ranking against the job description.</li>
              <li>Filters out resumes that fall below a predetermined match threshold before human hiring managers ever see them.</li>
            </ul>
          </div>

          {/* Section 2: What is AI Resume Analyzer */}
          <div className="about-card">
            <h2>
              <Cpu size={22} color="var(--primary-600)" />
              <span>What is AI Resume Analyzer?</span>
            </h2>
            <p>
              AI Resume Analyzer is a specialized full-stack assessment tool created to reverse-engineer ATS evaluation algorithms. It bridges the gap between your resume and the employer's expectations by analyzing both documents simultaneously and identifying exact alignment points and critical gaps.
            </p>
          </div>

          {/* Section 3: How Resume Matching & NLP Works */}
          <div className="about-card">
            <h2>
              <FileText size={22} color="var(--primary-600)" />
              <span>How Resume Matching & NLP Works</span>
            </h2>
            <p>
              Our local Python processing engine performs multi-stage analysis without sending your personal information to external third-party paid AI endpoints:
            </p>
            <ul>
              <li><strong>Document Extraction:</strong> PyMuPDF and python-docx parse complex PDF and Word formats, normalizing layout artifacts and preserving section hierarchies.</li>
              <li><strong>Taxonomy Matching:</strong> A curated dictionary spans programming languages, frameworks, cloud technologies, databases, and soft skills with regex boundary checking.</li>
              <li><strong>Keyword Frequency Analysis:</strong> Stopword-filtered job terms are compared against resume content to evaluate semantic density.</li>
              <li><strong>Weighted Composite Scoring:</strong> Skills Match (40%), Keywords Match (30%), Resume Structure (15%), and Experience/Education Relevance (15%) generate a real 0-100 score.</li>
            </ul>
          </div>

          {/* Section 4: Benefits for Students & Job Seekers */}
          <div className="about-card">
            <h2>
              <GraduationCap size={22} color="var(--primary-600)" />
              <span>Benefits for Students & Job Seekers</span>
            </h2>
            <ul>
              <li><strong>Higher Interview Callbacks:</strong> Optimize keyword density to clear initial automated screenings.</li>
              <li><strong>Targeted Resume Tailoring:</strong> Eliminate generic applications by tailoring your bullet points to individual roles.</li>
              <li><strong>Skill Gap Identification:</strong> Know exactly which tools or certifications will make you competitive for your dream job.</li>
              <li><strong>Formatting Hygiene:</strong> Ensure your document follows ATS-friendly structures without parsing errors.</li>
            </ul>
          </div>

          {/* Disclaimer Banner */}
          <div className="disclaimer-banner">
            <ShieldAlert size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong>Disclaimer:</strong> Analysis results are algorithmic recommendations designed to enhance resume quality and ATS compatibility. They do not guarantee employment, interviews, or hiring decisions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
