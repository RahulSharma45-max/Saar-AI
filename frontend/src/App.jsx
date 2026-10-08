import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Icons
import { 
  FileText, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import UploadCard from './components/UploadCard';
import ActivityChart from './components/ActivityChart';
import RecentDocuments from './components/RecentDocuments';
import AssistantPanel from './components/AssistantPanel';
import DocumentResult from './components/DocumentResult';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// Default initial demo documents to demonstrate the UI immediately
const INITIAL_DEMO_DOCS = [
  {
    id: 'demo-1',
    fileName: 'Research_Paper.pdf',
    fileType: 'PDF Document',
    pageCount: 5,
    status: 'Completed',
    summaryLength: 'Medium',
    timestamp: '2 hours ago',
    data: {
      fileName: 'Research_Paper.pdf',
      extractedText: 'Recent advancements in deep learning models have revolutionized document analysis and automated summarization. Transformer-based architectures utilize multi-head self-attention mechanisms to dynamically capture long-range contextual dependencies across tokens. This paper evaluates performance benchmarks comparing encoder-decoder paradigms against decoder-only large language models across multiple benchmark datasets including CNN/DailyMail, XSum, and PubMed. Empirical results demonstrate that hybrid architectures combining OCR pre-processing with targeted instruction fine-tuning yield a 14.2% relative improvement in ROUGE-L scores while reducing hallucination rates by 23% in technical document summarization.',
      summaryLength: 'MEDIUM',
      summary: 'This research paper analyzes modern transformer architectures for document summarization, comparing encoder-decoder models with decoder-only LLMs. By integrating OCR pre-processing with targeted instruction fine-tuning, the proposed hybrid pipeline achieves a 14.2% increase in ROUGE-L accuracy and reduces hallucinations by 23% on technical corpora.',
      keyPoints: [
        'Evaluates transformer-based self-attention models on benchmark summarization datasets (CNN/DailyMail, XSum, PubMed).',
        'Demonstrates that hybrid OCR and instruction-tuned pipelines significantly reduce token hallucination in complex PDFs.',
        'Achieves a 14.2% relative improvement in ROUGE-L score compared to traditional baseline models.',
        'Validates scalable multi-page document ingestion with minimal latency overhead.'
      ],
      improvementSuggestions: [
        'Clarity: Provide explicit confusion matrices for OCR recognition error rates on low-resolution scans.',
        'Structure: Expand the ablation study section to isolate the exact impact of attention masking.',
        'Content: Include latency and GPU memory profiling across diverse document lengths for edge deployment.'
      ],
      pageCount: 5
    }
  },
  {
    id: 'demo-2',
    fileName: 'Annual_Report.pdf',
    fileType: 'PDF Document',
    pageCount: 12,
    status: 'Completed',
    summaryLength: 'Long',
    timestamp: 'Yesterday',
    data: {
      fileName: 'Annual_Report.pdf',
      extractedText: 'Fiscal Year Annual Operating Report: Total consolidated revenue reached $48.2 million, representing a 28% year-over-year increase driven by strong SaaS enterprise customer acquisition. Gross profit margins expanded from 71.4% to 76.8% due to cloud infrastructure optimizations and automated ingestion pipelines. Operating cash flows remained positive at $12.4 million with cash reserves standing at $34.5 million. Key risks include international currency volatility and tightening regulatory compliance standards.',
      summaryLength: 'LONG',
      summary: 'The Annual Operating Report reflects strong financial health with consolidated revenues rising 28% year-over-year to $48.2 million. Enterprise SaaS growth and infrastructure cost controls improved gross margins to 76.8%. The company generated $12.4 million in positive operating cash flow and maintains healthy liquidity of $34.5 million. Growth priorities focus on AI-driven analytics, while regulatory compliance and macroeconomic volatility remain monitorable risks.',
      keyPoints: [
        'Total revenue grew by 28% YoY to $48.2M, primarily driven by enterprise expansion.',
        'Gross margins expanded to 76.8%, reflecting improved operational leverage.',
        'Operating cash flow remained solid at $12.4M with $34.5M in liquid cash reserves.',
        'Strategic investment allocated towards document intelligence and compliance automation.'
      ],
      improvementSuggestions: [
        'Structure: Break down revenue distribution by regional segments and vertical industries.',
        'Clarity: Add an executive bridge chart visualizing margin expansion drivers.',
        'Content: Detail the mitigation plan for foreign exchange headwinds and compliance costs.'
      ],
      pageCount: 12
    }
  },
  {
    id: 'demo-3',
    fileName: 'Scanned_Notes.jpg',
    fileType: 'Image • OCR',
    pageCount: 1,
    status: 'Completed',
    summaryLength: 'Short',
    timestamp: '3 days ago',
    data: {
      fileName: 'Scanned_Notes.jpg',
      extractedText: 'Meeting Notes - Product Roadmap Q4: Key action items: Complete API documentation for Spring Boot backend. Finalize Gemini 2.0 integration for real-time document extraction. Test OCR accuracy on hand-written receipts and low-light scans. Prepare Docker deployment manifests for Render and Vercel.',
      summaryLength: 'SHORT',
      summary: 'Product roadmap action items: Complete Spring Boot API documentation, finalize Gemini integration, test OCR accuracy on low-light scans, and deploy frontend and backend via Vercel and Render.',
      keyPoints: [
        'Finalize Gemini 2.0 integration for document extraction.',
        'Audit OCR accuracy on low-light and handwritten inputs.',
        'Complete deployment readiness on Render and Vercel.'
      ],
      improvementSuggestions: [
        'Clarity: Assign explicit owners and delivery dates for each action item.',
        'Content: Establish quantitative OCR accuracy targets (e.g. >95% character recognition).'
      ],
      pageCount: 1
    }
  }
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [summaryLength, setSummaryLength] = useState('MEDIUM');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [result, setResult] = useState(null);

  // Navigation & UI state
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Recent Documents
  const [recentDocs, setRecentDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('saarai_recent_documents');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved documents from localStorage', e);
    }
    return INITIAL_DEMO_DOCS;
  });

  // Save recent docs to localStorage whenever they update
  useEffect(() => {
    try {
      localStorage.setItem('saarai_recent_documents', JSON.stringify(recentDocs));
    } catch (e) {
      console.warn('Failed to save documents to localStorage', e);
    }
  }, [recentDocs]);

  const ALLOWED_TYPES = [
    'application/pdf', 
    'image/png', 
    'image/jpeg', 
    'image/jpg'
  ];
  const MAX_FILE_SIZE_MB = 10;

  const handleFileChosen = (file) => {
    if (!file) return;

    setErrorMessage(null);
    setProcessError(null);

    const fileNameLower = file.name ? file.name.toLowerCase() : '';
    const isAllowedExt = fileNameLower.endsWith('.pdf') || 
                         fileNameLower.endsWith('.png') || 
                         fileNameLower.endsWith('.jpg') || 
                         fileNameLower.endsWith('.jpeg');

    const isAllowedType = ALLOWED_TYPES.includes(file.type) || isAllowedExt;

    if (!isAllowedType) {
      setErrorMessage('Unsupported file format. Please upload a PDF or image (PNG, JPG, JPEG).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File is too large (${formatFileSize(file.size)}). Maximum permitted size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChosen(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setProcessError(null);
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('summaryLength', summaryLength);

    try {
      const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

      const response = await fetch(`${API_URL}/api/documents/process`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setProcessError(data.error || 'The server returned an error while processing the document. Please try again.');
        return;
      }

      // Successful analysis
      setResult(data);

      // Add to recent documents
      const isPdf = selectedFile.name.toLowerCase().endsWith('.pdf');
      const newDocEntry = {
        id: `doc-${Date.now()}`,
        fileName: data.fileName || selectedFile.name,
        fileType: isPdf ? 'PDF Document' : 'Image • OCR',
        pageCount: data.pageCount || (isPdf ? 1 : null),
        status: 'Completed',
        summaryLength: data.summaryLength || summaryLength,
        timestamp: 'Just now',
        data: data,
      };

      setRecentDocs(prev => [newDocEntry, ...prev.filter(d => d.fileName !== newDocEntry.fileName)]);

    } catch (err) {
      setProcessError('Could not process the document. Please check your network connection and verify that the backend API is online.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectRecentDoc = (doc) => {
    if (doc.data) {
      setResult(doc.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToUpload = () => {
    setResult(null);
    setSelectedFile(null);
    setErrorMessage(null);
    setProcessError(null);
  };

  const handleNavChange = (navId) => {
    setActiveNav(navId);
    if (navId === 'upload') {
      setResult(null);
      const analyzeElement = document.getElementById('analyze-section');
      if (analyzeElement) {
        analyzeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (navId === 'documents' || navId === 'history') {
      const recentElement = document.getElementById('recent-docs-section');
      if (recentElement) {
        recentElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (navId === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onNavChange={handleNavChange}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Content Area */}
        <div className="main-content-column">
          <Header
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeView={activeNav}
          />

          <main className="dashboard-scroll-body">
            {/* If analysis result is available, show the DocumentResult view */}
            {result && !result.error ? (
              <DocumentResult
                result={result}
                onBackToUpload={handleBackToUpload}
              />
            ) : (
              <>
                {/* 4 Statistics Cards */}
                <section className="stats-grid" aria-label="Workspace Metrics">
                  <StatCard
                    title="Documents Processed"
                    value="128"
                    icon={FileText}
                    trend="+12.5%"
                    trendLabel="vs last month"
                    color="indigo"
                  />
                  <StatCard
                    title="Summaries Generated"
                    value="96"
                    icon={Sparkles}
                    trend="+8.2%"
                    trendLabel="vs last month"
                    color="blue"
                  />
                  <StatCard
                    title="Key Insights"
                    value="342"
                    icon={Lightbulb}
                    trend="+24.1%"
                    trendLabel="synthesized"
                    color="amber"
                  />
                  <StatCard
                    title="Success Rate"
                    value="98.4%"
                    icon={ShieldCheck}
                    trend="+0.6%"
                    trendLabel="system uptime"
                    color="emerald"
                  />
                </section>

                {/* Loading state when processing */}
                {isProcessing && (
                  <LoadingState fileName={selectedFile?.name} />
                )}

                {/* Error Banner if process failed */}
                {processError && (
                  <ErrorState
                    error={processError}
                    onRetry={handleProcessDocument}
                    onDismiss={() => setProcessError(null)}
                  />
                )}

                {/* Main Feature: Analyze Your Document Card */}
                {!isProcessing && (
                  <UploadCard
                    selectedFile={selectedFile}
                    isDragging={isDragging}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onFileSelect={handleFileChosen}
                    onRemoveFile={handleRemoveFile}
                    summaryLength={summaryLength}
                    onSummaryLengthChange={setSummaryLength}
                    onProcess={handleProcessDocument}
                    isProcessing={isProcessing}
                    validationError={errorMessage}
                    formatFileSize={formatFileSize}
                  />
                )}

                {/* Document Activity Chart */}
                <ActivityChart />

                {/* Recent Documents */}
                <RecentDocuments
                  documents={recentDocs}
                  onSelectDocument={handleSelectRecentDoc}
                />
              </>
            )}
          </main>
        </div>

        {/* Right Assistant Information Panel */}
        <AssistantPanel />
      </div>
    </div>
  );
}

export default App;