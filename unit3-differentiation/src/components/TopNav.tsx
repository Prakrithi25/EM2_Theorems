import FeedbackModal from './FeedbackModal';

export default function TopNav() {
  return (
    <header
      className="flex items-center justify-between gap-3 px-6 py-3.5 border-b shrink-0 shadow-xs"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
          Unit III : Vector Differentiation
        </span>
      </div>

      <div className="flex items-center gap-4">
        <FeedbackModal siteName="Unit III : Vector Differentiation" />
      </div>
    </header>
  );
}
