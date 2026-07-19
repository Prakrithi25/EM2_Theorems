import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import IntegrationCanvas from '../components/IntegrationCanvas';
import { Section, Equation, Readout, Inline, PillarCard, IntuitionBox, ControlGuide, ImpactBox } from '../components/MathPanel';
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
          <div className="flex rounded-lg p-1 gap-1 border my-4" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
            <button
              onClick={() => setMode('work')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${mode === 'work' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'work' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
            Mode 1: Work Done &amp; Potential
            </button>
            <button
              onClick={() => setMode('area')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${mode === 'area' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              style={mode === 'area' ? { backgroundColor: 'var(--panel)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
            Mode 2: Area via Boundary Integral
            </button>
          </div>

          {mode === 'work' ? (
            <>
              <PillarCard title="What is this Simulation?" accent="var(--teal)">
                <p>
                  You are watching a particle move from start point <strong className="text-white">A</strong> to end point <strong className="text-white">B</strong> inside a windy 2D force field. The arrows represent the magnitude and direction of the force at every point in space.
                </p>
              </PillarCard>

              <IntuitionBox title="Why Do We Have This? (The Mountain Hiking Analogy)">
                Imagine hiking from the base of a mountain to its summit. Whether you take the steep, straight staircase, a gentle winding path, or an L-shaped trail, your total climb in gravitational elevation (<strong className="text-white">Potential Energy Difference</strong>) is exactly identical! 
                <br /><br />
                When a force behaves just like gravity—where total work depends strictly on your start and end point and <em className="text-[var(--teal)]">never on the path chosen</em>—we call it a <strong className="text-white font-semibold">Conservative Field</strong>.
              </IntuitionBox>

              <Section title="The Formula & Path Independence">
                <p>
                  The mechanical <strong className="font-semibold text-ink dark:text-white">work done</strong> by a force <Inline tex={"\\mathbf{F}"} /> moving a particle from <Inline tex={"A"} /> to <Inline tex={"B"} /> is:
                </p>
                <Equation tex={"W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r} = \\int_A^B (F_1 dx + F_2 dy)"} />
                <p>
                  If the field is conservative (<Inline tex={"\\nabla\\times\\mathbf{F} = \\mathbf{0}"} />), there exists a scalar potential function <Inline tex={"\\phi(x, y)"} /> such that <Inline tex={"\\mathbf{F} = \\nabla\\phi"} />. The work integral simplifies to just the difference in endpoint potentials:
                </p>
                <Equation tex={"W = \\phi(B) - \\phi(A)"} />
              </Section>

              <ControlGuide
                items={[
                  {
                    label: 'Force Field Toggle',
                    desc: 'Switch to Conservative [F = (2xy, x²)] to verify that work never changes with path choice. Switch to Non-Conservative [F = (-y, x)] to watch how looping around in circles drains or gains energy infinitely!',
                    badgeColor: 'var(--teal)',
                  },
                  {
                    label: 'Path Geometry',
                    desc: 'Click Straight, Parabola, or L-Shape to change the particle’s trajectory across the screen.',
                    badgeColor: 'var(--amber)',
                  },
                  {
                    label: 'Draggable Dots A & B',
                    desc: 'Drag the dark dot (Start A) or teal dot (End B) right on the canvas to test any coordinates you like.',
                    badgeColor: 'var(--rose)',
                  },
                ]}
              />

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Force Field:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFieldType('conservative')}
                      className="px-3 py-1 rounded border text-xs font-semibold transition-all flex items-center gap-1.5"
                      style={fieldType === 'conservative' ? { backgroundColor: 'var(--teal)', color: '#0B0E13', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    >
                      <span>Conservative</span>
                      <Inline tex="\\mathbf{F} = (2xy, x^2)" />
                    </button>
                    <button
                      onClick={() => setFieldType('non-conservative')}
                      className="px-3 py-1 rounded border text-xs font-semibold transition-all flex items-center gap-1.5"
                      style={fieldType === 'non-conservative' ? { backgroundColor: 'var(--amber)', color: '#0B0E13', borderColor: 'var(--amber)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    >
                      <span>Non-Conservative</span>
                      <Inline tex="\\mathbf{F} = (-y, x)" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Path Geometry:</span>
                  <div className="flex gap-1.5">
                    {(['straight', 'parabola', 'lshape'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPathType(p)}
                        className="px-3 py-1 rounded border text-xs font-semibold tracking-wide uppercase transition-all"
                        style={pathType === p ? { backgroundColor: 'var(--teal)', color: '#0B0E13', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <Readout label="Start Point A (x, y)" value={`(${startPoint.x.toFixed(2)}, ${startPoint.y.toFixed(2)})`} />
                <Readout label="End Point B (x, y)" value={`(${endPoint.x.toFixed(2)}, ${endPoint.y.toFixed(2)})`} />
                <Readout
                  label={<span className="flex items-center gap-1.5"><span>Work Done</span><Inline tex="W = \\int_A^B \\mathbf{F}\\cdot d\\mathbf{r}" /></span>}
                  value={workVal}
                  accent="var(--amber)"
                />
                {deltaPhiVal !== null && (
                  <Readout
                    label={<span className="flex items-center gap-1.5"><span>Potential Difference</span><Inline tex="\\phi(B) - \\phi(A)" /></span>}
                    value={deltaPhiVal}
                    accent="var(--teal)"
                  />
                )}
                {deltaPhiVal !== null && (
                  <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
                    ✓ EXACT VERIFICATION: Notice how the numeric work integral W ({workVal.toFixed(4)}) exactly equals the potential difference φ(B) − φ(A) ({deltaPhiVal.toFixed(4)}), regardless of which path you pick!
                  </div>
                )}
              </div>

              <ImpactBox
                items={[
                  {
                    title: 'Roller Coaster Engineering',
                    desc: 'Because gravity is conservative, engineers know a coaster’s speed at the bottom depends only on drop height, not the twists and loops of the track.',
                  },
                  {
                    title: 'Electrical Voltage & Circuits',
                    desc: 'Voltage is simply electrical potential difference. Kirchoff’s Voltage Law works strictly because electrostatic forces are conservative.',
                  },
                ]}
              />
            </>
          ) : (
            <>
              <PillarCard title="What is this Simulation?" accent="var(--teal)">
                <p>
                  You are watching a digital pen trace around the boundary fence <Inline tex={"C"} /> of a 2D geometric shape counter-clockwise while continuously computing a special boundary line integral.
                </p>
              </PillarCard>

              <IntuitionBox title="Why Do We Have This? (The Perimeter-to-Area Magic)">
                How can walking around the outside perimeter fence of a farm tell you how many square feet of grass are growing inside the pasture—without ever measuring the interior? 
                <br /><br />
                By choosing a special vector field <Inline tex={"(-y, x)"} /> where the internal rotational curl is constant throughout space, Green&apos;s theorem lets us compute 100% exact 2D surface area by doing only a 1D line integral along the boundary!
              </IntuitionBox>

              <Section title="The Area Line Integral Formula">
                <p>
                  By choosing <Inline tex={"P(x, y) = -y"} /> and <Inline tex={"Q(x, y) = x"} />, Green&apos;s theorem gives the exact enclosed area of any shape <Inline tex={"D"} /> directly from its boundary loop <Inline tex={"C"} />:
                </p>
                <Equation tex={"\\text{Area}(D) = \\frac{1}{2} \\oint_C (x\\,dy - y\\,dx)"} />
              </Section>

              <ControlGuide
                items={[
                  {
                    label: 'Shape Buttons',
                    desc: 'Click Circle, Ellipse, or Triangle to swap out the geometric region and watch the boundary integral re-accumulate.',
                    badgeColor: 'var(--teal)',
                  },
                  {
                    label: 'Numeric Readouts',
                    desc: 'Compare the accumulating Boundary Line Integral against the exact Geometric Area formulas [πR², πab, ½bh]. They match with 100% precision!',
                    badgeColor: 'var(--amber)',
                  },
                ]}
              />

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <div className="flex flex-wrap items-center justify-between text-sm gap-2">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Region Shape:</span>
                  <div className="flex gap-1.5">
                    {(['circle', 'ellipse', 'triangle'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setShapeType(s)}
                        className="px-3 py-1 rounded border text-xs font-semibold tracking-wide uppercase transition-all"
                        style={shapeType === s ? { backgroundColor: 'var(--teal)', color: '#0B0E13', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Readout
                  label={<span className="flex items-center gap-1.5"><span>Boundary Line Integral</span><Inline tex="\\frac{1}{2} \\oint_C (x\\,dy - y\\,dx)" /></span>}
                  value={areaLineVal}
                  accent="var(--teal)"
                />
                <Readout label="Geometric Area of Region D" value={geomAreaVal} accent="var(--ink)" />
                <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
                  ✓ EXACT CORRESPONDENCE: Integrating along the 1D outer boundary computes the 2D interior area with perfect precision!
                </div>
              </div>

              <ImpactBox
                items={[
                  {
                    title: 'Mechanical Planimeters',
                    desc: 'Cartographers and surveyors use handheld physical devices called planimeters that trace map boundaries to read out exact acreage using this exact formula.',
                  },
                  {
                    title: 'GPS Land Surveying & GIS',
                    desc: 'When you walk around a plot of land with a GPS tracker, surveying software computes your land area instantly using this line integral.',
                  },
                ]}
              />
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

