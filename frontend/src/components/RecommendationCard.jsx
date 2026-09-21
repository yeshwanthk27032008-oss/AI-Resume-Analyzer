import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function RecommendationCard({ recommendations = [] }) {
  return (
    <div className="recommendations-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-800)',
          }}
        >
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--gray-900)' }}>
            Actionable Optimization Recommendations
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Follow these prioritized recommendations to enhance your ATS ranking and secure interviews
          </p>
        </div>
      </div>

      <div className="rec-list">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="rec-item">
              <span className="rec-num-badge">{index + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--gray-800)', fontSize: '0.96rem', lineHeight: '1.55' }}>
                  {rec}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state-text">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
