import { NavLink } from 'react-router-dom';
import { Section, Equation, Inline } from '../components/MathPanel';

const MODULES = [
  {
    to: '/foundations',
    title: '1. Line, Surface & Volume Integrals — Work, Potential & Area',
    desc: 'Explore scalar and vector integration over curves, surfaces, and volumes. Verify path independence for conservative forces, determine scalar potential functions φ(x,y), and compute plane region area strictly via boundary line integrals.',
    accent: 'var(--teal)',
  },
  {
    to: '/greens',
    title: "2. Green's Theorem for Scalar Point Functions",
    desc: 'Interactive verification and evaluation (without proof) relating the boundary circulation ∮(P dx + Q dy) to the double integral of 2D curl over the enclosed plane region.',
    accent: 'var(--amber)',
  },
  {
    to: '/stokes',
    title: "3. Stoke's Theorem",
    desc: 'Interactive 3D verification and evaluation (without proof) relating the circulation around a closed spatial rim ∮ F·dr to the surface flux of curl ∬ (∇×F)·dS across any capping dome.',
    accent: 'var(--teal)',
  },
  {
    to: '/gauss',
    title: '4. Gauss Divergence Theorem',
    desc: 'Interactive 3D verification and evaluation (without proof) relating total outward surface flux ∯ F·dS across a closed sphere to the volume integral of divergence ∭ (∇·F) dV inside.',
    accent: 'var(--rose)',
  },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto space-y-8">
      <Section title="UNIT – IV : Vector Integration (15 Periods)">
        <p className="text-base leading-relaxed">
          Welcome to the <strong className="font-semibold text-ink dark:text-white">Unit IV: Vector Integration Visualizer</strong>. This dedicated website is organized strictly around the exact Unit IV syllabus. Every mathematical symbol is rendered with <strong className="font-semibold text-ink dark:text-white">MathJax SVG</strong> vectors for maximum clarity, and every theorem features interactive verification and evaluation tools without formal theoretical proofs.
        </p>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {MODULES.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className="flex flex-col justify-between rounded-xl p-6 border transition-all hover:scale-[1.01] shadow-xs hover:shadow-md"
            style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)' }}
          >
            <div className="space-y-3">
              <h4 className="font-display text-lg font-bold" style={{ color: m.accent }}>
                {m.title}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {m.desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
              <span>Launch Interactive Module</span>
              <span>→</span>
            </div>
          </NavLink>
        ))}
      </div>

      <Section title="Syllabus Core Foundations">
        <p>
          Vector integration extends ordinary calculus by integrating vector fields along paths (<Inline tex={"\\int_C \\mathbf{F}\\cdot d\\mathbf{r}"} />), across surfaces (<Inline tex={"\\iint_S \\mathbf{F}\\cdot d\\mathbf{S}"} />), and through volumes (<Inline tex={"\\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV"} />). These three integrals are unified by the foundational vector integral theorems verified in this application.
        </p>
        <Equation tex={"\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA \\qquad \\text{(Green's Theorem)}"} />
        <Equation tex={"\\oint_C \\mathbf{F}\\cdot d\\mathbf{r} = \\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S} \\qquad \\text{(Stoke's Theorem)}"} />
        <Equation tex={"\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S} = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV \\qquad \\text{(Gauss Divergence Theorem)}"} />
      </Section>
    </div>
  );
}
