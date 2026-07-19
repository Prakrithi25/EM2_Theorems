import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GreensCanvas from '../components/GreensCanvas';
import { Section, Equation, Readout, Inline, PillarCard, IntuitionBox, ControlGuide, ImpactBox } from '../components/MathPanel';
import type { FieldType2D, Point } from '../lib/fieldMath2D';
import { RotateCw, Settings } from 'lucide-react';

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
          <Section title="2. Green's Theorem for Scalar Point Functions">
            <p>
              <strong className="font-semibold text-[var(--ink)]">Green&apos;s Theorem</strong> is the bridge between a 1D line integral walking around a boundary loop <Inline tex={"C"} /> and a 2D double integral over the flat area <Inline tex={"D"} /> enclosed inside that loop.
            </p>
            <Equation
              label="Green's Theorem in the Plane (Tangential / Circulation Form)"
              tex={"\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA"}
            />
          </Section>

          <PillarCard title="What is this Simulation?" accent="var(--amber)">
            <p>
              You are looking at a 2D vector field with an interactive boundary ring. Depending on the tab you select below, you either watch glowing particles walk along the outer ring counter-clockwise (<strong className="text-[var(--ink)] font-semibold">Boundary Circulation</strong>) or inspect the microscopic rotating gears spinning right inside the circle (<strong className="text-[var(--ink)] font-semibold">2D Curl</strong>).
            </p>
          </PillarCard>

          <IntuitionBox title="Why Do We Have This? (The Paddle Wheel Swimming Pool)">
            Imagine a swirling swimming pool. If you drop millions of tiny microscopic paddle wheels across the water surface, each wheel will spin on its axis (<strong className="text-[var(--ink)] font-semibold">Curl</strong>).
            <br /><br />
            Now look closely at what happens where two neighboring wheels touch: their teeth move in opposite directions and <em className="text-[var(--amber)] font-semibold">cancel each other out perfectly!</em> The only place where the rotation doesn&apos;t get canceled out is right along the pool&apos;s outer edge wall. Therefore, the sum of all microscopic internal spins strictly equals the total circulation of water rushing around the outer wall!
          </IntuitionBox>

          <div className="flex rounded-lg p-1 gap-1 border my-4 shadow-2xs" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
            <button
              onClick={() => setMode('circulation')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${mode === 'circulation' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'circulation' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)', border: '1px solid var(--line)' } : { color: 'var(--ink)' }}
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Outer Walk</span>
              <Inline tex="\\oint (P\\,dx + Q\\,dy)" />
            </button>
            <button
              onClick={() => setMode('curl')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${mode === 'curl' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'curl' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)', border: '1px solid var(--line)' } : { color: 'var(--ink)' }}
            >
              <Settings className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Inner Gears</span>
              <Inline tex="\\iint (Q_x - P_y)\\,dA" />
            </button>
          </div>

          <ControlGuide
            items={[
              {
                label: 'Vector Field Buttons',
                desc: 'Try Rotation (pure circulation where internal curl is high), Source/Sink (outward/inward flow where curl is exactly 0!), or Saddle.',
                badgeColor: 'var(--teal)',
              },
              {
                label: 'Draggable Center & Radius',
                desc: 'Drag the center dot on the canvas to move the region, or drag the outer handle on the circle edge to grow or shrink the ring size.',
                badgeColor: 'var(--amber)',
              },
              {
                label: 'Live Equation Verification',
                desc: 'Watch the readouts below: the Boundary Line Integral exactly equals the Double Integral of Curl for every field and ring size!',
                badgeColor: 'var(--rose)',
              },
            ]}
          />

          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="flex flex-wrap items-center justify-between text-sm gap-2">
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>2D Vector Field:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['rotation', 'source', 'sink', 'saddle'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldType(f)}
                    className="px-2.5 py-1 rounded border text-xs font-semibold tracking-wide uppercase transition-all"
                    style={fieldType === f ? { backgroundColor: 'var(--teal)', color: '#0B0E13', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <Readout
              label={<span className="flex items-center gap-1.5"><span>Boundary Line Integral</span><Inline tex="\\oint_C (P\\,dx + Q\\,dy)" /></span>}
              value={lineVal}
              accent="var(--amber)"
            />
            <Readout
              label={<span className="flex items-center gap-1.5"><span>Double Integral of Curl</span><Inline tex="\\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA" /></span>}
              value={areaVal}
              accent="var(--teal)"
            />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ THEOREM VERIFICATION: Notice how the circulation around the boundary perfectly equals the total sum of microscopic curl gears inside the domain!
            </div>
          </div>

          <ImpactBox
            items={[
              {
                title: 'Hurricane & Weather Tracking',
                desc: 'Meteorologists use Green’s theorem to calculate total atmospheric vortex circulation around a storm cell directly from regional radar wind measurements.',
              },
              {
                title: 'Airfoil Lift Calculation',
                desc: 'In aerodynamics, 2D Green’s theorem calculates fluid circulation around a wing cross-section, directly yielding lift via the Kutta-Joukowski theorem.',
              },
            ]}
          />
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

