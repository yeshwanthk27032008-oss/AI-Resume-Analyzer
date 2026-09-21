import React from 'react';
import { Cpu, Search, LayoutTemplate, Briefcase } from 'lucide-react';

export default function ScoreBreakdown({ breakdown = {} }) {
  const categories = [
    {
      key: 'skills',
      title: 'Skills Match',
      weight: '40% Weight',
      value: breakdown.skills || 0,
      icon: Cpu,
      color: '#059669', // Emerald
    },
    {
      key: 'keywords',
      title: 'Keyword Match',
      weight: '30% Weight',
      value: breakdown.keywords || 0,
      icon: Search,
      color: '#0284c7', // Sky Blue
    },
    {
      key: 'structure',
      title: 'Resume Structure & Formatting',
      weight: '15% Weight',
      value: breakdown.structure || 0,
      icon: LayoutTemplate,
      color: '#8b5cf6', // Violet
    },
    {
      key: 'relevance',
      title: 'Experience & Education Relevance',
      weight: '15% Weight',
      value: breakdown.relevance || 0,
      icon: Briefcase,
      color: '#f59e0b', // Amber
    },
  ];

  return (
    <div className="breakdown-card">
      <div>
        <h3>Score Breakdown</h3>
        <p>Comprehensive evaluation across core ATS parsing dimensions</p>
      </div>

      <div className="breakdown-bars">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.key} className="breakdown-item">
              <div className="breakdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={18} color={cat.color} />
                  <span>{cat.title}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 'normal' }}>
                    ({cat.weight})
                  </span>
                </div>
                <span style={{ color: 'var(--gray-900)' }}>{cat.value}%</span>
              </div>

              <div className="breakdown-track">
                <div
                  className="breakdown-fill"
                  style={{
                    width: `${cat.value}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
