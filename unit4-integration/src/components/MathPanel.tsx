import type { ReactNode } from 'react';
import { Lightbulb, Rocket, HelpCircle } from 'lucide-react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
        {title}
      </h3>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </section>
  );
}

function Fraction({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs sm:text-sm font-medium">
      <span className="border-b border-current px-1.5 py-0.5 text-center leading-tight w-full">{num}</span>
      <span className="px-1.5 py-0.5 text-center leading-tight w-full">{den}</span>
    </span>
  );
}

function Integral({ symbol, sub, sup }: { symbol: string; sub?: ReactNode; sup?: ReactNode }) {
  return (
    <span className="inline-flex items-center align-middle mx-0.5 font-serif select-none">
      <span className="text-xl sm:text-2xl font-normal leading-none text-[var(--ink)]">{symbol}</span>
      {(sub || sup) && (
        <span className="inline-flex flex-col justify-between text-[0.65em] sm:text-[0.7em] font-mono leading-none -ml-0.5 mr-1 text-[var(--ink-soft)]">
          {sup && <span>{sup}</span>}
          {sub && <span>{sub}</span>}
        </span>
      )}
    </span>
  );
}

function Vector({ name, color = 'var(--teal)' }: { name: string; color?: string }) {
  return <strong className="font-sans font-bold mx-0.5 tracking-tight" style={{ color }}>{name}</strong>;
}

function renderHumanMath(tex: string, isDisplay: boolean): ReactNode {
  // Normalize consecutive backslashes (like '\\oiint_S' passed from JSX strings) to single backslash '\oiint_S'
  const cleanTex = tex.trim().replace(/\\+/g, '\\');

  // 1. Single variables / scalars (A, B, C, D, S, V, W, x, y, z, etc.)
  if (/^[A-Za-z0-9]$/.test(cleanTex)) {
    return <span className="inline-block align-baseline font-serif italic font-semibold mx-0.5" style={{ color: 'var(--ink)' }}>{cleanTex}</span>;
  }

  // 2. Simple bold vector like \mathbf{F}
  const boldMatch = cleanTex.match(/^\\mathbf\{([A-Za-z0-9])\}$/);
  if (boldMatch) {
    return <strong className="inline-block align-baseline font-sans font-bold mx-0.5 text-[var(--teal)]">{boldMatch[1]}</strong>;
  }

  // 3. Exact formula: F(x,y,z) = P i + Q j + R k
  if (
    cleanTex === "\\mathbf{F}(x,y,z) = P\\,\\mathbf{i} + Q\\,\\mathbf{j} + R\\,\\mathbf{k}" ||
    cleanTex === "\\mathbf{F}(x,y,z) = P\\mathbf{i} + Q\\mathbf{j} + R\\mathbf{k}" ||
    cleanTex === "\\mathbf{F}(x, y, z) = P\\,\\mathbf{i} + Q\\,\\mathbf{j} + R\\,\\mathbf{k}" ||
    cleanTex === "\\mathbf{F}(x, y, z) = P\\mathbf{i} + Q\\mathbf{j} + R\\mathbf{k}"
  ) {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <Vector name="F" />
        <span className="italic">(x, y, z)</span>
        <span className="mx-1.5 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <span className="italic">P</span><Vector name="i" color="var(--ink)" />
        <span className="mx-1 font-sans text-[var(--ink-soft)]">+</span>
        <span className="italic">Q</span><Vector name="j" color="var(--ink)" />
        <span className="mx-1 font-sans text-[var(--ink-soft)]">+</span>
        <span className="italic">R</span><Vector name="k" color="var(--ink)" />
      </span>
    );
  }

  // 4. Exact formula: W = \int_C \mathbf{F}\cdot d\mathbf{r}
  if (cleanTex === "W = \\int_C \\mathbf{F}\\cdot d\\mathbf{r}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <span className="italic font-semibold text-[var(--amber)]">W</span>
        <span className="mx-1.5 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Integral symbol="∫" sub="C" />
        <Vector name="F" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="r" color="var(--ink)" /></span>
      </span>
    );
  }

  // 5. Exact formula: \Phi = \iint_S \mathbf{F}\cdot \hat{\mathbf{n}}\\,dS or \Phi = \iint_S \mathbf{F}\cdot \hat{\mathbf{n}}\,dS
  if (cleanTex === "\\Phi = \\iint_S \\mathbf{F}\\cdot \\hat{\\mathbf{n}}\\,dS" || cleanTex === "\\Phi = \\iint_S \\mathbf{F}\\cdot \\hat{\\mathbf{n}}dS" || cleanTex === "\\Phi = \\iint_S \\mathbf{F}\\cdot \\hat{n}\\,dS") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <span className="font-serif italic text-base font-semibold text-[var(--rose)]">Φ</span>
        <span className="mx-1.5 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Integral symbol="∬" sub="S" />
        <Vector name="F" color="var(--rose)" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <strong className="font-sans font-bold text-[var(--ink)] mx-0.5">n̂</strong>
        <span className="ml-0.5">dS</span>
      </span>
    );
  }

  // 6. Exact formula: \oint (x\,dy - y\,dx)
  if (cleanTex === "\\oint (x\\,dy - y\\,dx)" || cleanTex === "\\oint (x dy - y dx)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∮" />
        <span>(<em className="italic">x</em> dy − <em className="italic">y</em> dx)</span>
      </span>
    );
  }

  // 7. Exact formula: W = \int_A^B \mathbf{F}\cdot d\mathbf{r} = \int_A^B (F_1 dx + F_2 dy)
  if (cleanTex === "W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r} = \\int_A^B (F_1 dx + F_2 dy)") {
    return (
      <span className="inline-flex items-center gap-1 sm:gap-1.5 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <span className="italic font-semibold text-[var(--amber)]">W</span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Integral symbol="∫" sub="A" sup="B" />
        <Vector name="F" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="r" color="var(--ink)" /></span>
        <span className="mx-1.5 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Integral symbol="∫" sub="A" sup="B" />
        <span>(<em className="italic">F₁</em> dx + <em className="italic">F₂</em> dy)</span>
      </span>
    );
  }

  // 8. Exact formula: W = \int_A^B \mathbf{F}\cdot d\mathbf{r}
  if (cleanTex === "W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <span className="italic font-semibold text-[var(--amber)]">W</span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Integral symbol="∫" sub="A" sup="B" />
        <Vector name="F" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="r" color="var(--ink)" /></span>
      </span>
    );
  }

  // 9. Exact formula: \nabla\times\mathbf{F} = \mathbf{0}
  if (cleanTex === "\\nabla\\times\\mathbf{F} = \\mathbf{0}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <span>∇ ×</span>
        <Vector name="F" />
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <strong className="font-sans font-bold text-[var(--ink)]">0</strong>
      </span>
    );
  }

  // 10. Potential functions
  if (cleanTex === "\\phi(x, y)") return <span className="font-serif italic text-xs sm:text-sm mx-0.5 text-[var(--teal)]">φ(x, y)</span>;
  if (cleanTex === "\\mathbf{F} = \\nabla\\phi") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Vector name="F" />
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <span className="text-[var(--teal)]">∇φ</span>
      </span>
    );
  }
  if (cleanTex === "W = \\phi(B) - \\phi(A)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <span className="italic font-semibold text-[var(--amber)]">W</span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <span className="text-[var(--teal)]">φ(B) − φ(A)</span>
      </span>
    );
  }
  if (cleanTex === "\\phi(B) - \\phi(A)") return <span className="font-serif sm:font-mono text-xs sm:text-sm text-[var(--teal)]">φ(B) − φ(A)</span>;
  if (cleanTex === "\\mathbf{F} = (2xy, x^2)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Vector name="F" />
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <span>(2<em className="italic">xy</em>, <em className="italic">x²</em>)</span>
      </span>
    );
  }
  if (cleanTex === "\\mathbf{F} = (-y, x)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Vector name="F" />
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <span>(−<em className="italic">y</em>, <em className="italic">x</em>)</span>
      </span>
    );
  }
  if (cleanTex === "(-y, x)") return <span className="font-serif sm:font-mono text-xs sm:text-sm">(−<em className="italic">y</em>, <em className="italic">x</em>)</span>;
  if (cleanTex === "P(x, y) = -y") return <span className="font-serif sm:font-mono text-xs sm:text-sm"><em className="italic">P</em>(x, y) = −<em className="italic">y</em></span>;
  if (cleanTex === "Q(x, y) = x") return <span className="font-serif sm:font-mono text-xs sm:text-sm"><em className="italic">Q</em>(x, y) = <em className="italic">x</em></span>;

  // 11. Exact formula: \text{Area}(D) = \frac{1}{2} \oint_C (x\,dy - y\,dx)
  if (cleanTex === "\\text{Area}(D) = \\frac{1}{2} \\oint_C (x\\,dy - y\\,dx)" || cleanTex === "\\text{Area}(D) = \\frac{1}{2} \\oint_C (x dy - y dx)") {
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <span className="font-sans font-semibold text-[var(--teal)]">Area(D)</span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Fraction num="1" den="2" />
        <Integral symbol="∮" sub="C" />
        <span>(<em className="italic">x</em> dy − <em className="italic">y</em> dx)</span>
      </span>
    );
  }
  if (cleanTex === "\\frac{1}{2} \\oint_C (x\\,dy - y\\,dx)" || cleanTex === "\\frac{1}{2} \\oint_C (x dy - y dx)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Fraction num="1" den="2" />
        <Integral symbol="∮" sub="C" />
        <span>(<em className="italic">x</em> dy − <em className="italic">y</em> dx)</span>
      </span>
    );
  }

  // 12. Green's Theorem exact formulas
  if (cleanTex === "\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA" || cleanTex === "\\oint_C (P dx + Q dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA") {
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <Integral symbol="∮" sub="C" />
        <span>(<em className="italic">P</em> dx + <em className="italic">Q</em> dy)</span>
        <span className="mx-1 sm:mx-2 font-sans font-bold text-base text-[var(--teal)]">=</span>
        <Integral symbol="∬" sub="D" />
        <span className="text-base sm:text-lg font-light flex items-center text-[var(--ink-soft)]">(</span>
        <Fraction num="∂Q" den="∂x" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">−</span>
        <Fraction num="∂P" den="∂y" />
        <span className="text-base sm:text-lg font-light flex items-center text-[var(--ink-soft)]">)</span>
        <span className="ml-1">dA</span>
      </span>
    );
  }
  if (cleanTex === "\\oint (P\\,dx + Q\\,dy)" || cleanTex === "\\oint (P dx + Q dy)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∮" />
        <span>(<em className="italic">P</em> dx + <em className="italic">Q</em> dy)</span>
      </span>
    );
  }
  if (cleanTex === "\\iint (Q_x - P_y)\\,dA" || cleanTex === "\\iint (Q_x - P_y) dA") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∬" />
        <span>(<em className="italic">Qₓ − P_y</em>) dA</span>
      </span>
    );
  }
  if (cleanTex === "\\oint_C (P\\,dx + Q\\,dy)" || cleanTex === "\\oint_C (P dx + Q dy)") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∮" sub="C" />
        <span>(<em className="italic">P</em> dx + <em className="italic">Q</em> dy)</span>
      </span>
    );
  }
  if (cleanTex === "\\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA" || cleanTex === "\\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <Integral symbol="∬" sub="D" />
        <span className="text-base font-light text-[var(--ink-soft)]">(</span>
        <Fraction num="∂Q" den="∂x" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">−</span>
        <Fraction num="∂P" den="∂y" />
        <span className="text-base font-light text-[var(--ink-soft)]">)</span>
        <span className="ml-0.5">dA</span>
      </span>
    );
  }

  // 13. Stoke's Theorem exact formulas
  if (cleanTex === "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot\\hat{n}\\,dS = \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}" || cleanTex === "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot\\hat{\\mathbf{n}}\\,dS = \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}" || cleanTex === "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot\\hat{n}dS = \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}") {
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <Integral symbol="∬" sub="S" />
        <span className="flex items-center gap-1">
          <span>(∇ × <Vector name="F" />)</span>
          <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
          <span><strong className="font-sans font-bold text-[var(--ink)]">n̂</strong> dS</span>
        </span>
        <span className="mx-1 sm:mx-2 font-sans font-bold text-base text-[var(--rose)]">=</span>
        <Integral symbol="∮" sub="C" />
        <span className="flex items-center gap-1">
          <Vector name="F" />
          <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
          <span>d<Vector name="r" color="var(--ink)" /></span>
        </span>
      </span>
    );
  }
  if (cleanTex === "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∮" sub="C" />
        <Vector name="F" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="r" color="var(--ink)" /></span>
      </span>
    );
  }
  if (cleanTex === "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∬" sub="S" />
        <span>(∇ × <Vector name="F" />)</span>
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="S" color="var(--ink)" /></span>
      </span>
    );
  }

  // 14. Gauss Divergence Theorem exact formulas
  if (cleanTex === "\\oiint_S \\mathbf{F}\\cdot\\hat{n}\\,dS = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV" || cleanTex === "\\oiint_S \\mathbf{F}\\cdot\\hat{\\mathbf{n}}\\,dS = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV" || cleanTex === "\\oiint_S \\mathbf{F}\\cdot\\hat{n}dS = \\iiint_V (\\nabla\\cdot\\mathbf{F})dV") {
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <Integral symbol="∯" sub="S" />
        <span className="flex items-center gap-1">
          <Vector name="F" />
          <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
          <span><strong className="font-sans font-bold text-[var(--ink)]">n̂</strong> dS</span>
        </span>
        <span className="mx-1 sm:mx-2 font-sans font-bold text-base text-[var(--amber)]">=</span>
        <Integral symbol="∭" sub="V" />
        <span className="flex items-center gap-1">
          <span>(∇ · <Vector name="F" />) dV</span>
        </span>
      </span>
    );
  }
  if (cleanTex === "\\nabla\\cdot\\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}") {
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2 font-serif sm:font-mono text-xs sm:text-sm flex-wrap justify-center">
        <span>∇ · <Vector name="F" /></span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <Fraction num="∂F₁" den="∂x" />
        <span className="font-sans text-[var(--ink-soft)]">+</span>
        <Fraction num="∂F₂" den="∂y" />
        <span className="font-sans text-[var(--ink-soft)]">+</span>
        <Fraction num="∂F₃" den="∂z" />
      </span>
    );
  }
  if (cleanTex === "\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S}" || cleanTex === "\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∯" sub="S" />
        <Vector name="F" />
        <span className="mx-0.5 font-sans text-[var(--ink-soft)]">·</span>
        <span>d<Vector name="S" color="var(--ink)" /></span>
      </span>
    );
  }
  if (cleanTex === "\\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV" || cleanTex === "\\iiint_V (\\nabla\\cdot\\mathbf{F}) dV") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <Integral symbol="∭" sub="V" />
        <span>(∇ · <Vector name="F" />) dV</span>
      </span>
    );
  }
  if (cleanTex === "\\nabla\\cdot\\mathbf{F} = 0" || cleanTex === "\\nabla \\cdot \\mathbf{F} = 0") {
    return (
      <span className="inline-flex items-center gap-1 font-serif sm:font-mono text-xs sm:text-sm">
        <span>∇ · <Vector name="F" /></span>
        <span className="mx-1 font-sans font-semibold text-[var(--ink-soft)]">=</span>
        <strong className="font-sans font-bold text-[var(--ink)]">0</strong>
      </span>
    );
  }

  // 15. General Fallback Parser (for any custom or unmapped math strings)
  const parsed = cleanTex
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([A-Za-z0-9]+)\}/g, '$1')
    .replace(/\\hat\{\\mathbf\{([A-Za-z0-9]+)\}\}/g, '$1̂')
    .replace(/\\hat\{([A-Za-z0-9]+)\}/g, '$1̂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\partial/g, '∂')
    .replace(/\\phi/g, 'φ')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\oint_C/g, '∮_C')
    .replace(/\\oint/g, '∮')
    .replace(/\\iint_S/g, '∬_S')
    .replace(/\\iint_D/g, '∬_D')
    .replace(/\\iint/g, '∬')
    .replace(/\\oiint_S/g, '∯_S')
    .replace(/\\oiint/g, '∯')
    .replace(/\\iiint_V/g, '∭_V')
    .replace(/\\iiint/g, '∭')
    .replace(/\\int_([A-Za-z0-9]+)\^([A-Za-z0-9]+)/g, '∫_$1^$2')
    .replace(/\\int_([A-Za-z0-9]+)/g, '∫_$1')
    .replace(/\\int/g, '∫')
    .replace(/\\,/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/_1/g, '₁')
    .replace(/_2/g, '₂')
    .replace(/_3/g, '₃')
    .replace(/\^2/g, '²')
    .replace(/\\+/g, ''); // Strip any leftover stray backslashes completely

  return <span className="font-serif sm:font-mono text-xs sm:text-sm inline-block">{parsed}</span>;
}

export function Equation({ tex, label }: { tex: string; label?: string }) {
  return (
    <div
      className="rounded-lg px-4 py-3.5 overflow-x-auto my-3 shadow-xs transition-all"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      {label && (
        <div className="text-xs font-mono-data mb-2 font-semibold tracking-wide" style={{ color: 'var(--ink)' }}>
          {label}
        </div>
      )}
      <div className="flex justify-center text-center py-1 font-medium select-text">
        {renderHumanMath(tex, true)}
      </div>
    </div>
  );
}

export function Inline({ tex }: { tex: string }) {
  return (
    <span className="inline-flex align-baseline font-medium mx-0.5 select-text">
      {renderHumanMath(tex, false)}
    </span>
  );
}


export function Readout({
  label,
  value,
  accent,
}: {
  label: ReactNode | string;
  value: number | string;
  accent?: string;
}) {
  const display = typeof value === 'number' ? value.toFixed(4) : value;
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-2.5 my-1.5 transition-all shadow-2xs"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      <div className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
        {label}
      </div>
      <span
        className="font-mono-data text-base font-bold tabular-nums"
        style={{ color: accent ?? 'var(--ink)' }}
      >
        {display}
      </span>
    </div>
  );
}

export function PillarCard({
  title,
  icon,
  accent = 'var(--teal)',
  children,
}: {
  title: string;
  icon?: ReactNode;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 sm:p-5 border space-y-3 transition-all shadow-xs my-4"
      style={{
        backgroundColor: 'var(--panel)',
        borderColor: 'var(--line)',
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold">
        <span className="shrink-0" style={{ color: accent }}>
          {icon ?? <HelpCircle className="w-5 h-5" />}
        </span>
        <span style={{ color: 'var(--ink)' }}>{title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '')}</span>
      </div>
      <div className="text-sm leading-relaxed space-y-2.5" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </div>
  );
}

export function IntuitionBox({
  title = 'Core Analogy & Intuition',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const cleanTitle = title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '');
  return (
    <div
      className="rounded-xl p-4 border space-y-2 my-3"
      style={{
        backgroundColor: 'var(--panel-2)',
        borderColor: 'var(--amber)',
        borderLeft: '4px solid var(--amber)',
      }}
    >
      <div className="font-display font-bold text-sm flex items-center gap-2">
        <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
        <span style={{ color: 'var(--ink)' }}>{cleanTitle}</span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </div>
  );
}

export function ControlGuide({
  items,
}: {
  items: { label: string; desc: string; badgeColor?: string }[];
}) {
  return (
    <div className="space-y-2 my-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 p-2.5 rounded-lg border text-xs sm:text-sm"
          style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
        >
          <span
            className="font-semibold shrink-0 px-2 py-0.5 rounded text-xs uppercase tracking-wider"
            style={{
              backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'var(--line)',
              color: item.badgeColor ?? 'var(--ink)',
              border: `1px solid ${item.badgeColor ? `${item.badgeColor}55` : 'var(--line)'}`,
            }}
          >
            {item.label}
          </span>
          <span style={{ color: 'var(--ink-soft)' }} className="flex-1">
            {item.desc}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ImpactBox({
  items,
}: {
  items: { title: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
      {items.map((item, idx) => {
        const cleanTitle = item.title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '');
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl border space-y-1.5 transition-all hover:border-[var(--teal)]"
            style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
          >
            <div className="font-display font-bold text-xs sm:text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 shrink-0 text-[var(--teal)]" />
              <span style={{ color: 'var(--ink)' }}>{cleanTitle}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

