import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div className="error-left">
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
          title="Dismiss error"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
