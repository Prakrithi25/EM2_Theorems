import { useState, memo } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GradientExplorer from '../components/GradientExplorer';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';

type VerticalTab = 'gradient' | 'derivative' | 'telemetry';

// Memoized Tab 1: Gradient of a Scalar Field (∇f)
const GradientTabContent = memo(function GradientTabContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Section title="1. Gradient of a Scalar Field (∇f)">
        <p>
          When the vector differential operator <Inline tex={"\\nabla"} /> acts on a scalar potential field <Inline tex={"f(x, y)"} />, it produces the <strong className="font-semibold text-ink dark:text-white">Gradient vector field</strong>:
        </p>
        <Equation
          label="Gradient Vector — Points toward the direction of steepest uphill slope"
          tex={"\\nabla f = \\frac{\\partial f}{\\partial x}\\hat{\\imath} + \\frac{\\partial f}{\\partial y}\\hat{\\jmath}"}
        />
        <div className="p-4 rounded-lg text-sm leading-relaxed border space-y-2" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
          <p className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--teal)' }}>
            Key Geometric Properties on the Canvas:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
            <li>
              <strong className="font-semibold text-ink dark:text-white">Perpendicular to Contours:</strong> The bold <strong className="font-semibold text-teal-600 dark:text-teal-400">Teal Arrow (<Inline tex={"\\nabla f"} />)</strong> always points strictly perpendicular (orthogonal) to the contour curve <Inline tex={"f(x,y)=c"} /> passing through point <Inline tex={"P(x,y)"} />.
            </li>
            <li>
              <strong className="font-semibold text-ink dark:text-white">Magnitude = Steepness:</strong> As you drag <Inline tex={"P(x,y)"} /> outwards away from the center <Inline tex={"(0,0)"} />, the contour lines get closer together (steeper incline), and the <strong className="font-semibold text-ink dark:text-white">teal arrow grows dynamically longer</strong> (<Inline tex={"|\\nabla f|"} /> increases).
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
});

// Memoized Tab 2: Directional Derivative (D_û f)
const DerivativeTabContent = memo(function DerivativeTabContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Section title="2. Directional Derivative (D_û f)">
        <p>
          While the gradient gives the maximum rate of change, the <strong className="font-semibold text-ink dark:text-white">Directional Derivative</strong> gives the instantaneous rate of change of <Inline tex={"f"} /> when walking in any chosen unit direction <Inline tex={"\\hat{u}"} />:
        </p>
        <Equation
          label="Directional Derivative — Projection of gradient onto direction û"
          tex={"D_{\\hat{u}} f = \\nabla f \\cdot \\hat{u} = |\\nabla f| \\cos\\theta"}
        />
        <div className="p-4 rounded-lg text-sm leading-relaxed border space-y-2" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
          <p className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--amber)' }}>
            How the Amber Probe Works:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
            <li>
              <strong className="font-semibold text-ink dark:text-white">Maximum Ascent (<Inline tex={"\\theta = 0^\\circ"} />):</strong> When you rotate the <strong className="font-semibold text-amber-600 dark:text-amber-400">Amber Arrow (<Inline tex={"\\hat{u}"} />)</strong> to align parallel with the Teal Arrow, <Inline tex={"\\cos\\theta = 1"} /> and the rate of change reaches its maximum positive value (<Inline tex={"+|\\nabla f|"} />).
            </li>
            <li>
              <strong className="font-semibold text-ink dark:text-white">Zero Change / Tangent (<Inline tex={"\\theta = 90^\\circ, 270^\\circ"} />):</strong> When <Inline tex={"\\hat{u}"} /> is perpendicular to <Inline tex={"\\nabla f"} /> (tangent to the contour curve), <Inline tex={"\\cos\\theta = 0"} />. You walk along level ground without changing altitude.
            </li>
            <li>
              <strong className="font-semibold text-ink dark:text-white">Maximum Descent (<Inline tex={"\\theta = 180^\\circ"} />):</strong> When pointing opposite to the gradient, <Inline tex={"\\cos\\theta = -1"} />, giving the steepest downhill descent (<Inline tex={"-|\\nabla f|"} />).
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
});

// Interactive Live Telemetry Tab 3 with editable inputs that directly drive the simulation
function TelemetryTabContent({
  point,
  grad,
  dirDeriv,
  angleDeg,
  aligned,
  onChangePoint,
  onChangeAngleDeg,
}: {
  point: { x: number; y: number };
  grad: { gx: number; gy: number };
  dirDeriv: number;
  angleDeg: number;
  aligned: number;
  onChangePoint: (p: { x: number; y: number }) => void;
  onChangeAngleDeg: (a: number) => void;
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Section title="3. Interactive Simulation Telemetry">
        <p>
          You can either drag on the right canvas, or <strong className="font-semibold text-ink dark:text-white">directly type and adjust values below</strong> to control the point position, gradient vector, and probe angle right on the field:
        </p>
      </Section>

      {/* Editable Point & Gradient Panel */}
      <div className="p-4 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
        <div className="text-xs font-mono-data font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Point Coordinates &amp; Gradient Vector (f(x,y) = x² + 2y²)
        </div>

        {/* X and Y coordinate inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              Point X: {point.x.toFixed(2)}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-3.6"
                max="3.6"
                step="0.1"
                value={point.x}
                onChange={(e) => onChangePoint({ x: parseFloat(e.target.value) || 0, y: point.y })}
                className="flex-1 accent-teal-600 cursor-pointer"
              />
              <input
                type="number"
                step="0.1"
                value={point.x.toFixed(2)}
                onChange={(e) => onChangePoint({ x: parseFloat(e.target.value) || 0, y: point.y })}
                className="w-16 px-2 py-1 text-xs font-mono-data rounded border text-center font-bold bg-white dark:bg-gray-800 text-ink dark:text-white"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              Point Y: {point.y.toFixed(2)}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-3.6"
                max="3.6"
                step="0.1"
                value={point.y}
                onChange={(e) => onChangePoint({ x: point.x, y: parseFloat(e.target.value) || 0 })}
                className="flex-1 accent-teal-600 cursor-pointer"
              />
              <input
                type="number"
                step="0.1"
                value={point.y.toFixed(2)}
                onChange={(e) => onChangePoint({ x: point.x, y: parseFloat(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-xs font-mono-data rounded border text-center font-bold bg-white dark:bg-gray-800 text-ink dark:text-white"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
          </div>
        </div>

        {/* Gradient components gx = 2x, gy = 4y inputs */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
          <div>
            <label className="block text-[11px] font-semibold mb-1 text-teal-600 dark:text-teal-400">
              ∇f Component (gx = 2x):
            </label>
            <input
              type="number"
              step="0.2"
              value={grad.gx.toFixed(2)}
              onChange={(e) => {
                const newGx = parseFloat(e.target.value) || 0;
                onChangePoint({ x: newGx / 2, y: point.y });
              }}
              className="w-full px-2.5 py-1.5 text-xs font-mono-data rounded border font-bold bg-white dark:bg-gray-800 text-ink dark:text-white"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1 text-teal-600 dark:text-teal-400">
              ∇f Component (gy = 4y):
            </label>
            <input
              type="number"
              step="0.2"
              value={grad.gy.toFixed(2)}
              onChange={(e) => {
                const newGy = parseFloat(e.target.value) || 0;
                onChangePoint({ x: point.x, y: newGy / 4 });
              }}
              className="w-full px-2.5 py-1.5 text-xs font-mono-data rounded border font-bold bg-white dark:bg-gray-800 text-ink dark:text-white"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
        </div>
      </div>

      {/* Editable Probe Angle Panel */}
      <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
        <div className="text-xs font-mono-data font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Probe Direction Angle (θ in degrees)
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={angleDeg > 180 ? angleDeg - 360 : angleDeg}
            onChange={(e) => {
              let a = parseFloat(e.target.value) || 0;
              if (a < 0) a += 360;
              onChangeAngleDeg(a);
            }}
            className="flex-1 accent-amber-600 cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="1"
              value={angleDeg.toFixed(0)}
              onChange={(e) => {
                let a = parseFloat(e.target.value) || 0;
                while (a < 0) a += 360;
                while (a >= 360) a -= 360;
                onChangeAngleDeg(a);
              }}
              className="w-16 px-2 py-1 text-xs font-mono-data rounded border text-center font-bold bg-white dark:bg-gray-800 text-ink dark:text-white"
              style={{ borderColor: 'var(--line)' }}
            />
            <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>°</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-mono-data opacity-80" style={{ color: 'var(--ink-soft)' }}>
          <button onClick={() => onChangeAngleDeg(0)} className="hover:underline text-amber-600 dark:text-amber-400 font-bold">0° (Max Ascent)</button>
          <button onClick={() => onChangeAngleDeg(90)} className="hover:underline font-bold">90° (Level / Tangent)</button>
          <button onClick={() => onChangeAngleDeg(180)} className="hover:underline text-indigo-600 dark:text-indigo-400 font-bold">180° (Max Descent)</button>
        </div>
      </div>

      {/* Calculated Readout & Status */}
      <div className="space-y-3 pt-2">
        <Readout label="D_û f (Instantaneous Rate along û)" value={dirDeriv} accent="var(--amber)" />
        <div
          className="p-3.5 rounded-lg text-xs font-semibold leading-relaxed transition-all duration-150"
          style={{ backgroundColor: 'var(--panel-2)', color: 'var(--ink)', border: '1px solid var(--line)' }}
        >
          {Math.abs(aligned) > 0.98
            ? 'MAXIMUM ASCENT/DESCENT: Your direction û is aligned with the gradient vector ∇f.'
            : Math.abs(aligned) < 0.05
            ? 'ZERO CHANGE (TANGENT): Your probe direction û is perpendicular to gradient ∇f (tangent to contour).'
            : 'INTERMEDIATE RATE: Rotating û continuously scales the rate of change proportional to cos(θ).'}
        </div>
      </div>
    </div>
  );
}

export default function Unit3Page() {
  const [activeTab, setActiveTab] = useState<VerticalTab>('gradient');
  const [point, setPoint] = useState({ x: 1.2, y: 0.8 });
  const [grad, setGrad] = useState({ gx: 2.4, gy: 3.2 });
  const [dirDeriv, setDirDeriv] = useState(0);
  const [angleDeg, setAngleDeg] = useState(51.5);

  const gradMag = Math.hypot(grad.gx, grad.gy);
  const aligned = gradMag > 1e-6 ? dirDeriv / gradMag : 0;

  return (
    <ModuleLayout
      guide={
        <div className="flex flex-col sm:flex-row flex-1 min-h-0 h-full overflow-hidden">
          {/* Smart Vertical Spine (Compact fixed 64px rail on desktop so tabs NEVER scroll) */}
          <div className="w-full sm:w-16 flex flex-row sm:flex-col gap-2.5 shrink-0 sm:border-r sm:pr-4 p-4 sm:p-6 sm:pb-6 overflow-y-auto sm:overflow-y-visible" style={{ borderColor: 'var(--line)' }}>
            {/* Tab 1: Gradient */}
            <button
              onClick={() => setActiveTab('gradient')}
              title="1. Gradient of a Scalar Field (∇f)"
              className={`flex-1 sm:flex-initial flex flex-row sm:flex-col items-center justify-center py-2 sm:py-4 px-2 rounded-xl transition-all cursor-pointer border relative group ${
                activeTab === 'gradient' ? 'shadow-md scale-100' : 'opacity-60 hover:opacity-100 border-transparent hover:scale-[1.02]'
              }`}
              style={
                activeTab === 'gradient'
                  ? { backgroundColor: 'var(--panel-2)', color: 'var(--teal)', borderColor: 'var(--teal)' }
                  : { color: 'var(--ink)' }
              }
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-data text-xs font-bold shrink-0 transition-all ${
                  activeTab === 'gradient' ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30' : 'bg-gray-500/10'
                }`}
              >
                01
              </span>
              <span className="hidden sm:inline [writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider uppercase py-2">
                Gradient
              </span>
              <span className="sm:hidden ml-1.5 text-xs font-bold">Gradient</span>
            </button>

            {/* Tab 2: Directional Deriv */}
            <button
              onClick={() => setActiveTab('derivative')}
              title="2. Directional Derivative (D_û f)"
              className={`flex-1 sm:flex-initial flex flex-row sm:flex-col items-center justify-center py-2 sm:py-4 px-2 rounded-xl transition-all cursor-pointer border relative group ${
                activeTab === 'derivative' ? 'shadow-md scale-100' : 'opacity-60 hover:opacity-100 border-transparent hover:scale-[1.02]'
              }`}
              style={
                activeTab === 'derivative'
                  ? { backgroundColor: 'var(--panel-2)', color: 'var(--amber)', borderColor: 'var(--amber)' }
                  : { color: 'var(--ink)' }
              }
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-data text-xs font-bold shrink-0 transition-all ${
                  activeTab === 'derivative' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-gray-500/10'
                }`}
              >
                02
              </span>
              <span className="hidden sm:inline [writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider uppercase py-2">
                Derivative
              </span>
              <span className="sm:hidden ml-1.5 text-xs font-bold">Deriv.</span>
            </button>

            {/* Tab 3: Telemetry */}
            <button
              onClick={() => setActiveTab('telemetry')}
              title="3. Interactive Simulation Telemetry"
              className={`flex-1 sm:flex-initial flex flex-row sm:flex-col items-center justify-center py-2 sm:py-4 px-2 rounded-xl transition-all cursor-pointer border relative group ${
                activeTab === 'telemetry' ? 'shadow-md scale-100' : 'opacity-60 hover:opacity-100 border-transparent hover:scale-[1.02]'
              }`}
              style={
                activeTab === 'telemetry'
                  ? { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }
                  : { color: 'var(--ink)' }
              }
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-data text-xs font-bold shrink-0 transition-all ${
                  activeTab === 'telemetry' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30' : 'bg-gray-500/10'
                }`}
              >
                03
              </span>
              <span className="hidden sm:inline [writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider uppercase py-2">
                Telemetry
              </span>
              <span className="sm:hidden ml-1.5 text-xs font-bold">Telemetry</span>
            </button>
          </div>

          {/* Active Tab Content Area — Gets ~90% width of the left panel and scrolls independently! */}
          <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6">
            <div className={activeTab === 'gradient' ? 'block' : 'hidden'}>
              <GradientTabContent />
            </div>
            <div className={activeTab === 'derivative' ? 'block' : 'hidden'}>
              <DerivativeTabContent />
            </div>
            <div className={activeTab === 'telemetry' ? 'block' : 'hidden'}>
              <TelemetryTabContent
                point={point}
                grad={grad}
                dirDeriv={dirDeriv}
                angleDeg={angleDeg}
                aligned={aligned}
                onChangePoint={(p) => setPoint(p)}
                onChangeAngleDeg={(a) => setAngleDeg(a)}
              />
            </div>
          </div>
        </div>
      }
      canvas={
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Directional Derivative &amp; Gradient Simulation
            </span>
            <span className="text-xs font-mono-data font-medium" style={{ color: 'var(--ink-soft)' }}>
              Field: f(x, y) = x² + 2y²
            </span>
          </div>
          <GradientExplorer
            externalPoint={point}
            externalAngleDeg={angleDeg}
            onReadouts={(p, g, d, a) => {
              setPoint(p);
              setGrad(g);
              setDirDeriv(d);
              setAngleDeg(a);
            }}
          />
        </div>
      }
    />
  );
}
