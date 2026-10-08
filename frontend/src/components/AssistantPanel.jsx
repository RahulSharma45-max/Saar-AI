import React from 'react';
import { 
  Bot, 
  FileText, 
  Scan, 
  Sparkles, 
  Lightbulb, 
  CheckSquare, 
  Server, 
  Cpu, 
  Eye, 
  Activity,
  Zap,
  Info
} from 'lucide-react';

export default function AssistantPanel() {
  const capabilities = [
    { title: 'PDF Text Extraction', tech: 'Apache PDFBox', icon: FileText, color: '#818CF8' },
    { title: 'OCR Processing', tech: 'Tess4J / Tesseract', icon: Scan, color: '#38BDF8' },
    { title: 'AI Summarization', tech: 'Gemini 2.0 Flash', icon: Sparkles, color: '#C084FC' },
    { title: 'Key Point Detection', tech: 'NLP Clustering', icon: Lightbulb, color: '#FBBF24' },
    { title: 'Improvement Suggestions', tech: 'Insight Generation', icon: CheckSquare, color: '#4ADE80' },
  ];

  const statuses = [
    { name: 'API Server', status: 'Operational', icon: Server },
    { name: 'AI Engine', status: 'Operational', icon: Cpu },
    { name: 'OCR Engine', status: 'Operational', icon: Eye },
  ];

  return (
    <aside className="assistant-panel" aria-label="SaarAI Assistant Panel">
      {/* Top Identity Card */}
      <div className="assistant-card hero-ai-card">
        <div className="ai-avatar-wrapper">
          <div className="ai-avatar-glow" />
          <div className="ai-avatar-icon-box">
            <Bot size={28} className="ai-bot-icon" />
          </div>
          <span className="ai-pulse-dot" />
        </div>

        <div className="ai-meta">
          <h3 className="assistant-title">SaarAI Assistant</h3>
          <p className="assistant-subtitle">AI Document Assistant</p>
        </div>

        <div className="ai-status-pill">
          <Zap size={13} className="zap-icon" />
          <span>Active & Ready</span>
        </div>
      </div>

      {/* About Section */}
      <div className="assistant-card about-card">
        <div className="panel-section-title">
          <Info size={15} className="section-title-icon" />
          <span>About</span>
        </div>
        <p className="about-text">
          SaarAI transforms documents into concise summaries, key insights and actionable suggestions using AI-powered text extraction and analysis.
        </p>
      </div>

      {/* AI Capabilities Section */}
      <div className="assistant-card capabilities-card">
        <div className="panel-section-title">
          <Sparkles size={15} className="section-title-icon" />
          <span>AI Capabilities</span>
        </div>
        <ul className="capabilities-list">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <li key={i} className="capability-item">
                <div 
                  className="cap-icon-box"
                  style={{ color: cap.color, backgroundColor: `${cap.color}18` }}
                >
                  <Icon size={15} />
                </div>
                <div className="cap-info">
                  <span className="cap-title">{cap.title}</span>
                  <span className="cap-tech">{cap.tech}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* System Status Section */}
      <div className="assistant-card status-card">
        <div className="panel-section-title">
          <Activity size={15} className="section-title-icon" />
          <span>System Status</span>
        </div>
        <div className="status-indicators-grid">
          {statuses.map((s, idx) => (
            <div key={idx} className="status-indicator-row">
              <span className="status-name">{s.name}</span>
              <div className="status-value-pill">
                <span className="green-glow-dot" />
                <span className="status-label">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Overview Section */}
      <div className="assistant-card metrics-card">
        <div className="panel-section-title">
          <Activity size={15} className="section-title-icon" />
          <span>Processing Overview</span>
        </div>
        <div className="overview-stats-grid">
          <div className="overview-stat-cell">
            <span className="overview-num">128</span>
            <span className="overview-sub">Documents</span>
          </div>
          <div className="overview-stat-cell">
            <span className="overview-num">96</span>
            <span className="overview-sub">Summaries</span>
          </div>
          <div className="overview-stat-cell">
            <span className="overview-num">342</span>
            <span className="overview-sub">Insights</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
