import React, { useState, useEffect } from 'react';

const LOADING_STEPS = [
  'Uploading resume...',
  'Extracting resume content...',
  'Analyzing skills...',
  'Comparing job requirements...',
  'Calculating ATS score...',
  'Generating recommendations...',
];

export default function LoadingScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / LOADING_STEPS.length) * 100)
  );

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner-pulse" />
        <h3 className="loading-title">Analyzing Your Resume</h3>
        <div className="loading-status-text">
          {LOADING_STEPS[currentStepIndex]}
        </div>

        <div className="loading-progress-track">
          <div
            className="loading-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div
          style={{
            marginTop: '12px',
            fontSize: '0.85rem',
            color: 'var(--gray-400)',
            fontWeight: '600',
          }}
        >
          Step {currentStepIndex + 1} of {LOADING_STEPS.length} ({progressPercent}%)
        </div>
      </div>
    </div>
  );
}
