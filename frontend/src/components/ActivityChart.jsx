import React, { useState } from 'react';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

const MONTH_DATA = [
  { month: 'Jan', docs: 45, summaries: 38 },
  { month: 'Feb', docs: 62, summaries: 50 },
  { month: 'Mar', docs: 78, summaries: 65 },
  { month: 'Apr', docs: 95, summaries: 82 },
  { month: 'May', docs: 110, summaries: 92 },
  { month: 'Jun', docs: 88, summaries: 74 },
  { month: 'Jul', docs: 104, summaries: 89 },
  { month: 'Aug', docs: 125, summaries: 102 },
  { month: 'Sep', docs: 140, summaries: 118 },
  { month: 'Oct', docs: 165, summaries: 135 },
  { month: 'Nov', docs: 152, summaries: 128 },
  { month: 'Dec', docs: 178, summaries: 145 },
];

export default function ActivityChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = Math.max(...MONTH_DATA.map(d => Math.max(d.docs, d.summaries)));
  const chartHeight = 180;

  return (
    <div className="card activity-card">
      <div className="activity-card-header">
        <div>
          <div className="title-with-badge">
            <h3 className="card-title">Document Activity</h3>
            <span className="live-badge">
              <span className="live-dot" /> Live Analytics
            </span>
          </div>
          <p className="card-subtitle">Document processing & summary generation trends</p>
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color-box docs-color" />
            <span className="legend-text">Documents Processed</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box summaries-color" />
            <span className="legend-text">Summaries Generated</span>
          </div>
        </div>
      </div>

      <div className="activity-chart-wrapper">
        {/* Subtle grid lines */}
        <div className="chart-grid-lines" aria-hidden="true">
          <div className="grid-line"><span className="grid-label">{maxVal}</span></div>
          <div className="grid-line"><span className="grid-label">{Math.round(maxVal * 0.66)}</span></div>
          <div className="grid-line"><span className="grid-label">{Math.round(maxVal * 0.33)}</span></div>
          <div className="grid-line"><span className="grid-label">0</span></div>
        </div>

        {/* SVG/CSS Bar Chart visualization */}
        <div className="chart-bars-container">
          {MONTH_DATA.map((item, idx) => {
            const docsHeight = (item.docs / maxVal) * chartHeight;
            const summariesHeight = (item.summaries / maxVal) * chartHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <div 
                key={item.month} 
                className={`chart-bar-group ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="chart-tooltip">
                    <p className="tooltip-title">{item.month} Statistics</p>
                    <div className="tooltip-row">
                      <span className="tooltip-dot docs-dot" />
                      <span>Docs: <strong>{item.docs}</strong></span>
                    </div>
                    <div className="tooltip-row">
                      <span className="tooltip-dot sum-dot" />
                      <span>Summaries: <strong>{item.summaries}</strong></span>
                    </div>
                  </div>
                )}

                <div className="bars-pair">
                  <div 
                    className="chart-bar doc-bar" 
                    style={{ height: `${docsHeight}px` }}
                    title={`${item.month} Docs: ${item.docs}`}
                  />
                  <div 
                    className="chart-bar sum-bar" 
                    style={{ height: `${summariesHeight}px` }}
                    title={`${item.month} Summaries: ${item.summaries}`}
                  />
                </div>

                <span className="chart-x-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-footer-metrics">
        <div className="mini-stat">
          <Layers size={15} className="mini-stat-icon indigo" />
          <span className="mini-stat-label">Total Processed:</span>
          <span className="mini-stat-val">1,342 Docs</span>
        </div>
        <div className="mini-stat">
          <BarChart3 size={15} className="mini-stat-icon blue" />
          <span className="mini-stat-label">AI Summaries:</span>
          <span className="mini-stat-val">1,088 Generated</span>
        </div>
        <div className="mini-stat">
          <TrendingUp size={15} className="mini-stat-icon emerald" />
          <span className="mini-stat-label">Monthly Growth:</span>
          <span className="mini-stat-val">+18.4%</span>
        </div>
      </div>
    </div>
  );
}
