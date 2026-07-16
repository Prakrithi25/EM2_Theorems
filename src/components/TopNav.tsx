import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const modules = [
  { path: '/foundations', label: 'Foundations', symbol: '∇' },
  { path: '/greens', label: "Green's", symbol: '∮' },
  { path: '/stokes', label: "Stokes'", symbol: '∬' },
  { path: '/gauss', label: 'Gauss', symbol: '∯' },
];

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between gap-3 px-5 py-3 border-b shrink-0"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight hover:opacity-80" style={{ color: 'var(--ink)' }}>
          Field&nbsp;&amp;&nbsp;Flux
        </Link>
      </div>

      <nav
        className="flex items-center gap-1 rounded-full p-1 overflow-x-auto max-w-full"
        style={{ backgroundColor: 'var(--panel-2)' }}
      >
        {modules.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) =>
              `shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 border-2 ${
                isActive ? '' : 'hover:opacity-70'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--teal)' : 'transparent',
              color: isActive ? 'var(--panel)' : 'var(--ink)',
              borderColor: isActive ? 'var(--teal)' : 'transparent',
            })}
          >
            <span className="font-display">{m.symbol}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        aria-label="Toggle dark mode"
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-transform hover:scale-105 shrink-0"
        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </header>
  );
}
