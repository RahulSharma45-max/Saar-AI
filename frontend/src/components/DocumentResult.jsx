import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Lightbulb, 
  CheckSquare, 
  FileCode, 
  ArrowLeft, 
  CheckCircle2, 
  FileSearch,
  BookOpen,
  Share2,
  Clock,
  Layers,
  Download
} from 'lucide-react';
import SummaryCard from './SummaryCard';
import KeyPoints from './KeyPoints';
import Suggestions from './Suggestions';
import ExtractedText from './ExtractedText';

export default function DocumentResult({ result, onBackToUpload }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) return null;

  const {
    fileName = 'document.pdf',
    extractedText = '',
    summaryLength = 'MEDIUM',
    summary = '',
    keyPoints = [],
    improvementSuggestions = [],
    pageCount,
  } = result;

  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const summaryWordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const compressionRatio = wordCount > 0 ? Math.round((1 - (summaryWordCount / wordCount)) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, count: null },
    { id: 'summary', label: 'AI Summary', icon: Sparkles, count: `${summaryLength}` },
    { id: 'keyPoints', label: 'Key Points', icon: Lightbulb, count: keyPoints.length },
    { id: 'suggestions', label: 'Suggestions', icon: CheckSquare, count: improvementSuggestions.length },
    { id: 'extractedText', label: 'Extracted Text', icon: FileCode, count: `${wordCount}w` },
  ];

  const handleExportText = () => {
    const content = `SaarAI Analysis Report\nDocument: ${fileName}\nDate: ${new Date().toLocaleString()}\n\n--- SUMMARY (${summaryLength}) ---\n${summary}\n\n--- KEY POINTS ---\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n--- SUGGESTIONS ---\n${improvementSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n--- EXTRACTED TEXT ---\n${extractedText}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_SaarAI_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="document-analysis-view" id="analysis-result-view">
      {/* Top action navigation */}
      <div className="analysis-top-nav">
        <button 
          type="button" 
          className="btn btn-ghost-back"
          onClick={onBackToUpload}
        >
          <ArrowLeft size={16} />
          <span>Analyze Another Document</span>
        </button>

        <div className="analysis-actions-right">
          <button 
            type="button" 
            className="btn btn-secondary btn-export"
            onClick={handleExportText}
            title="Download full summary report"
          >
            <Download size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Document Analysis Header Banner */}
      <div className="card analysis-header-card">
        <div className="analysis-header-main">
          <div className="doc-avatar-large">
            <FileText size={32} className="doc-large-icon" />
          </div>

          <div className="analysis-doc-info">
            <div className="analysis-badge-row">
              <span className="status-badge-completed">
                <CheckCircle2 size={13} />
                <span>Completed</span>
              </span>
              <span className="doc-type-pill">
                {isPdf ? 'PDF Document' : 'Scanned Image / OCR'}
              </span>
              {pageCount && (
                <span className="doc-page-pill">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                </span>
              )}
              <span className="doc-length-pill">
                {summaryLength} Summary
              </span>
            </div>

            <h2 className="analysis-file-title" title={fileName}>{fileName}</h2>
            <p className="analysis-summary-subtitle">
              Successfully processed using {isPdf ? 'Apache PDFBox' : 'Tess4J OCR'} & Gemini AI model.
            </p>
          </div>
        </div>

        {/* Quick stat highlights */}
        <div className="analysis-stats-bar">
          <div className="analysis-stat-item">
            <span className="astat-label">Source Words</span>
            <span className="astat-val">{wordCount.toLocaleString()}</span>
          </div>
          <div className="analysis-stat-divider" />
          <div className="analysis-stat-item">
            <span className="astat-label">Summary Words</span>
            <span className="astat-val">{summaryWordCount.toLocaleString()}</span>
          </div>
          <div className="analysis-stat-divider" />
          <div className="analysis-stat-item">
            <span className="astat-label">Compression</span>
            <span className="astat-val highlight-compression">{compressionRatio > 0 ? `${compressionRatio}%` : 'N/A'}</span>
          </div>
          <div className="analysis-stat-divider" />
          <div className="analysis-stat-item">
            <span className="astat-label">Key Points</span>
            <span className="astat-val">{keyPoints.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="analysis-tabs-nav" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              className={`analysis-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} className="tab-btn-icon" />
              <span className="tab-btn-label">{tab.label}</span>
              {tab.count !== null && (
                <span className="tab-btn-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="analysis-tab-content">
        {activeTab === 'overview' && (
          <div className="tab-pane overview-pane">
            <SummaryCard summary={summary} summaryLength={summaryLength} />
            <div className="overview-subgrid">
              <KeyPoints keyPoints={keyPoints} />
              <Suggestions suggestions={improvementSuggestions} />
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="tab-pane">
            <SummaryCard summary={summary} summaryLength={summaryLength} />
          </div>
        )}

        {activeTab === 'keyPoints' && (
          <div className="tab-pane">
            <KeyPoints keyPoints={keyPoints} />
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="tab-pane">
            <Suggestions suggestions={improvementSuggestions} />
          </div>
        )}

        {activeTab === 'extractedText' && (
          <div className="tab-pane">
            <ExtractedText text={extractedText} fileName={fileName} />
          </div>
        )}
      </div>
    </div>
  );
}
