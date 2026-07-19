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
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-mono-data font-semibold px-2.5 py-1 rounded border text-teal-400 border-teal-500/30 bg-teal-500/10">
          DARK MODE
        </span>
      </div>
    </header>
  );
}
