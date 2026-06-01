import { useEffect, useRef, useState } from 'react';
import { useTour } from '../hooks/useTour.js';

const TOUR_STEPS = [
  {
    id: 'welcome',
    target: '[data-tour="hero"]',
    title: 'Welcome to Trivela',
    content:
      'Trivela is a Stellar-powered campaign platform where you complete tasks and earn on-chain rewards. Let\'s take a quick tour.',
    placement: 'bottom',
  },
  {
    id: 'campaigns',
    target: '[data-tour="campaign-grid"]',
    title: 'Browse Campaigns',
    content:
      'These are the active campaigns. Each card shows the name, reward, and available spots. Click any card to see full details.',
    placement: 'top',
  },
  {
    id: 'connect-wallet',
    target: '[data-tour="connect-wallet"]',
    title: 'Connect Your Wallet',
    content:
      'Use a Stellar-compatible wallet (e.g. Freighter) to connect. Your wallet address identifies you on-chain so rewards are sent directly to you.',
    placement: 'bottom',
  },
  {
    id: 'register',
    target: '[data-tour="campaign-register"]',
    title: 'Register & Earn',
    content:
      'Once connected, click Register on any active campaign. Your on-chain registration is recorded immediately and points start accumulating.',
    placement: 'top',
  },
  {
    id: 'rewards',
    target: '[data-tour="rewards-display"]',
    title: 'Track Your Rewards',
    content:
      'Your earned points and reward balance appear here after you register. Claim them from the campaign detail page at any time.',
    placement: 'top',
  },
];

function getTargetRect(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    width: r.width,
    height: r.height,
  };
}

function Overlay({ rect }) {
  if (!rect) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.55)',
        WebkitMaskImage: `radial-gradient(ellipse ${rect.width + 24}px ${rect.height + 24}px at ${rect.left + rect.width / 2}px ${rect.top - window.scrollY + rect.height / 2}px, transparent 95%, black)`,
        maskImage: `radial-gradient(ellipse ${rect.width + 24}px ${rect.height + 24}px at ${rect.left + rect.width / 2}px ${rect.top - window.scrollY + rect.height / 2}px, transparent 95%, black)`,
      }}
    />
  );
}

export default function OnboardingTour() {
  const { shouldShow, markComplete } = useTour();
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState(null);
  const popoverRef = useRef(null);

  const step = TOUR_STEPS[stepIdx];
  const isLast = stepIdx === TOUR_STEPS.length - 1;
  const isFirst = stepIdx === 0;

  useEffect(() => {
    if (!shouldShow) return;
    const target = document.querySelector(step.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setRect(getTargetRect(step.target)), 350);
    } else {
      setRect(null);
    }
  }, [shouldShow, step]);

  useEffect(() => {
    if (!shouldShow) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handleBack();
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (shouldShow && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [shouldShow, stepIdx]);

  if (!shouldShow) return null;

  function handleNext() {
    if (isLast) {
      markComplete();
    } else {
      setStepIdx((i) => i + 1);
    }
  }
  function handleBack() {
    if (!isFirst) setStepIdx((i) => i - 1);
  }
  function handleSkip() {
    markComplete();
  }

  const popoverStyle = rect
    ? {
        position: 'absolute',
        top: rect.top + rect.height + 12,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 340)),
        width: 320,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
      };

  return (
    <>
      {rect && <Overlay rect={rect} />}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Onboarding tour: ${step.title}`}
        tabIndex={-1}
        style={{
          ...popoverStyle,
          zIndex: 9999,
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '20px 24px',
          color: '#e2e8f0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step {stepIdx + 1} of {TOUR_STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            aria-label="Skip tour"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            Skip tour ×
          </button>
        </div>

        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>
          {step.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
          {step.content}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          {!isFirst && (
            <button
              onClick={handleBack}
              aria-label="Previous step"
              style={{
                flex: 1,
                padding: '8px 0',
                background: '#334155',
                color: '#cbd5e1',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            aria-label={isLast ? 'Finish tour' : 'Next step'}
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {isLast ? 'Done ✓' : 'Next →'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginTop: 14,
          }}
          aria-hidden="true"
        >
          {TOUR_STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === stepIdx ? '#3b82f6' : '#334155',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}