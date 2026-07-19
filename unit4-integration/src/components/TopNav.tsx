import { NavLink } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const NAV_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/foundations', label: 'Integration & Work' },
  { to: '/greens', label: "Green's Theorem" },
  { to: '/stokes', label: "Stoke's Theorem" },
  { to: '/gauss', label: 'Gauss Theorem' },
];

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between gap-3 px-6 py-3.5 border-b shrink-0 shadow-xs overflow-x-auto"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
    >
      <div className="flex items-center gap-4 shrink-0">
        <NavLink to="/" className="font-display text-xl font-bold tracking-tight hover:opacity-80" style={{ color: 'var(--ink)' }}>
          Unit IV : Vector Integration
        </NavLink>
        <span
          className="text-xs font-mono-data px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider hidden sm:inline-block"
          style={{ color: 'var(--amber)', backgroundColor: 'var(--panel-2)', border: '1px solid var(--amber)' }}
        >
          15 Periods
        </span>
      </div>

      <nav className="flex items-center gap-1 shrink-0">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                isActive ? 'font-semibold shadow-xs' : 'hover:opacity-75'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', border: '1px solid var(--line)' }
                : { color: 'var(--ink-soft)' }
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0 ml-2">
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
