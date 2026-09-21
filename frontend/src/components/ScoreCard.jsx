import React from 'react';
import { Award, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function ScoreCard({ score = 0 }) {
  // Determine badge and color classes based on score
  let label = 'Low Match';
  let badgeClass = 'low';
  let strokeColor = '#ef4444'; // Red
  let IconComponent = XCircle;

  if (score >= 80) {
    label = 'Strong Match';
    badgeClass = 'strong';
    strokeColor = '#10b981'; // Emerald Green
    IconComponent = Award;
  } else if (score >= 60) {
    label = 'Moderate Match';
    badgeClass = 'moderate';
    strokeColor = '#eab308'; // Amber
    IconComponent = CheckCircle;
  } else if (score >= 40) {
    label = 'Needs Improvement';
    badgeClass = 'needs-improvement';
    strokeColor = '#f97316'; // Orange
    IconComponent = AlertTriangle;
  }

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="score-card">
      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Overall ATS Compatibility
      </div>

      <div className="circular-gauge-wrapper">
        <svg className="circular-gauge-svg" viewBox="0 0 190 190">
          <circle
            className="gauge-bg-circle"
            cx="95"
            cy="95"
            r={radius}
          />
          <circle
            className="gauge-fill-circle"
            cx="95"
            cy="95"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="gauge-inner-content">
          <span className="gauge-score-value">{score}</span>
          <span className="gauge-score-total">/ 100</span>
        </div>
      </div>

      <div className={`score-badge ${badgeClass}`}>
        <IconComponent size={16} />
        <span>{label}</span>
      </div>

      <p style={{ marginTop: '16px', fontSize: '0.88rem', color: 'var(--gray-500)', maxWidth: '280px' }}>
        {score >= 80
          ? 'Your resume shows high keyword and skill congruence with this role.'
          : score >= 60
          ? 'Solid qualification overlap. Review recommended additions to reach 80%+.'
          : 'Several critical role competencies are absent. Optimize before applying.'}
      </p>
    </div>
  );
}
