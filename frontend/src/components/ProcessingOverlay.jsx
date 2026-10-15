import React from 'react';

/**
 * ProcessingOverlay Component
 *
 * Fullscreen blocking modal overlay when document processing is active.
 * Features:
 * - Traps keyboard & blocks pointer interaction across whole screen
 * - Semi-transparent blurred backdrop
 * - Centered white card with rounded corners and soft shadow
 * - High-end animated SVG silhouette of a person picking pages from a folder and organizing documents
 * - Real-time elapsed timer & gradient progress bar
 */
export default function ProcessingOverlay({ fileName, secondsElapsed = 0 }) {
  // Prevent any keyboard interaction or bubbling outside the modal
  const handleKeyDown = (e) => {
    e.stopPropagation();
    // Block common navigation/form submission keys while processing
    if (['Enter', ' ', 'Tab', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="processing-overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="processing-title"
      aria-describedby="processing-desc"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="processing-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Animated Illustration: Silhouette of a person picking pages from a folder */}
        <div className="processing-anim-container">
          <svg
            className="organizing-doc-svg"
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8AAAF7" />
                <stop offset="100%" stopColor="#B68AF5" />
              </linearGradient>
              <linearGradient id="folderBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7998EE" />
                <stop offset="100%" stopColor="#9C70E6" />
              </linearGradient>
              <linearGradient id="personGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Table / Surface Line */}
            <path
              d="M30 175 L290 175"
              stroke="#E2E8F0"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Subtle desk shadow */}
            <ellipse cx="145" cy="176" rx="90" ry="6" fill="#EEF4FF" />

            {/* --- FOLDER (Center Left) --- */}
            {/* Folder Back Tab */}
            <path
              d="M 90 120 L 115 120 L 125 128 L 180 128 C 184 128 186 130 186 134 L 186 172 L 84 172 L 84 126 C 84 122 86 120 90 120 Z"
              fill="url(#folderBackGrad)"
            />

            {/* Organized Staged Documents in Back */}
            <rect
              className="page-stack-static"
              x="96"
              y="114"
              width="68"
              height="55"
              rx="4"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            {/* Lines on static document */}
            <line x1="104" y1="123" x2="148" y2="123" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="130" x2="138" y2="130" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

            {/* --- ANIMATED PAGES (Paper sheets rising/sliding out of the folder) --- */}
            {/* Sheet 1: Rises up from folder */}
            <g className="animated-page-1">
              <rect
                x="108"
                y="95"
                width="64"
                height="62"
                rx="4"
                fill="#FFFFFF"
                stroke="#B68AF5"
                strokeWidth="1.8"
                filter="drop-shadow(0px 4px 8px rgba(182, 138, 245, 0.25))"
              />
              <line x1="117" y1="105" x2="157" y2="105" stroke="#8AAAF7" strokeWidth="2" strokeLinecap="round" />
              <line x1="117" y1="113" x2="162" y2="113" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="117" y1="121" x2="150" y2="121" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="117" y1="129" x2="142" y2="129" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
              {/* Checkmark or AI spark on page */}
              <circle cx="160" cy="144" r="5" fill="#EEF4FF" />
              <path d="M158 144 L160 146 L163 142" stroke="#8AAAF7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Sheet 2: Moving/inspected sheet being examined */}
            <g className="animated-page-2">
              <rect
                x="130"
                y="85"
                width="62"
                height="60"
                rx="4"
                fill="#FFFFFF"
                stroke="#8AAAF7"
                strokeWidth="1.8"
                filter="drop-shadow(0px 6px 12px rgba(138, 170, 247, 0.3))"
              />
              <line x1="139" y1="96" x2="178" y2="96" stroke="#B68AF5" strokeWidth="2" strokeLinecap="round" />
              <line x1="139" y1="104" x2="182" y2="104" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="139" y1="112" x2="168" y2="112" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="139" y1="120" x2="175" y2="120" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Folder Front Cover (slanted open pocket) */}
            <path
              d="M 80 138 L 176 134 C 182 134 186 137 186 142 L 180 173 C 180 175 178 176 175 176 L 85 176 C 81 176 78 173 78 169 L 80 138 Z"
              fill="url(#folderGrad)"
              filter="drop-shadow(0px 4px 10px rgba(138, 170, 247, 0.35))"
            />
            {/* Folder decorative band */}
            <path
              d="M 82 148 L 182 144"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* --- PERSON SILHOUETTE (Right side, leaning in & organizing) --- */}
            <g className="person-silhouette">
              {/* Head / Hair silhouette */}
              <circle cx="218" cy="72" r="16" fill="url(#personGrad)" />
              {/* Hair bun / subtle detail */}
              <circle cx="228" cy="68" r="6" fill="url(#personGrad)" opacity="0.9" />

              {/* Neck */}
              <path d="M214 86 L214 96 L224 96 L222 86 Z" fill="url(#personGrad)" />

              {/* Torso / Shoulders leaning forward */}
              <path
                d="M 198 106 C 208 96 226 96 238 102 C 248 108 252 120 252 142 L 252 175 L 195 175 C 195 155 194 135 198 106 Z"
                fill="url(#personGrad)"
              />

              {/* Animated Arm & Hand: Picking up and sorting pages */}
              <g className="person-arm-animated">
                {/* Upper arm extending towards the folder */}
                <path
                  d="M 204 104 C 188 114 172 118 152 115"
                  stroke="url(#personGrad)"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Hand / Forearm reaching down to pick paper */}
                <path
                  d="M 156 115 C 145 116 138 119 132 124"
                  stroke="url(#personGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Fingers gently holding page */}
                <circle cx="130" cy="125" r="4" fill="#334155" />
              </g>

              {/* Secondary Arm resting / organizing stack */}
              <path
                d="M 218 112 C 205 125 188 136 170 142"
                stroke="url(#personGrad)"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>

            {/* Floating Sparkles / AI Organizing Dust */}
            <g className="floating-sparkles">
              <path
                className="sparkle s1"
                d="M 110 80 L 112 84 L 116 86 L 112 88 L 110 92 L 108 88 L 104 86 L 108 84 Z"
                fill="#8AAAF7"
              />
              <path
                className="sparkle s2"
                d="M 185 68 L 187 72 L 191 73 L 187 75 L 185 79 L 183 75 L 179 73 L 183 72 Z"
                fill="#C084FC"
              />
              <path
                className="sparkle s3"
                d="M 152 58 L 153.5 61 L 156.5 62.5 L 153.5 64 L 152 67 L 150.5 64 L 147.5 62.5 L 150.5 61 Z"
                fill="#8AAAF7"
              />
            </g>
          </svg>
        </div>

        {/* Modal Text Content */}
        <div className="processing-modal-body">
          <h2 id="processing-title" className="processing-title">
            Processing Your Document...
          </h2>
          <p id="processing-desc" className="processing-subtitle">
            Reading your file and preparing your results. Please wait.
          </p>

          {fileName && (
            <div className="processing-filename-pill">
              <span className="file-pill-dot" />
              <span className="file-pill-name" title={fileName}>{fileName}</span>
            </div>
          )}

          {/* Gradient Progress Track */}
          <div className="processing-progress-wrapper">
            <div className="processing-progress-bar">
              <div
                className="processing-progress-fill"
                style={{
                  width: `${Math.min(94, Math.max(15, secondsElapsed * 8))}%`,
                }}
              />
            </div>
            <div className="processing-time-row">
              <span className="processing-status-note">
                Organizing & synthesizing insights...
              </span>
              <span className="processing-timer-badge">
                {secondsElapsed}s elapsed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
