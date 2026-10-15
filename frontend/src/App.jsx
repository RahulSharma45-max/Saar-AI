import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import UploadCard from './components/UploadCard';
import DocumentResult from './components/DocumentResult';
import ProcessingOverlay from './components/ProcessingOverlay';
import ErrorState from './components/ErrorState';
import RecentDocuments from './components/RecentDocuments';

// Initial demo documents for immediate reference / exploration
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
  // Carries the machine-readable error classification returned by the backend
  // (e.g. 'GEMINI_OVERLOAD'). Stays in sync with processError.
  const [processErrorCode, setProcessErrorCode] = useState(null);
  const [result, setResult] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

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

  // Track processing elapsed seconds
  useEffect(() => {
    let interval = null;
    if (isProcessing) {
      setSecondsElapsed(0);
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  // Save recent docs to localStorage
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
    setProcessErrorCode(null);

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
    // Keep any previous result or clear? Per prompt: "Initially, hide the results section or display it only when appropriate. After successful processing, render the actual result below upload section."
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
    setProcessErrorCode(null);
  };

  const handleProcessDocument = async () => {
    if (!selectedFile || isProcessing) return;

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
        // Read the machine-readable errorCode if the backend provided one.
        // Only tag GEMINI_OVERLOAD when the backend explicitly says so;
        // other 503s and unrelated server errors keep a null code.
        const errorCode = data.errorCode === 'GEMINI_OVERLOAD' ? 'GEMINI_OVERLOAD' : null;
        setProcessErrorCode(errorCode);
        setProcessError(data.error || 'The server returned an error while processing the document. Please try again.');
        return;
      }

      // Successful analysis result
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

      // Scroll to result smoothly
      setTimeout(() => {
        const resultSection = document.getElementById('results-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);

    } catch (err) {
      // Network-level failure — no errorCode applies here.
      setProcessErrorCode(null);
      setProcessError('Could not process the document. Please check your network connection and verify that the backend API is online.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectRecentDoc = (doc) => {
    if (doc.data) {
      setResult(doc.data);
      setTimeout(() => {
        const resultSection = document.getElementById('results-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="app-viewport">
      {/* 
        4. Processing Animation — Important:
        Full-screen processing overlay blocking mouse & keyboard interaction
        Active for the entire duration of the actual document-processing request.
      */}
      {isProcessing && (
        <ProcessingOverlay 
          fileName={selectedFile?.name}
          secondsElapsed={secondsElapsed}
        />
      )}

      {/* Main Single-Column Clean Container */}
      <div className="app-centered-container">
        {/* 2. Header with existing project name 'SaarAI' */}
        <Header />

        <main className="main-content-flow">
          {/* Error Banner if processing failed */}
          {processError && (
            <ErrorState
              error={processError}
              errorCode={processErrorCode}
              onRetry={handleProcessDocument}
              onDismiss={() => {
                setProcessError(null);
                setProcessErrorCode(null);
              }}
            />
          )}

          {/* 3. Main Upload Section & Process Document button */}
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

          {/* 
            5. Results Section:
            Rendered below the upload section and submit button after successful processing.
          */}
          {result && !result.error && (
            <DocumentResult
              result={result}
              onBackToUpload={() => {
                setSelectedFile(null);
                setResult(null);
              }}
            />
          )}

          {/* Recent documents library below results */}
          <RecentDocuments
            documents={recentDocs}
            onSelectDocument={handleSelectRecentDoc}
          />
        </main>

        {/* Minimal Footer */}
        <footer className="saar-footer">
          <p className="footer-text">
            SaarAI Document Processing • Powered by Apache PDFBox, Tess4J OCR & Gemini
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;