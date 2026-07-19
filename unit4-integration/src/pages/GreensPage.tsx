import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GreensCanvas from '../components/GreensCanvas';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import type { FieldType2D, Point } from '../lib/fieldMath2D';

export default function GreensPage() {
  const [fieldType, setFieldType] = useState<FieldType2D>('rotation');
  const [mode, setMode] = useState<'circulation' | 'curl'>('circulation');
  const [running, setRunning] = useState(true);
  const [radius, setRadius] = useState(2.2);
  const [center, setCenter] = useState<Point>({ x: 0, y: 0 });
  const [lineVal, setLineVal] = useState(0);
  const [areaVal, setAreaVal] = useState(0);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Green's Theorem for Scalar Point Functions">
            <p>
              <strong className="font-semibold text-ink dark:text-white">Green's Theorem</strong> establishes the fundamental connection between a line integral around a simple closed curve <Inline tex={"C"} /> and a double integral over the plane region <Inline tex={"D"} /> bounded by <Inline tex={"C"} />.
            </p>
            <Equation
              label="Green's Theorem in the Plane (Tangential / Circulation form)"
              tex={"\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA"}
            />
            <p>
              Here, <Inline tex={"P(x,y)"} /> and <Inline tex={"Q(x,y)"} /> are continuous scalar point functions with continuous partial derivatives. The integrand on the right is the <strong className="font-semibold text-ink dark:text-white">2D scalar curl</strong> (<Inline tex={"\\hat{k}\\cdot(\\nabla\\times\\mathbf{F})"} />).
            </p>
            <div className="p-3 rounded-lg border text-sm space-y-1.5" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
              <p className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--teal)' }}>
                🔍 Physical Meaning &amp; Verification Principle:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
                <li>
                  <strong className="font-semibold text-ink dark:text-white">Left side (Boundary Circulation):</strong> Sums the tangential push of the vector field <Inline tex={"\\mathbf{F}=(P, Q)"} /> as you walk counter-clockwise around the loop <Inline tex={"C"} />.
                </li>
                <li>
                  <strong className="font-semibold text-ink dark:text-white">Right side (Interior Area Curl):</strong> Sums the microscopic rotational spin density across every square unit of area inside the region <Inline tex={"D"} />.
                </li>
              </ul>
            </div>
          </Section>

          <div className="flex rounded-lg p-1 gap-1 border my-4" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
            <button
              onClick={() => setMode('circulation')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'circulation' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'circulation' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
              Boundary Walk ∮ (P dx + Q dy)
            </button>
            <button
              onClick={() => setMode('curl')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'curl' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'curl' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
              Interior Spin Gears ∬ (∂Q/∂x − ∂P/∂y) dA
            </button>
          </div>

          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="flex flex-wrap items-center justify-between text-sm gap-2">
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>2D Vector Field:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['rotation', 'source', 'sink', 'saddle'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldType(f)}
                    className="px-2.5 py-1 rounded border text-xs font-medium capitalize"
                    style={fieldType === f ? { backgroundColor: 'var(--teal)', color: '#fff', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <Readout label="Boundary Line Integral ∮ (P dx + Q dy)" value={lineVal} accent="var(--amber)" />
            <Readout label="Double Integral of Curl ∬ (∂Q/∂x − ∂P/∂y) dA" value={areaVal} accent="var(--teal)" />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ THEOREM VERIFICATION: Notice how the circulation around the boundary perfectly equals the total sum of microscopic curl gears inside the domain!
            </div>
          </div>
        </>
      }
      canvas={
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Green&apos;s Theorem Interactive Plane
            </span>
            <button
              onClick={() => setRunning(!running)}
              className="px-3 py-1 rounded text-xs font-semibold border transition-all"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel-2)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
          <GreensCanvas
            fieldType={fieldType}
            mode={mode}
            running={running}
            radius={radius}
            onRadiusChange={setRadius}
            center={center}
            onCenterChange={setCenter}
            onReadouts={(l, a) => {
              setLineVal(l);
              setAreaVal(a);
            }}
          />
          <div
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Drag center circle to move region · drag rightmost handle to resize loop radius
          </div>
        </div>
      }
    />
  );
}
