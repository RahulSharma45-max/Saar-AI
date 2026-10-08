import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  History, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X,
  FileSearch,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({
  activeNav = 'dashboard',
  onNavChange,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'upload', label: 'Upload Document', icon: UploadCloud },
    { id: 'history', label: 'History', icon: History },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id) => {
    if (onNavChange) onNavChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onCloseMobile}
          aria-hidden="true" 
        />
      )}

      <aside className={`saar-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Top Logo */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <div className="brand-icon-mesh">
              <FileSearch size={22} className="brand-primary-icon" />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">SaarAI</span>
              <span className="brand-version-badge">v2.0 SaaS</span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            type="button" 
            className="mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-section-label">MAIN WORKSPACE</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.id === 'upload' && (
                      <span className="nav-action-indicator">Drop</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pro Plan / Engine Banner in Sidebar */}
        <div className="sidebar-plan-card">
          <div className="plan-card-header">
            <Sparkles size={16} className="plan-icon" />
            <span className="plan-name">Gemini + OCR</span>
          </div>
          <p className="plan-desc">Unlimited document intelligence and summaries active.</p>
          <div className="plan-status-row">
            <span className="plan-status-dot" />
            <span className="plan-status-text">Engine Ready</span>
          </div>
        </div>

        {/* Bottom Utility Items */}
        <div className="sidebar-footer">
          <ul className="nav-list footer-list">
            <li className="nav-item">
              <button
                type="button"
                className="nav-btn footer-btn"
                onClick={() => handleItemClick('help')}
              >
                <HelpCircle size={18} className="nav-icon" />
                <span className="nav-label">Help & Support</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="nav-btn footer-btn danger"
                onClick={() => handleItemClick('logout')}
              >
                <LogOut size={18} className="nav-icon" />
                <span className="nav-label">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
