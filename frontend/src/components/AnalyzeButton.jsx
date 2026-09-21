import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnalyzeButton({ onClick, disabled, loading }) {
  return (
    <div className="analyze-action-bar">
      <button
        type="button"
        className="btn-analyze-submit"
        onClick={onClick}
        disabled={disabled || loading}
      >
        <Sparkles size={20} />
        <span>{loading ? 'Analyzing Profile...' : 'Analyze Resume'}</span>
      </button>
    </div>
  );
}
