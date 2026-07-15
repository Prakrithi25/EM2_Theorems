import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const cards = [
  {
    path: '/greens',
    symbol: '∮',
    name: "Green's Theorem",
    tex: '\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA',
    blurb: 'Walk a boundary in 2D and watch circulation match the sum of curl inside.',
    accent: 'var(--teal)',
  },
  {
    path: '/stokes',
    symbol: '∬',
    name: "Stokes' Theorem",
    tex: '\\oint_{\\partial S} \\mathbf{F}\\cdot d\\mathbf{r} = \\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}',
    blurb: 'Deform a curved surface in 3D and see the flux stay locked to its rim.',
    accent: 'var(--amber)',
  },
  {
    path: '/gauss',
    symbol: '∯',
    name: "Gauss's Divergence Theorem",
    tex: '\\oiint_{\\partial V} \\mathbf{F}\\cdot d\\mathbf{S} = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\, dV',
    blurb: 'Tune a source/sink field and watch outward flux equal enclosed divergence.',
    accent: 'var(--rose)',
  },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-16">
      <div className="max-w-3xl mx-auto space-y-3 mb-12">
        <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          The fundamental theorems of vector calculus, made visible.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Green's, Stokes', and Gauss's theorems all say the same thing at different scales: what
          happens on a boundary equals what accumulates inside it. Drag, rotate, and deform the
          simulations below until that equivalence stops feeling like an equation and starts
          feeling obvious.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="group rounded-2xl p-5 flex flex-col gap-4 transition-transform hover:-translate-y-1"
            style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl" style={{ color: c.accent }}>
                {c.symbol}
              </span>
              <span
                className="text-xs font-mono-data px-2 py-1 rounded-full"
                style={{ color: c.accent, backgroundColor: 'var(--panel-2)' }}
              >
                open →
              </span>
            </div>
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>
              {c.name}
            </h2>
            <div className="text-xs overflow-x-auto py-1" style={{ color: 'var(--ink)' }}>
              <BlockMath math={c.tex} />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {c.blurb}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
