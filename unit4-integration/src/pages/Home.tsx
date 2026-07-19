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
          className="flex-1 min-h-0 min-w-0 rounded-xl border p-4 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-xs gap-6"
          style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)' }}
        >
          {activeTab === 'welcome' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between min-w-0">

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-w-0">
                {/* Card 1: Vector Field */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between group hover:scale-[1.015] transition-all duration-300 shadow-xs hover:shadow-lg space-y-4"
                  style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--teal)' }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--teal)' }} />
                        <span>1. The Vector Field</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--teal)]/30 text-[var(--teal)] bg-[var(--teal)]/10">
                        Field Concept
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] aspect-[16/10] max-h-44 sm:max-h-48 w-full flex items-center justify-center">
                      <svg viewBox="0 0 300 180" className="w-full h-full">
                        <defs>
                          <pattern id="grid-vf-exact" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="300" height="180" fill="url(#grid-vf-exact)" />
                        
                        {/* Coordinate Axes */}
                        <g opacity="0.6">
                          <line x1="20" y1="160" x2="280" y2="160" stroke="var(--ink-soft)" strokeWidth="1" />
                          <line x1="20" y1="160" x2="20" y2="20" stroke="var(--ink-soft)" strokeWidth="1" />
                          <polygon points="280,157 286,160 280,163" fill="var(--ink-soft)" />
                          <polygon points="17,20 20,14 23,20" fill="var(--ink-soft)" />
                          <text x="275" y="152" fill="var(--ink-soft)" fontSize="10" fontFamily="sans-serif" fontStyle="italic">x</text>
                          <text x="26" y="24" fill="var(--ink-soft)" fontSize="10" fontFamily="sans-serif" fontStyle="italic">y</text>
                        </g>

                        {/* Swirling rotational field vectors F(-y, x) centered around (150, 90) */}
                        {[
                          [60, 45, 18, 14], [110, 45, 22, 6], [160, 45, 24, -2], [210, 45, 18, -12], [250, 45, 10, -18],
                          [60, 90, 8, 20],  [110, 90, 14, 16], [160, 90, 20, 0],  [210, 90, 14, -16], [250, 90, 8, -20],
                          [60, 135, -10, 18],[110, 135, -18, 12],[160, 135, -24, 2],[210, 135, -22, -6],[250, 135, -18, -14]
                        ].map(([x, y, dx, dy], idx) => {
                          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                          return (
                            <g key={idx} transform={`translate(${x}, ${y})`} className="transition-all duration-300 group-hover:scale-115">
                              <circle cx="0" cy="0" r="1.5" fill="var(--teal)" opacity="0.6" />
                              <line x1="0" y1="0" x2={dx} y2={dy} stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
                              <polygon
                                points="0,-2.5 7,0 0,2.5"
                                transform={`translate(${dx}, ${dy}) rotate(${angle})`}
                                fill="var(--teal)"
                              />
                            </g>
                          );
                        })}

                        {/* Equation label floating */}
                        <g transform="translate(185, 28)">
                          <rect x="0" y="0" width="102" height="22" rx="4" fill="var(--panel-2)" stroke="var(--teal)" strokeWidth="0.8" opacity="0.9" />
                          <text x="51" y="14" fill="var(--teal)" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">F = P i + Q j</text>
                        </g>
                      </svg>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-soft)]">
                      Imagine a weather map where every single point has an arrow indicating wind speed and direction, or a flowing river where currents push around rocks.
                    </p>
                  </div>

                  <div
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-lg border flex items-center justify-center transition-all group-hover:border-[var(--teal)]/60 shadow-inner"
                    style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--teal)' }}
                  >
                    <Inline tex="\\mathbf{F}(x,y,z) = P\\,\\mathbf{i} + Q\\,\\mathbf{j} + R\\,\\mathbf{k}" />
                  </div>
                </div>

                {/* Card 2: Line Integral */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between group hover:scale-[1.015] transition-all duration-300 shadow-xs hover:shadow-lg space-y-4"
                  style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--amber)' }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--amber)' }} />
                        <span>2. The Line Integral</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--amber)]/30 text-[var(--amber)] bg-[var(--amber)]/10">
                        Work Done
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] aspect-[16/10] max-h-44 sm:max-h-48 w-full flex items-center justify-center">
                      <svg viewBox="0 0 300 180" className="w-full h-full">
                        <rect width="300" height="180" fill="url(#grid-vf-exact)" />
                        
                        {/* Background field vectors (muted) */}
                        {[
                          [50, 45, 16, 4], [130, 45, 18, 2], [220, 45, 14, 6], [270, 45, 12, 8],
                          [50, 90, 18, -2], [130, 90, 16, -4], [220, 90, 18, -2], [270, 90, 14, 0],
                          [50, 135, 20, -6], [130, 135, 16, -8], [220, 135, 16, -4], [270, 135, 14, -2]
                        ].map(([x, y, dx, dy], idx) => (
                          <g key={idx} transform={`translate(${x}, ${y})`} opacity="0.25">
                            <line x1="0" y1="0" x2={dx} y2={dy} stroke="var(--ink-soft)" strokeWidth="1.5" />
                            <polygon points="0,-2 6,0 0,2" transform={`translate(${dx}, ${dy}) rotate(${Math.atan2(dy, dx) * (180 / Math.PI)})`} fill="var(--ink-soft)" />
                          </g>
                        ))}

                        {/* Curve C */}
                        <path
                          d="M 35 145 C 95 165, 115 45, 185 65 C 235 80, 255 115, 275 95"
                          fill="none"
                          stroke="var(--amber)"
                          strokeWidth="3"
                          strokeDasharray="6,4"
                          className="animate-[dash_15s_linear_infinite]"
                        />

                        {/* Start point A and End point B */}
                        <g transform="translate(35, 145)">
                          <circle cx="0" cy="0" r="4" fill="var(--amber)" />
                          <text x="-5" y="14" fill="var(--amber)" fontSize="10" fontWeight="bold">A</text>
                        </g>
                        <g transform="translate(275, 95)">
                          <circle cx="0" cy="0" r="4" fill="var(--amber)" />
                          <text x="6" y="4" fill="var(--amber)" fontSize="10" fontWeight="bold">B</text>
                        </g>

                        {/* Curve label C */}
                        <text x="140" y="55" fill="var(--amber)" fontSize="12" fontWeight="bold" fontStyle="italic">C</text>

                        {/* Points on curve showing tangent dr vs Field F */}
                        {[
                          { x: 82, y: 112, dx_tan: 16, dy_tan: -22, dx_f: 22, dy_f: -4 },
                          { x: 160, y: 56, dx_tan: 22, dy_tan: 6, dx_f: 18, dy_f: -4 },
                          { x: 230, y: 92, dx_tan: 16, dy_tan: 12, dx_f: 18, dy_f: -2 }
                        ].map((pt, idx) => (
                          <g key={`pt-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
                            {/* Tangent vector dr */}
                            <line x1="0" y1="0" x2={pt.dx_tan} y2={pt.dy_tan} stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" />
                            <polygon
                              points="0,-3 8,0 0,3"
                              transform={`translate(${pt.dx_tan}, ${pt.dy_tan}) rotate(${Math.atan2(pt.dy_tan, pt.dx_tan) * (180 / Math.PI)})`}
                              fill="var(--amber)"
                            />
                            {/* Field vector F at that point */}
                            <line x1="0" y1="0" x2={pt.dx_f} y2={pt.dy_f} stroke="var(--teal)" strokeWidth="1.8" strokeDasharray="3,2" />
                            <polygon
                              points="0,-2.5 6,0 0,2.5"
                              transform={`translate(${pt.dx_f}, ${pt.dy_f}) rotate(${Math.atan2(pt.dy_f, pt.dx_f) * (180 / Math.PI)})`}
                              fill="var(--teal)"
                            />
                            <circle cx="0" cy="0" r="3.5" fill="#fff" stroke="var(--amber)" strokeWidth="1.5" />
                          </g>
                        ))}

                        {/* Legend / Key */}
                        <g transform="translate(15, 18)">
                          <rect x="0" y="0" width="115" height="26" rx="4" fill="var(--panel-2)" stroke="var(--line)" strokeWidth="0.8" opacity="0.9" />
                          <line x1="8" y1="13" x2="24" y2="13" stroke="var(--amber)" strokeWidth="2.5" />
                          <text x="28" y="16" fill="var(--ink)" fontSize="9">dr (Tangent)</text>
                          <line x1="68" y1="13" x2="82" y2="13" stroke="var(--teal)" strokeWidth="1.8" strokeDasharray="3,2" />
                          <text x="86" y="16" fill="var(--ink)" fontSize="9">F</text>
                        </g>
                      </svg>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-soft)]">
                      Imagine walking along a path inside that windy field. A line integral calculates exactly how much the wind helps or fights you along every step of your walk (<strong className="text-white">Work Done</strong>).
                    </p>
                  </div>

                  <div
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-lg border flex items-center justify-center transition-all group-hover:border-[var(--amber)]/60 shadow-inner"
                    style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--amber)' }}
                  >
                    <Inline tex="W = \\int_C \\mathbf{F}\\cdot d\\mathbf{r}" />
                  </div>
                </div>

                {/* Card 3: Surface Integral */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between group hover:scale-[1.015] transition-all duration-300 shadow-xs hover:shadow-lg space-y-4"
                  style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--rose)' }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--rose)' }} />
                        <span>3. The Surface Integral</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--rose)]/30 text-[var(--rose)] bg-[var(--rose)]/10">
                        Flux Flow
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] aspect-[16/10] max-h-44 sm:max-h-48 w-full flex items-center justify-center">
                      <svg viewBox="0 0 300 180" className="w-full h-full">
                        <rect width="300" height="180" fill="url(#grid-vf-exact)" />
                        
                        {/* Background field lines passing through */}
                        {[
                          [70, 150, 15, -45], [110, 150, 15, -45], [150, 150, 15, -45], [190, 150, 15, -45], [230, 150, 15, -45]
                        ].map(([x, y, dx, dy], idx) => (
                          <line key={`bg-${idx}`} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="var(--ink-soft)" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.3" />
                        ))}

                        {/* Surface S wireframe 3D dome patch */}
                        <g className="transition-all duration-300 group-hover:scale-103">
                          {/* Base outline */}
                          <path
                            d="M 45 125 Q 150 55 255 125 Q 150 165 45 125 Z"
                            fill="var(--rose)"
                            fillOpacity="0.18"
                            stroke="var(--rose)"
                            strokeWidth="2"
                          />
                          {/* Contour grid lines across dome */}
                          <path d="M 45 125 Q 150 90 255 125" fill="none" stroke="var(--rose)" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
                          <path d="M 85 107 Q 150 140 215 107" fill="none" stroke="var(--rose)" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
                          <path d="M 150 72 L 150 145" fill="none" stroke="var(--rose)" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
                          <path d="M 100 87 Q 110 130 100 137" fill="none" stroke="var(--rose)" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
                          <path d="M 200 87 Q 190 130 200 137" fill="none" stroke="var(--rose)" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />

                          {/* Highlighted differential patch dS */}
                          <path
                            d="M 130 96 L 170 96 L 175 116 L 125 116 Z"
                            fill="var(--rose)"
                            fillOpacity="0.4"
                            stroke="#fff"
                            strokeWidth="1.5"
                          />
                          <text x="178" y="112" fill="#fff" fontSize="10" fontWeight="bold">dS</text>
                        </g>

                        {/* Normal vectors n emerging perpendicularly from surface patches */}
                        {[
                          { x: 150, y: 106, dx: 0, dy: -38, label: 'n̂' },
                          { x: 95, y: 115, dx: -14, dy: -34, label: '' },
                          { x: 205, y: 115, dx: 14, dy: -34, label: '' },
                          { x: 150, y: 135, dx: 0, dy: -32, label: '' }
                        ].map((nv, idx) => {
                          const angle = Math.atan2(nv.dy, nv.dx) * (180 / Math.PI);
                          return (
                            <g key={`nv-${idx}`} transform={`translate(${nv.x}, ${nv.y})`}>
                              <circle cx="0" cy="0" r="3" fill="var(--rose)" />
                              <line x1="0" y1="0" x2={nv.dx} y2={nv.dy} stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" />
                              <polygon
                                points="0,-3.5 9,0 0,3.5"
                                transform={`translate(${nv.dx}, ${nv.dy}) rotate(${angle})`}
                                fill="var(--rose)"
                              />
                              {nv.label && (
                                <text x={nv.dx + 8} y={nv.dy} fill="var(--rose)" fontSize="12" fontWeight="bold">{nv.label}</text>
                              )}
                            </g>
                          );
                        })}

                        {/* Surface S label */}
                        <text x="60" y="80" fill="var(--rose)" fontSize="14" fontWeight="bold" fontStyle="italic">S</text>
                      </svg>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-soft)]">
                      Imagine holding up a window screen or fishing net in the wind. A surface integral measures how much total air or water flows straight through the mesh of your screen (<strong className="text-white">Flux</strong>).
                    </p>
                  </div>

                  <div
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-lg border flex items-center justify-center transition-all group-hover:border-[var(--rose)]/60 shadow-inner"
                    style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--rose)' }}
                  >
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

