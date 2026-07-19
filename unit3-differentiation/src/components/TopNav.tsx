import { useTheme } from '../theme/ThemeContext';

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between gap-3 px-6 py-3.5 border-b shrink-0 shadow-xs"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
          Unit III : Vector Differentiation
        </span>
        <span
          className="text-xs font-mono-data px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
          style={{ color: 'var(--teal)', backgroundColor: 'var(--panel-2)', border: '1px solid var(--teal)' }}
        >
          12 Periods
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm hidden sm:inline" style={{ color: 'var(--ink-soft)' }}>
          Strict Syllabus Visualizer
        </span>
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-transform hover:scale-105 shrink-0"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
