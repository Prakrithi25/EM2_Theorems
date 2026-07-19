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
              **Green's Theorem** establishes the fundamental connection between a line integral around a simple closed curve <Inline tex={"C"} /> and a double integral over the plane region <Inline tex={"D"} /> bounded by <Inline tex={"C"} />.
            </p>
            <p className="font-semibold pt-1" style={{ color: 'var(--ink)' }}>
              Statement (Verification &amp; Evaluation Without Proof):
            </p>
            <Equation
              tex={"\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA"}
            />
            <p>
              Here, <Inline tex={"P(x,y)"} /> and <Inline tex={"Q(x,y)"} /> are continuous scalar point functions with continuous partial derivatives. The integrand on the right is the **2D scalar curl** (<Inline tex={"\\hat{k}\\cdot(\\nabla\\times\\mathbf{F})"} />).
            </p>
          </Section>

          <Section title="Physical Meaning & Circulation vs. Curl">
            <p>
              - **Left side (Boundary Circulation)**: Sums the tangential push of the vector field <Inline tex={"\\mathbf{F}=(P, Q)"} /> as you walk counter-clockwise around the loop <Inline tex={"C"} />.
            </p>
            <p>
              - **Right side (Interior Area Curl)**: Sums the microscopic rotational spin density across every square unit of area inside the region <Inline tex={"D"} />.
            </p>
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
