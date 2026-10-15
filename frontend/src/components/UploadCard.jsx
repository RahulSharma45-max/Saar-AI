import React, { useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  AlertCircle,
  FileCheck,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import SummarySelector from './SummarySelector';

/**
 * UploadCard Component
 * Follows section 3 specification:
 * - A large, centered white card below the header
 * - A. Upload heading: "Upload Your Document" with document/upload icon
 * - B. File upload area: Drag-and-drop zone with document upload icon,
 *      "Drag and drop your file here", "or click to browse files",
 *      "Choose File" button, display selected file's name, type, size,
 *      and clear option to remove or replace.
 * - C. Full-width primary submit button labeled "Process Document",
 *      styled with blue-to-purple gradient, disabled when no file is selected.
 */
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

  const isPdf = selectedFile?.name?.toLowerCase().endsWith('.pdf') || selectedFile?.type === 'application/pdf';
  const isImage = selectedFile?.type?.startsWith('image/') || /\.(png|jpe?g)$/i.test(selectedFile?.name || '');

  return (
    <div className="card upload-card-main" id="upload-section">
      {/* A. Upload heading */}
      <div className="upload-heading-wrapper">
        <div className="upload-heading-icon-circle" aria-hidden="true">
          <UploadCloud size={20} className="upload-heading-icon" />
        </div>
        <div className="upload-heading-text">
          <h2 className="upload-card-title">Upload Your Document</h2>
          <p className="upload-card-subtitle">
            Select a PDF document or image for instant automated summarization and extraction
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="document-file-input"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        onChange={handleInputChange}
        className="hidden-file-input"
        aria-label="Choose a file to upload"
      />

      {/* B. File upload area */}
      {!selectedFile ? (
        <div
          className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
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
          aria-label="Upload document: drag and drop your file here or click to browse files"
        >
          <div className="dropzone-icon-bubble">
            <UploadCloud size={36} strokeWidth={1.8} className="dropzone-svg-icon" />
          </div>

          <div className="dropzone-text-block">
            <p className="dropzone-main-text">Drag and drop your file here</p>
            <p className="dropzone-sub-text">or click to browse files</p>
          </div>

          <button 
            type="button" 
            className="btn btn-choose-file"
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            <FolderOpen size={16} />
            <span>Choose File</span>
          </button>

          <div className="dropzone-supported-pill">
            <span>Supports PDF, PNG, JPG, JPEG (Max 10 MB)</span>
          </div>
        </div>
      ) : (
        <div className="selected-file-container">
          <div className="selected-file-card">
            <div className="file-icon-box">
              {isPdf ? (
                <FileText size={26} className="file-icon-pdf" />
              ) : isImage ? (
                <ImageIcon size={26} className="file-icon-img" />
              ) : (
                <FileCheck size={26} className="file-icon-default" />
              )}
            </div>

            <div className="file-meta-column">
              <div className="file-title-row">
                <span className="selected-file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="file-badge-type">
                  {isPdf ? 'PDF' : isImage ? 'Image • OCR' : 'Document'}
                </span>
              </div>
              <div className="file-specs-row">
                <span className="file-size-tag">{formatFileSize(selectedFile.size)}</span>
                <span className="file-specs-dot">•</span>
                <span className="file-ready-text">Ready to process</span>
              </div>
            </div>

            <div className="file-actions-group">
              <button
                type="button"
                className="btn btn-replace-file"
                onClick={handleBrowseClick}
                disabled={isProcessing}
                title="Replace with another file"
              >
                Replace
              </button>
              <button
                type="button"
                className="btn-remove-file"
                onClick={onRemoveFile}
                disabled={isProcessing}
                title="Remove selected file"
                aria-label="Remove selected file"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Summary Length Preference */}
          <SummarySelector 
            value={summaryLength} 
            onChange={onSummaryLengthChange} 
            disabled={isProcessing}
          />
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="validation-error-banner" role="alert">
          <AlertCircle size={18} className="error-icon" />
          <span>{validationError}</span>
        </div>
      )}

      {/* C. Submit button: Full-width primary button labeled "Process Document" */}
      <div className="submit-button-container">
        <button
          type="button"
          id="process-document-btn"
          className="btn btn-process-document"
          onClick={onProcess}
          disabled={!selectedFile || isProcessing}
          aria-busy={isProcessing}
        >
          <Sparkles size={18} />
          <span>Process Document</span>
          <ArrowRight size={18} className="btn-arrow-icon" />
        </button>
      </div>
    </div>
  );
}
