import React from 'react';
import { Check, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SkillCard({ matchedSkills = [], missingSkills = [] }) {
  return (
    <div className="skills-comparison-grid">
      {/* Matched Skills Panel */}
      <div className="skill-panel matched">
        <div className="skill-panel-title">
          <CheckCircle2 size={22} />
          <span>Matched Skills ({matchedSkills.length})</span>
        </div>

        {matchedSkills.length > 0 ? (
          <div className="skills-badges-wrap">
            {matchedSkills.map((skill, index) => (
              <span key={index} className="skill-badge matched">
                <Check size={14} />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="empty-state-text">
            No exact matching technical skills found in the resume for this job description.
          </p>
        )}
      </div>

      {/* Missing Skills Panel */}
      <div className="skill-panel missing">
        <div className="skill-panel-title">
          <AlertCircle size={22} />
          <span>Missing Skills ({missingSkills.length})</span>
        </div>

        {missingSkills.length > 0 ? (
          <div className="skills-badges-wrap">
            {missingSkills.map((skill, index) => (
              <span key={index} className="skill-badge missing">
                <X size={14} />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="empty-state-text" style={{ color: '#15803d' }}>
            Outstanding! Your resume covers all key skills identified in the job posting.
          </p>
        )}
      </div>
    </div>
  );
}
