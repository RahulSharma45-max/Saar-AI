import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export default function RecentDocuments({ documents = [], onSelectDocument }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'PDF') {
      return doc.fileType?.includes('PDF') || doc.fileName?.toLowerCase().endsWith('.pdf');
    }
    if (filterType === 'IMAGE') {
      return doc.fileType?.includes('Image') || doc.fileType?.includes('OCR') || 
             /\.(png|jpe?g)$/i.test(doc.fileName);
    }
    return true;
  });

  return (
    <div className="card recent-docs-card" id="recent-docs-section">
      <div className="recent-docs-header">
        <div>
          <h3 className="card-title">Recent Documents</h3>
          <p className="card-subtitle">Previously processed document summaries & extractions</p>
        </div>

        <div className="recent-docs-filters">
          <div className="filter-search-box">
            <Search size={14} className="filter-search-icon" />
            <input
              type="text"
              placeholder="Filter recent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search-input"
            />
          </div>

          <div className="filter-pills-row">
            <button
              type="button"
              className={`filter-pill-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${filterType === 'PDF' ? 'active' : ''}`}
              onClick={() => setFilterType('PDF')}
            >
              PDFs
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${filterType === 'IMAGE' ? 'active' : ''}`}
              onClick={() => setFilterType('IMAGE')}
            >
              OCR Scans
            </button>
          </div>
        </div>
      </div>

      <div className="recent-docs-list">
        {filteredDocs.length === 0 ? (
          <div className="empty-recent-docs">
            <Clock size={32} className="empty-icon" />
            <p className="empty-title">No documents found</p>
            <p className="empty-subtitle">Try adjusting your search filter or upload a new document above.</p>
          </div>
        ) : (
          filteredDocs.map((doc, idx) => {
            const isPdf = doc.fileName?.toLowerCase().endsWith('.pdf') || doc.fileType?.includes('PDF');
            const status = doc.status || 'Completed';

            return (
              <div 
                key={doc.id || idx} 
                className="recent-doc-row"
                onClick={() => onSelectDocument && onSelectDocument(doc)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectDocument && onSelectDocument(doc);
                }}
              >
                <div className="recent-doc-left">
                  <div className={`doc-icon-avatar ${isPdf ? 'pdf-type' : 'image-type'}`}>
                    {isPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
                  </div>

                  <div className="doc-main-meta">
                    <h4 className="doc-name-text">{doc.fileName}</h4>
                    <div className="doc-sub-meta">
                      <span className="doc-format-label">
                        {isPdf ? 'PDF' : 'Image • OCR'}
                      </span>
                      {doc.pageCount && (
                        <>
                          <span className="meta-bullet">•</span>
                          <span>{doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}</span>
                        </>
                      )}
                      {doc.timestamp && (
                        <>
                          <span className="meta-bullet">•</span>
                          <span className="meta-time">{doc.timestamp}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="recent-doc-right">
                  <span className={`status-badge status-${status.toLowerCase()}`}>
                    {status === 'Completed' && <CheckCircle2 size={12} />}
                    {status === 'Processing' && <span className="mini-spin-dot" />}
                    {status === 'Failed' && <AlertTriangle size={12} />}
                    {status}
                  </span>

                  <span className="summary-len-badge">
                    {doc.summaryLength || 'Medium'}
                  </span>

                  <button 
                    type="button" 
                    className="view-doc-btn"
                    title="View analysis"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDocument && onSelectDocument(doc);
                    }}
                  >
                    <span>View</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
