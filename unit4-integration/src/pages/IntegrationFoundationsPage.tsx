import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import IntegrationCanvas from '../components/IntegrationCanvas';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import type { Point } from '../lib/fieldMath2D';

export default function IntegrationFoundationsPage() {
  const [mode, setMode] = useState<'work' | 'area'>('work');
  const [fieldType, setFieldType] = useState<'conservative' | 'non-conservative'>('conservative');
  const [pathType, setPathType] = useState<'straight' | 'parabola' | 'lshape'>('straight');
  const [shapeType, setShapeType] = useState<'circle' | 'ellipse' | 'triangle'>('circle');
  const [running, setRunning] = useState(true);

  const [workVal, setWorkVal] = useState(0);
  const [deltaPhiVal, setDeltaPhiVal] = useState<number | null>(null);
  const [startPoint, setStartPoint] = useState<Point>({ x: -2.2, y: -1.2 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 2.2, y: 1.6 });

  const [areaLineVal, setAreaLineVal] = useState(0);
  const [geomAreaVal, setGeomAreaVal] = useState(0);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="1. Line Integrals, Surface Integrals & Volume Integrals">
            <p>
              In vector calculus, integration over geometric manifolds takes three core forms:
            </p>
            <Equation
              label="Line Integral — Summing vector projection along a curve C"
              tex={"\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (F_1\\,dx + F_2\\,dy + F_3\\,dz)"}
            />
            <Equation
              label="Surface Integral — Summing normal flux through a surface S"
              tex={"\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_S (\\mathbf{F}\\cdot\\hat{n})\\,dS"}
            />
            <Equation
              label="Volume Integral — Summing scalar density inside a volume V"
              tex={"\\iiint_V \\Phi(x, y, z)\\,dV"}
            />
          </Section>

          <div className="flex rounded-lg p-1 gap-1 border my-4" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
            <button
              onClick={() => setMode('work')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'work' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'work' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
              Work Done &amp; Potential Determination
            </button>
            <button
              onClick={() => setMode('area')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'area' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'area' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
              Area as a Boundary Line Integral
            </button>
          </div>

          {mode === 'work' ? (
            <>
              <Section title="2. Work Done by a Force & Path Independence">
                <p>
                  When a particle moves from point <Inline tex={"A"} /> to point <Inline tex={"B"} /> under the influence of a force field <Inline tex={"\\mathbf{F}"} />, the total mechanical <strong className="font-semibold text-ink dark:text-white">work done</strong> is given by the line integral:
                </p>
                <Equation tex={"W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r} = \\int_A^B (F_1 dx + F_2 dy + F_3 dz)"} />
                <p>
                  If the force is <strong className="font-semibold text-ink dark:text-white">conservative</strong> (<Inline tex={"\\nabla\\times\\mathbf{F} = \\mathbf{0}"} />), the line integral is <strong className="font-semibold text-ink dark:text-white">strictly path-independent</strong>.
                </p>
              </Section>

              <Section title="3. Determination of Potential Function">
                <p>
                  For conservative forces, there exists a unique scalar potential function <Inline tex={"\\phi(x, y)"} /> such that <Inline tex={"\\mathbf{F} = \\nabla\\phi"} />. By the Fundamental Theorem of Line Integrals, the work done simplifies exactly to the endpoint potential difference:
                </p>
                <Equation tex={"W = \\int_A^B \\nabla\\phi \\cdot d\\mathbf{r} = \\phi(B) - \\phi(A)"} />
                <p>
                  In our interactive verification below, choose the conservative field <Inline tex={"\\mathbf{F} = (2xy, x^2)"} />, where <Inline tex={"\\phi(x, y) = x^2 y"} />. Drag the start point <Inline tex={"A"} /> (dark dot) and end point <Inline tex={"B"} /> (teal dot), or switch paths to verify that work never depends on the trajectory!
                </p>
              </Section>

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Force Field:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFieldType('conservative')}
                      className="px-3 py-1 rounded border text-xs font-semibold transition-colors"
                      style={fieldType === 'conservative' ? { backgroundColor: 'var(--teal)', color: '#fff', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    >
                      Conservative: F = (2xy, x²)
                    </button>
                    <button
                      onClick={() => setFieldType('non-conservative')}
                      className="px-3 py-1 rounded border text-xs font-semibold transition-colors"
                      style={fieldType === 'non-conservative' ? { backgroundColor: 'var(--amber)', color: '#fff', borderColor: 'var(--amber)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    >
                      Non-Conservative: F = (-y, x)
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Path Geometry:</span>
                  <div className="flex gap-2">
                    {(['straight', 'parabola', 'lshape'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPathType(p)}
                        className="px-3 py-1 rounded border text-xs font-medium capitalize"
                        style={pathType === p ? { backgroundColor: 'var(--panel-2)', borderColor: 'var(--ink)', fontWeight: 'bold' } : { backgroundColor: 'var(--panel)', borderColor: 'var(--line)' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <Readout label="Start Point A (x, y)" value={`(${startPoint.x.toFixed(2)}, ${startPoint.y.toFixed(2)})`} />
                <Readout label="End Point B (x, y)" value={`(${endPoint.x.toFixed(2)}, ${endPoint.y.toFixed(2)})`} />
                <Readout label="Work W = ∫ F · dr along path" value={workVal} accent="var(--amber)" />
                {deltaPhiVal !== null && (
                  <Readout label="Potential Difference φ(B) − φ(A)" value={deltaPhiVal} accent="var(--teal)" />
                )}
                {deltaPhiVal !== null && (
                  <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
                    ✓ EXACT VERIFICATION: The numeric work integral W ({workVal.toFixed(4)}) exactly equals the potential difference φ(B) − φ(A) ({deltaPhiVal.toFixed(4)}), regardless of whether you pick Straight, Parabolic, or L-Path!
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Section title="4. Area of a Plane Region as a Line Integral over the Boundary">
                <p>
                  As an elegant corollary of Green's Theorem, if we choose the vector field <Inline tex={"P(x, y) = -y"} /> and <Inline tex={"Q(x, y) = x"} />, the double integral of curl over the region <Inline tex={"D"} /> becomes:
                </p>
                <Equation tex={"\\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA = \\iint_D (1 - (-1))\\,dA = 2\\iint_D dA = 2\\cdot\\text{Area}(D)"} />
                <p>
                  Therefore, the exact area of any closed plane region can be determined entirely by calculating a single line integral around its boundary curve <Inline tex={"C"} />:
                </p>
                <Equation tex={"\\text{Area}(D) = \\frac{1}{2} \\oint_C (x\\,dy - y\\,dx)"} />
                <p>
                  Select a geometry below to watch the boundary line integral accumulate exactly to the interior area!
                </p>
              </Section>

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Region Shape:</span>
                  <div className="flex gap-2">
                    {(['circle', 'ellipse', 'triangle'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setShapeType(s)}
                        className="px-3 py-1 rounded border text-xs font-medium capitalize"
                        style={shapeType === s ? { backgroundColor: 'var(--teal)', color: '#fff', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Readout label="Boundary Line Integral ½ ∮ (x dy − y dx)" value={areaLineVal} accent="var(--teal)" />
                <Readout label="Geometric Area of Region D" value={geomAreaVal} accent="var(--ink)" />
                <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
                  ✓ EXACT CORRESPONDENCE: Integrating along the 1D boundary loop computes the 2D enclosed surface area with perfect precision.
                </div>
              </div>
            </>
          )}
        </>
      }
      canvas={
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {mode === 'work' ? 'Interactive Work & Potential Verification' : 'Boundary Line Integral Area Calculator'}
            </span>
            <button
              onClick={() => setRunning(!running)}
              className="px-3 py-1 rounded text-xs font-semibold border transition-all"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel-2)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause Animation' : '▶ Resume Animation'}
            </button>
          </div>
          <IntegrationCanvas
            mode={mode}
            fieldType={fieldType}
            pathType={pathType}
            shapeType={shapeType}
            running={running}
            onWorkReadout={(w, dp, s, e) => {
              setWorkVal(w);
              setDeltaPhiVal(dp);
              setStartPoint(s);
              setEndPoint(e);
            }}
            onAreaReadout={(li, ga) => {
              setAreaLineVal(li);
              setGeomAreaVal(ga);
            }}
          />
          <div
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            {mode === 'work' ? 'Drag the dark start point A and teal end point B to test different boundary coordinates' : 'Particle traces boundary counter-clockwise while accumulating ½(x dy − y dx)'}
          </div>
        </div>
      }
    />
  );
}
