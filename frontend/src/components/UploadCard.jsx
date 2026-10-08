import React, { useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import SummarySelector from './SummarySelector';

export default function UploadCard({
  selectedFile,
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onRemoveFile,
  summaryLength,
  onSummaryLengthChange,
  onProcess,
  isProcessing,
  validationError,
  formatFileSize,
}) {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isPdf = selectedFile?.type === 'application/pdf';
  const isImage = selectedFile?.type?.startsWith('image/');

  return (
    <div className="card analyze-card" id="analyze-section">
      <div className="card-header-block">
        <div className="title-with-badge">
          <h2 className="card-title">Analyze Your Document</h2>
          <span className="ai-pill">
            <Sparkles size={12} className="ai-pill-icon" /> AI Powered
          </span>
        </div>
        <p className="card-subtitle">
          Upload a document and let SaarAI extract, summarize and analyze it.
        </p>
      </div>

      {!selectedFile ? (
        <div
          className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={handleBrowseClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBrowseClick();
            }
          }}
          aria-label="Upload document by dragging a file here or clicking to browse"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            onChange={handleInputChange}
            className="hidden-file-input"
            aria-label="Choose a file to upload"
          />

          <div className="dropzone-icon-circle">
            <UploadCloud size={38} strokeWidth={1.8} className="dropzone-main-icon" />
          </div>

          <div className="dropzone-text-group">
            <p className="dropzone-primary-text">
              <span className="highlight-text">Drop your document here</span> or browse files
            </p>
            <p className="dropzone-secondary-text">
              PDF, PNG, JPG or JPEG • Max 10 MB
            </p>
          </div>

          <div className="dropzone-action">
            <button 
              type="button" 
              className="btn btn-secondary btn-browse"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Choose Document
            </button>
          </div>

          <div className="dropzone-footer-pills">
            <span className="format-tag">Apache PDFBox</span>
            <span className="format-tag">Tesseract OCR</span>
            <span className="format-tag">Gemini 2.0</span>
          </div>
        </div>
      ) : (
        <div className="selected-file-wrapper">
          <div className="selected-file-card">
            <div className="file-avatar-box">
              {isPdf ? (
                <FileText size={28} className="file-icon-pdf" />
              ) : isImage ? (
                <ImageIcon size={28} className="file-icon-img" />
              ) : (
                <FileCheck size={28} className="file-icon-default" />
              )}
            </div>

            <div className="file-details">
              <div className="file-name-row">
                <h4 className="file-name" title={selectedFile.name}>{selectedFile.name}</h4>
                <span className="file-type-pill">
                  {isPdf ? 'PDF Document' : 'Scanned Image / OCR'}
                </span>
              </div>
              <p className="file-size-text">
                {formatFileSize(selectedFile.size)} • Ready for AI extraction
              </p>
            </div>

            <button
              type="button"
              className="file-remove-btn"
              onClick={onRemoveFile}
              disabled={isProcessing}
              title="Remove file"
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          </div>

          <div className="upload-controls-grid">
            <SummarySelector 
              value={summaryLength} 
              onChange={onSummaryLengthChange} 
              disabled={isProcessing}
            />

            <div className="action-row">
              <button
                type="button"
                className="btn btn-primary btn-analyze"
                onClick={onProcess}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-loader" aria-hidden="true" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate AI Analysis</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={onRemoveFile}
                disabled={isProcessing}
              >
                Choose Different File
              </button>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <div className="validation-error-banner" role="alert">
          <AlertCircle size={18} className="error-icon" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
