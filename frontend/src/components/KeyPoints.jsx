import React, { useState } from 'react';
import { Lightbulb, Copy, Check, BookmarkCheck } from 'lucide-react';

export default function KeyPoints({ keyPoints = [] }) {
  const [copied, setCopied] = useState(false);

  if (!keyPoints || keyPoints.length === 0) return null;

  const handleCopyAll = () => {
    const text = keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card key-points-card">
      <div className="key-points-header">
        <div className="title-with-badge">
          <h3 className="card-title">Key Points & Core Takeaways</h3>
          <span className="count-pill">{keyPoints.length} Key Insights</span>
        </div>

        <button 
          type="button" 
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopyAll}
          aria-label="Copy all key points"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied All</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Points</span>
            </>
          )}
        </button>
      </div>

      <div className="key-points-grid">
        {keyPoints.map((point, idx) => {
          const numFormatted = String(idx + 1).padStart(2, '0');
          return (
            <div key={idx} className="key-point-card">
              <div className="key-point-number-col">
                <span className="key-point-num">{numFormatted}</span>
                <span className="key-point-line" />
              </div>
              <div className="key-point-content">
                <p className="key-point-text">{point}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
