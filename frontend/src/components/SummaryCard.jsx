import React, { useState } from 'react';
import { Sparkles, Copy, Check, Clock, BookOpen, Quote } from 'lucide-react';

export default function SummaryCard({ summary, summaryLength = 'MEDIUM' }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const words = summary.trim().split(/\s+/).length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const paragraphs = summary
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="card summary-card">
      <div className="summary-card-header">
        <div className="summary-title-col">
          <div className="title-with-badge">
            <h3 className="card-title">AI Summary</h3>
            <span className="summary-length-tag">
              Length: {summaryLength}
            </span>
          </div>
          <div className="summary-meta-row">
            <span className="summary-meta-item">
              <BookOpen size={14} />
              <span>{words} words</span>
            </span>
            <span className="summary-meta-bullet">•</span>
            <span className="summary-meta-item">
              <Clock size={14} />
              <span>~{readingTimeMin} min read</span>
            </span>
          </div>
        </div>

        <button 
          type="button" 
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy AI summary"
        >
          {copied ? (
            <>
              <Check size={15} />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy size={15} />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="summary-body">
        <div className="quote-decorator" aria-hidden="true">
          <Quote size={20} />
        </div>
        <div className="summary-paragraphs">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="summary-text-p">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
