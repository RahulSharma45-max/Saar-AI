import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Layers,
  ArrowRight
} from 'lucide-react';

/**
 * Clean, modern header displaying the project name prominently: SaarAI
 * With subtle blue-to-purple accent and descriptive subtitle.
 */
export default function Header() {
  return (
    <header className="saar-header" role="banner">
      <div className="header-inner">
        {/* Project Branding */}
        <div className="header-brand">
          <div className="header-brand-icon-box" aria-hidden="true">
            <Layers size={22} className="header-brand-icon" />
          </div>
          <div className="header-title-group">
            <div className="header-name-row">
              <h1 className="header-project-name">SaarAI</h1>
              <span className="header-badge">
                <Sparkles size={11} className="badge-sparkle-icon" /> Document Intelligence
              </span>
            </div>
            <p className="header-subtitle">
              Summarize, extract text, and uncover actionable insights from your PDFs and documents
            </p>
          </div>
        </div>

        {/* Header Right Status Pill */}
        <div className="header-status-pill">
          <span className="status-indicator-dot" />
          <span className="status-indicator-text">AI Ready</span>
        </div>
      </div>
    </header>
  );
}
