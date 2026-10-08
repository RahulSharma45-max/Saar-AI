import React from 'react';
import { AlignLeft, AlignJustify, FileText } from 'lucide-react';

const options = [
  {
    id: 'SHORT',
    label: 'Short',
    desc: 'Key takeaways (~100 words)',
    icon: AlignLeft,
  },
  {
    id: 'MEDIUM',
    label: 'Medium',
    desc: 'Balanced overview (~250 words)',
    icon: AlignJustify,
  },
  {
    id: 'LONG',
    label: 'Long',
    desc: 'Comprehensive deep dive (~500 words)',
    icon: FileText,
  },
];

export default function SummarySelector({ value, onChange, disabled }) {
  return (
    <div className="summary-selector-container">
      <div className="summary-selector-header">
        <label className="summary-selector-title">Summary Length</label>
        <span className="summary-selector-badge">Selected: {value}</span>
      </div>

      <div className="summary-segmented-control" role="radiogroup" aria-label="Summary length selector">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              className={`segmented-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              <div className="segmented-btn-content">
                <Icon size={16} className="segmented-icon" />
                <span className="segmented-label">{opt.label}</span>
              </div>
              <span className="segmented-desc">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
