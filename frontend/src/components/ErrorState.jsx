import React from 'react';
import { AlertCircle, RefreshCw, X, ServerOff, FileX2 } from 'lucide-react';

export default function ErrorState({ error, onRetry, onDismiss }) {
  if (!error) return null;

  const isNetwork = error.toLowerCase().includes('connect') || 
                    error.toLowerCase().includes('server') || 
                    error.toLowerCase().includes('fetch');

  return (
    <div className="card error-card-container" role="alert">
      <div className="error-card-inner">
        <div className="error-icon-box">
          {isNetwork ? (
            <ServerOff size={24} className="error-svg" />
          ) : (
            <AlertCircle size={24} className="error-svg" />
          )}
        </div>

        <div className="error-content">
          <h4 className="error-title">
            {isNetwork ? 'Unable to connect to the server' : 'Unable to process document'}
          </h4>
          <p className="error-message-text">{error}</p>
          
          {isNetwork && (
            <p className="error-tip-text">
              Tip: Ensure the Spring Boot backend is active and that <code>VITE_API_URL</code> is properly configured.
            </p>
          )}

          <div className="error-actions-row">
            {onRetry && (
              <button 
                type="button" 
                className="btn btn-error-retry"
                onClick={onRetry}
              >
                <RefreshCw size={14} className="retry-icon" />
                <span>Try Again</span>
              </button>
            )}
            {onDismiss && (
              <button 
                type="button" 
                className="btn btn-error-dismiss"
                onClick={onDismiss}
              >
                <span>Dismiss</span>
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <button 
            type="button" 
            className="error-close-btn"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
