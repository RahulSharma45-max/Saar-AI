import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Sparkles, 
  CheckCircle,
  FileCheck2,
  X
} from 'lucide-react';

export default function Header({ 
  onOpenMobileMenu, 
  searchQuery, 
  onSearchChange,
  activeView = 'dashboard'
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  const notifications = [
    { id: 1, title: 'AI Engine Updated', desc: 'Gemini 2.0 Flash enabled for faster summarization.', time: '10m ago', unread: true },
    { id: 2, title: 'Tesseract OCR Ready', desc: 'High accuracy image extraction online.', time: '1h ago', unread: true },
    { id: 3, title: 'Backend Online', desc: 'Connected to Spring Boot REST endpoint.', time: '2h ago', unread: false },
  ];

  const viewTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Your AI-powered document intelligence workspace' },
    documents: { title: 'Documents Library', subtitle: 'Browse and inspect all processed files and summaries' },
    upload: { title: 'Upload & Analyze', subtitle: 'Import PDFs and scanned documents for instant AI extraction' },
    history: { title: 'Processing History', subtitle: 'Audit log of previous document summary runs' },
    insights: { title: 'AI Analytics & Insights', subtitle: 'Metrics and aggregate performance from your workspace' },
    settings: { title: 'Workspace Settings', subtitle: 'Configure environment, API endpoints, and processing rules' },
  };

  const currentView = viewTitles[activeView] || viewTitles.dashboard;

  return (
    <header className="saar-header">
      <div className="header-left">
        <button 
          type="button" 
          className="mobile-hamburger-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-block">
          <h1 className="header-page-title">{currentView.title}</h1>
          <p className="header-subtitle">{currentView.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="search-input"
            aria-label="Search documents"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={() => onSearchChange && onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="notifications-wrapper">
          <button
            type="button"
            className={`header-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!notificationsRead) setNotificationsRead(true);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={19} />
            {!notificationsRead && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">System Notifications</span>
                <span className="dropdown-count">{notifications.length} alerts</span>
              </div>
              <div className="dropdown-list">
                {notifications.map((n) => (
                  <div key={n.id} className="dropdown-item">
                    <div className="item-icon-circle">
                      <FileCheck2 size={14} />
                    </div>
                    <div className="item-details">
                      <p className="item-title">{n.title}</p>
                      <p className="item-desc">{n.desc}</p>
                      <span className="item-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="user-profile-block">
          <div className="user-avatar-circle" title="SaarAI Engineer Profile">
            <span className="avatar-initials">AI</span>
            <span className="avatar-online-dot" />
          </div>
          <div className="user-details-text">
            <span className="user-name">SaarAI Pro</span>
            <span className="user-role">Workspace Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
