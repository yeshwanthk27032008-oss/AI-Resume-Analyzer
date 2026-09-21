import React from 'react';
import { CheckCircle, ThumbsUp } from 'lucide-react';

export default function StrengthCard({ strengths = [] }) {
  return (
    <div className="insight-card">
      <div className="insight-header strength">
        <ThumbsUp size={20} />
        <span>Identified Strengths ({strengths.length})</span>
      </div>

      <ul className="insight-list">
        {strengths.length > 0 ? (
          strengths.map((item, index) => (
            <li key={index} className="insight-item">
              <CheckCircle size={18} color="#059669" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="empty-state-text">No distinctive strengths could be highlighted.</li>
        )}
      </ul>
    </div>
  );
}
