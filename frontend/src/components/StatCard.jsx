import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
      text: '#818CF8',
      glow: 'rgba(99, 102, 241, 0.15)',
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      text: '#60A5FA',
      glow: 'rgba(59, 130, 246, 0.15)',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.15)',
    },
    emerald: {
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.25)',
      text: '#4ADE80',
      glow: 'rgba(34, 197, 94, 0.15)',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div 
          className="stat-icon-wrapper" 
          style={{ 
            backgroundColor: scheme.bg, 
            borderColor: scheme.border,
            color: scheme.text,
            boxShadow: `0 0 16px ${scheme.glow}`
          }}
        >
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
        {trend && (
          <span className="stat-trend positive">
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>

      {trendLabel && (
        <div className="stat-card-footer">
          <span className="stat-trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
