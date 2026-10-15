import React from 'react';
import { AlertCircle, RefreshCw, X, ServerOff, CloudOff } from 'lucide-react';

/**
 * ErrorState
 *
 * Props:
 *   error      {string}  – Human-readable error message from the backend or network layer.
 *   errorCode  {string|null} – Machine-readable error classification. Currently recognised:
 *                              'GEMINI_OVERLOAD' – Gemini returned 503 (model high demand).
 *   onRetry    {function} – Resubmits the current document without re-selecting a file.
 *   onDismiss  {function} – Closes the notification and resets both error states.
 */
export default function ErrorState({ error, errorCode, onRetry, onDismiss }) {
  if (!error) return null;

  // --- Classify the error ---
  const isGeminiOverload = errorCode === 'GEMINI_OVERLOAD';

  const isNetwork =
    !isGeminiOverload &&
    (error.toLowerCase().includes('connect') ||
      error.toLowerCase().includes('server') ||
      error.toLowerCase().includes('fetch'));

  // --- Derive display content from classification ---
  const icon = isGeminiOverload ? (
    <CloudOff size={24} className="error-svg" />
  ) : isNetwork ? (
    <ServerOff size={24} className="error-svg" />
  ) : (
    <AlertCircle size={24} className="error-svg" />
  );

  const title = isGeminiOverload
    ? 'Gemini is experiencing high demand'
    : isNetwork
    ? 'Unable to connect to the server'
    : 'Unable to process document';

  const message = isGeminiOverload
    ? 'Gemini is currently experiencing high demand. Please try again in a few moments.'
    : error;

  return (
    <div className="card error-card-container" role="alert">
      <div className="error-card-inner">
        <div className="error-icon-box">{icon}</div>

        <div className="error-content">
          <h4 className="error-title">{title}</h4>
          <p className="error-message-text">{message}</p>

          {isNetwork && (
            <p className="error-tip-text">
              Tip: Ensure the Spring Boot backend is active and that{' '}
              <code>VITE_API_URL</code> is properly configured.
            </p>
          )}

          {isGeminiOverload && (
            <p className="error-tip-text">
              This is a temporary condition. Retrying usually succeeds within a few seconds.
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
