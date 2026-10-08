import React, { useState } from 'react';
import { FileCode, Copy, Check, Search, X, Hash, AlignLeft } from 'lucide-react';

export default function ExtractedText({ text = '', fileName }) {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!text) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const lines = text.split('\n');
  const lineCount = lines.length;
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Highlight matches if searchTerm is provided
  const matchCount = searchTerm.trim() 
    ? (text.toLowerCase().match(new RegExp(searchTerm.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length 
    : 0;

  const renderContent = () => {
    if (!searchTerm.trim()) {
      return text;
    }

    // Highlighting logic
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="highlighted-match">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="card extracted-text-card">
      <div className="extracted-text-header">
        <div className="extracted-title-col">
          <div className="title-with-badge">
            <h3 className="card-title">Extracted Document Text</h3>
            <span className="source-tag">Source Raw Data</span>
          </div>
          <div className="text-metrics-row">
            <span className="metric-tag">
              <Hash size={13} />
              <span>{lineCount.toLocaleString()} lines</span>
            </span>
            <span className="metric-tag">
              <AlignLeft size={13} />
              <span>{wordCount.toLocaleString()} words</span>
            </span>
            <span className="metric-tag">
              <span>{charCount.toLocaleString()} characters</span>
            </span>
          </div>
        </div>

        <div className="extracted-actions-group">
          {/* Quick Search */}
          <div className="search-in-text-box">
            <Search size={14} className="search-text-icon" />
            <input
              type="text"
              placeholder="Search in text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-text-input"
            />
            {searchTerm && (
              <button 
                type="button" 
                className="search-text-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear text search"
              >
                <X size={13} />
              </button>
            )}
            {searchTerm && (
              <span className="search-match-badge">{matchCount} found</span>
            )}
          </div>

          <button 
            type="button" 
            className={`btn btn-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            aria-label="Copy extracted text"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied Text</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div className="editor-top-bar">
          <div className="editor-dots">
            <span className="editor-dot red" />
            <span className="editor-dot yellow" />
            <span className="editor-dot green" />
          </div>
          <span className="editor-filename">{fileName || 'extracted_content.txt'}</span>
          <span className="editor-encoding">UTF-8 • Plain Text</span>
        </div>

        <div className="editor-content-area">
          <pre className="raw-text-view">
            <code>{renderContent()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
