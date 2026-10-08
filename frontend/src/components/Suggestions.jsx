import React, { useState } from 'react';
import { Sparkles, CheckSquare, Copy, Check, Compass, FileEdit, LayoutTemplate, Layers } from 'lucide-react';

export default function Suggestions({ suggestions = [] }) {
  const [copied, setCopied] = useState(false);

  if (!suggestions || suggestions.length === 0) return null;

  const handleCopyAll = () => {
    const text = suggestions.map((s, i) => `Suggestion ${i + 1}: ${s}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryMeta = (text, idx) => {
    const lower = text.toLowerCase();
    if (lower.startsWith('clarity') || lower.includes('clarity') || lower.includes('concise')) {
      return { category: 'Clarity & Readability', icon: FileEdit, color: '#38BDF8' };
    }
    if (lower.startsWith('structure') || lower.includes('structure') || lower.includes('format') || lower.includes('organize')) {
      return { category: 'Structure & Flow', icon: LayoutTemplate, color: '#818CF8' };
    }
    if (lower.startsWith('content') || lower.includes('content') || lower.includes('depth') || lower.includes('detail')) {
      return { category: 'Content & Depth', icon: Layers, color: '#C084FC' };
    }
    const defaultCategories = [
      { category: 'Clarity & Presentation', icon: FileEdit, color: '#38BDF8' },
      { category: 'Structure & Flow', icon: LayoutTemplate, color: '#818CF8' },
      { category: 'Content Optimization', icon: Layers, color: '#C084FC' },
      { category: 'Actionable Refinement', icon: Compass, color: '#34D399' },
    ];
    return defaultCategories[idx % defaultCategories.length];
  };

  return (
    <div className="card suggestions-card">
      <div className="suggestions-header">
        <div className="title-with-badge">
          <h3 className="card-title">Improvement Suggestions</h3>
          <span className="count-pill emerald">{suggestions.length} Recommendations</span>
        </div>

        <button 
          type="button" 
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopyAll}
          aria-label="Copy all suggestions"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied Suggestions</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Suggestions</span>
            </>
          )}
        </button>
      </div>

      <div className="suggestions-grid">
        {suggestions.map((suggestion, idx) => {
          const meta = getCategoryMeta(suggestion, idx);
          const Icon = meta.icon;

          return (
            <div key={idx} className="suggestion-card">
              <div className="suggestion-card-header">
                <div 
                  className="suggestion-tag"
                  style={{ color: meta.color, backgroundColor: `${meta.color}15`, borderColor: `${meta.color}30` }}
                >
                  <Icon size={14} className="tag-icon" />
                  <span>{meta.category}</span>
                </div>
                <span className="suggestion-index">#{idx + 1}</span>
              </div>

              <div className="suggestion-body">
                <p className="suggestion-text">{suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
