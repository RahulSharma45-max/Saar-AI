import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Circle, FileText } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Document uploaded & validated', detail: 'Payload parsed and verified under 10MB limit' },
  { id: 2, label: 'Extracting text from document', detail: 'Running Apache PDFBox parser / Tesseract OCR' },
  { id: 3, label: 'Generating AI summary', detail: 'Gemini reasoning across semantic structures' },
  { id: 4, label: 'Preparing insights & suggestions', detail: 'Synthesizing actionable key takeaways' },
];

export default function LoadingState({ fileName }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Smooth simulated step progression while waiting for the real backend response
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="card loading-card" role="status" aria-live="polite">
      <div className="loading-card-content">
        {/* Glow & spinner animation */}
        <div className="loading-animation-wrapper">
          <div className="loading-glow-ring" />
          <div className="loading-icon-center">
            <Sparkles size={28} className="loading-sparkle-spin" />
          </div>
        </div>

        <h3 className="loading-title">Analyzing your document...</h3>
        <p className="loading-subtitle">
          {fileName ? (
            <>Processing <span className="highlight-filename">{fileName}</span></>
          ) : (
            'SaarAI is extracting and generating insights'
          )}
          <span className="elapsed-badge">{secondsElapsed}s elapsed</span>
        </p>

        {/* Progress bar */}
        <div className="loading-progress-track">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${Math.min(92, (currentStepIdx + 1) * 24 + secondsElapsed * 3)}%` }} 
          />
        </div>

        {/* Processing steps list */}
        <div className="loading-steps-list">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;

            return (
              <div 
                key={step.id} 
                className={`loading-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div className="step-icon-col">
                  {isCompleted && <CheckCircle2 size={18} className="step-check-icon" />}
                  {isCurrent && <Loader2 size={18} className="step-spin-icon" />}
                  {isPending && <Circle size={18} className="step-circle-icon" />}
                </div>
                <div className="step-info-col">
                  <span className="step-label">{step.label}</span>
                  <span className="step-detail">{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="loading-tip">
          Large scanned images and multi-page PDFs with OCR may take 5–15 seconds to parse.
        </p>
      </div>
    </div>
  );
}
