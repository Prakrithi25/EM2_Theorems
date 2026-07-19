import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Lightbulb,
  Rocket,
  Plane,
  Radio,
  CloudRain,
  Map,
  Boxes,
  RotateCw,
  Globe,
  Maximize2,
  ArrowRight,
} from 'lucide-react';
import { Inline } from '../components/MathPanel';

type CardTab = 'welcome' | 'big_picture' | 'modules';

const MODULES = [
  {
    to: '/foundations',
    title: '1. Line, Surface & Volume Integrals',
    subtitle: 'Building Blocks of Vector Calculus',
    desc: 'Explore how fields interact with curves (Work) and surfaces (Flux).',
    icon: Boxes,
    accent: 'var(--teal)',
  },
  {
    to: '/greens',
    title: "2. Green's Theorem in the Plane",
    subtitle: 'Circulation & Swirl',
    desc: 'See why walking the boundary loop equals summing microscopic rotations inside.',
    icon: RotateCw,
    accent: 'var(--amber)',
  },
  {
    to: '/stokes',
    title: "3. Stoke's Theorem (3D Space)",
    subtitle: 'Boundary Loops & 3D Domes',
    desc: 'Verify that boundary circulation equals total rotational flux across any capping dome.',
    icon: Globe,
    accent: 'var(--teal)',
  },
  {
    to: '/gauss',
    title: '4. Gauss Divergence Theorem',
    subtitle: 'Surface Outflow vs. Internal Power',
    desc: 'Watch outward surface flow exactly balance the sum of interior sources and sinks.',
    icon: Maximize2,
    accent: 'var(--rose)',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<CardTab>('welcome');

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden px-4 sm:px-8 py-5 w-full gap-4">
      {/* Top Title Bar */}
      <div className="shrink-0 flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
            Welcome to the Vector Integration Interactive Lab
          </h1>
          <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>
            Select a topic tab on the left to explore theory, intuition, and interactive simulations.
          </p>
        </div>
      </div>

      {/* Main Split Container: Vertical Tabs on Left + Display Panel on Right */}
      <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-4 overflow-hidden">
        {/* Vertical Tabs Sidebar */}
        <div
          className="shrink-0 w-full sm:w-60 md:w-64 flex flex-row sm:flex-col gap-1.5 p-2 rounded-xl border overflow-x-auto sm:overflow-y-auto"
          style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
        >
          <button
            onClick={() => setActiveTab('welcome')}
            className={`flex items-center gap-2.5 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-left whitespace-nowrap sm:whitespace-normal ${
              activeTab === 'welcome'
                ? 'bg-[var(--panel)] border border-[var(--line)] text-[var(--teal)] shadow-xs font-bold'
                : 'border border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--panel)]/50'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Welcome &amp; Intuition</span>
          </button>

          <button
            onClick={() => setActiveTab('big_picture')}
            className={`flex items-center gap-2.5 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-left whitespace-nowrap sm:whitespace-normal ${
              activeTab === 'big_picture'
                ? 'bg-[var(--panel)] border border-[var(--line)] text-[var(--amber)] shadow-xs font-bold'
                : 'border border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--panel)]/50'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>The Big Picture</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2.5 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-left whitespace-nowrap sm:whitespace-normal ${
              activeTab === 'modules'
                ? 'bg-[var(--panel)] border border-[var(--line)] text-[var(--rose)] shadow-xs font-bold'
                : 'border border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--panel)]/50'
            }`}
          >
            <Rocket className="w-4 h-4 shrink-0" />
            <span>Interactive Modules</span>
          </button>
        </div>

        {/* Main Content Display Panel */}
        <div
          className="flex-1 min-h-0 rounded-xl border p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-xs"
          style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)' }}
        >
          {activeTab === 'welcome' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: 'var(--teal)' }}>
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span>What is Vector Integration in Plain English?</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                  Have you ever looked at calculus formulas and wondered what they actually mean in real life? This interactive visualizer explains <strong className="text-white">Unit IV: Vector Integration</strong> from the ground up so anyone—even complete beginners—can intuitively grasp these powerful theorems without getting lost in math jargon.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div>
                    <div className="text-base font-bold mb-1" style={{ color: 'var(--teal)' }}>1. The Vector Field</div>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      Imagine a weather map where every single point has an arrow indicating wind speed and direction, or a flowing river where currents push around rocks.
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-semibold px-2.5 py-1.5 rounded border flex items-center justify-center" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--teal)' }}>
                    <Inline tex="\\mathbf{F}(x,y,z) = P\\,\\mathbf{i} + Q\\,\\mathbf{j} + R\\,\\mathbf{k}" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div>
                    <div className="text-base font-bold mb-1" style={{ color: 'var(--amber)' }}>2. The Line Integral</div>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      Imagine walking along a path inside that windy field. A line integral calculates exactly how much the wind helps or fights you along every step of your walk (<strong className="text-white">Work Done</strong>).
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-semibold px-2.5 py-1.5 rounded border flex items-center justify-center" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--amber)' }}>
                    <Inline tex="W = \\int_C \\mathbf{F}\\cdot d\\mathbf{r}" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div>
                    <div className="text-base font-bold mb-1" style={{ color: 'var(--rose)' }}>3. The Surface Integral</div>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      Imagine holding up a window screen or fishing net in the wind. A surface integral measures how much total air or water flows straight through the mesh of your screen (<strong className="text-white">Flux</strong>).
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-semibold px-2.5 py-1.5 rounded border flex items-center justify-center" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--rose)' }}>
                    <Inline tex="\\Phi = \\iint_S \\mathbf{F}\\cdot \\hat{\\mathbf{n}}\\,dS" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'big_picture' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: 'var(--amber)' }}>
                  <Lightbulb className="w-5 h-5 shrink-0" />
                  <span>The Golden Rule of Vector Theorems</span>
                </h2>
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--amber)', borderLeft: '4px solid var(--amber)' }}>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium" style={{ color: 'var(--ink)' }}>
                    At their core, Green&apos;s, Stoke&apos;s, and Gauss&apos;s theorems are <strong className="text-white">magical shortcuts</strong>. They prove that a difficult calculation happening across a complicated interior 2D area or 3D volume can always be solved by simply checking what happens along the outer boundary edge!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5" style={{ color: 'var(--teal)' }}>
                    <Plane className="w-4 h-4 shrink-0" />
                    <span>Aerodynamics &amp; Flight</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Stoke&apos;s and Green&apos;s theorems explain how air circulating around airplane wing profiles generates upward lift and wingtip vortices.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5" style={{ color: 'var(--amber)' }}>
                    <Radio className="w-4 h-4 shrink-0" />
                    <span>Electromagnetism (Maxwell’s Laws)</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Gauss and Stoke&apos;s theorems form the exact mathematical bedrock of electricity, magnetism, radio waves, and smartphone antenna design.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5" style={{ color: 'var(--rose)' }}>
                    <CloudRain className="w-4 h-4 shrink-0" />
                    <span>Weather &amp; Ocean Modeling</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Meteorologists use divergence and circulation integrals to track hurricanes, jet streams, and oceanic thermal currents.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}>
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5" style={{ color: 'var(--teal)' }}>
                    <Map className="w-4 h-4 shrink-0" />
                    <span>Digital Mapping &amp; Land Area</span>
                  </div>
                  <p className="text-xs leading-relaxed flex flex-wrap items-center gap-1" style={{ color: 'var(--ink-soft)' }}>
                    <span>GPS devices and surveying software use boundary line integrals</span>
                    <Inline tex="\\oint (x\\,dy - y\\,dx)" />
                    <span>to instantly compute the acreage of irregular land plots.</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: 'var(--rose)' }}>
                  <Rocket className="w-5 h-5 shrink-0" />
                  <span>Interactive Modules — Choose a Simulation to Launch</span>
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Each simulation features interactive controls, live mathematical readouts, and plain-English step-by-step guides.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <NavLink
                      key={m.to}
                      to={m.to}
                      className="flex flex-col justify-between rounded-xl p-4 border transition-all hover:scale-[1.01] shadow-xs hover:shadow-md group"
                      style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2.5 rounded-lg border shrink-0 flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: m.accent }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <h3 className="font-display text-sm font-bold group-hover:underline truncate" style={{ color: m.accent }}>
                              {m.title}
                            </h3>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] truncate">
                              {m.subtitle}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--ink)]">
                          {m.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-colors group-hover:text-[var(--teal)]" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                        <span>Launch Simulation</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

