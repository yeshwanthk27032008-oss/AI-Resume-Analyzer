import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

export default function WeaknessCard({ weaknesses = [] }) {
  return (
    <div className="insight-card">
      <div className="insight-header weakness">
        <AlertOctagon size={20} color="#b45309" />
        <span>Areas for Improvement ({weaknesses.length})</span>
      </div>

      <ul className="insight-list">
        {weaknesses.length > 0 ? (
          weaknesses.map((item, index) => (
            <li key={index} className="insight-item">
              <AlertTriangle size={18} color="#d97706" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="empty-state-text" style={{ color: '#166534' }}>
            No critical gaps detected! Your resume aligns well with standard parser heuristics.
          </li>
        )}
      </ul>
    </div>
  );
}
