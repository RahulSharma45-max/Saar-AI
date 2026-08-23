import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [summaryLength, setSummaryLength] = useState('MEDIUM');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
  const MAX_FILE_SIZE_MB = 10;

  const handleFileChosen = (file) => {
    if (!file) return;

    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Please upload a PDF or image (PNG/JPG).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setProcessError(null);
  };

  const handleInputChange = (e) => {
    handleFileChosen(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChosen(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setResult(null);
    setProcessError(null);
    fileInputRef.current.value = '';
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
      const API_URL = import.meta.env.VITE_API_URL;

const response = await fetch(`${API_URL}/api/documents/process`, {
  method: 'POST',
  body: formData,
});

      const data = await response.json();

      if (!response.ok) {
        setProcessError(data.error || 'The server returned an error. Please try again.');
        return;
      }

      setResult(data);
    } catch (err) {
      setProcessError('Could not process the document. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <span className="brand-mark">S-AI</span>
        <span className="brand-name">SaarAI</span>
      </header>

      <section className="hero">
        <h1 className="hero-title">Turn documents into clear insights.</h1>
        <p className="hero-subtitle">
          Upload a PDF or scanned image and get an AI-generated summary,
          key points, and improvement suggestions.
        </p>
      </section>

      <section className="upload-section">
        {!selectedFile ? (
          <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
            aria-label="Upload document by dragging a file here or clicking to browse"
          >
            <p className="upload-icon">📤</p>
            <p className="upload-text">Drag & drop a PDF or image here</p>
            <p className="upload-subtext">or click to browse your files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleInputChange}
              className="hidden-input"
              aria-label="Choose a file to upload"
            />
          </div>
        ) : (
          <div className="file-card">
            <div className="file-card-info">
              <span className="file-card-name">{selectedFile.name}</span>
              <span className="file-card-meta">
                {selectedFile.type || 'unknown type'} · {formatFileSize(selectedFile.size)}
              </span>
            </div>
                 <button
              className="file-card-remove"
              onClick={handleRemoveFile}
              disabled={isProcessing}
              aria-label="Remove selected file"
            >
              Remove
            </button>
          </div>
        )}

        {errorMessage && <p className="upload-error">{errorMessage}</p>}

        {selectedFile && (
          <div className="process-controls">
            <label htmlFor="summaryLength" className="summary-length-label">
              Summary length
            </label>
            <select
              id="summaryLength"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="summary-length-select"
              disabled={isProcessing}
            >
              <option value="SHORT">Short</option>
              <option value="MEDIUM">Medium</option>
              <option value="LONG">Long</option>
            </select>

            <button
              className="process-button"
              onClick={handleProcessDocument}
              disabled={isProcessing}
            >
              {isProcessing && <span className="spinner" aria-hidden="true"></span>}
              {isProcessing ? 'Processing…' : 'Process Document'}
            </button>
          </div>
        )}

        {processError && <p className="upload-error">{processError}</p>}

        {result && !result.error && (
          <div className="results">
            <div className="result-card">
              <h2 className="result-card-title">Summary</h2>
              <div className="summary-lines">
                {result.summary
                  .split('\n')
                  .filter((line) => line.trim() !== '')
                  .map((line, index) => (
                    <p key={index} className="summary-line">{line}</p>
                  ))}
              </div>
            </div>

            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="result-card">
                <h2 className="result-card-title">Key Points</h2>
                <ul className="key-points-list">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="key-point-item">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvementSuggestions && result.improvementSuggestions.length > 0 && (
              <div className="result-card">
                <h2 className="result-card-title">Improvement Suggestions</h2>
                <ul className="key-points-list">
                  {result.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="key-point-item">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.pageCount && (
              <p className="result-meta">Pages processed: {result.pageCount}</p>
            )}

            <details className="extracted-text-details">
              <summary>View extracted text</summary>
              <pre className="extracted-text-box">{result.extractedText}</pre>
            </details>
          </div>
        )}

        {result && result.error && (
          <p className="upload-error">{result.error}</p>
        )}
      </section>
    </div>
  );
}

export default App;