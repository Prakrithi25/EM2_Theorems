import { useMemo, useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GaussScene from '../components/GaussScene';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import { makeRadialField, sphereFlux, sphereVolumeIntegral } from '../lib/fieldMath3D';

export default function GaussPage() {
  const [strength, setStrength] = useState(0.6);
  const [radius, setRadius] = useState(2);
  const [running, setRunning] = useState(true);
  const [showSlice, setShowSlice] = useState(true);

  const field = useMemo(() => makeRadialField(strength), [strength]);
  const flux = useMemo(() => sphereFlux(field, radius, 50, 80), [field, radius]);
  const vol = useMemo(() => sphereVolumeIntegral(field, radius, 60), [field, radius]);
  const diff = Math.abs(flux - vol);

  const kind = strength > 0.02 ? 'source' : strength < -0.02 ? 'sink' : 'neutral';

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Gauss's Divergence Theorem">
            <p>
              Gauss's theorem is the 3D-volume version of the same idea: what flows out through a
              closed surface equals how much the field is "expanding" everywhere inside it.
            </p>
          </Section>

          <Equation tex={"\\oiint_{\\partial V} \\mathbf{F}\\cdot d\\mathbf{S} \\;=\\; \\iiint_V (\\nabla\\cdot\\mathbf{F})\\, dV"} />

          <Section title="What each side means">
            <p>
              <strong style={{ color: 'var(--ink)' }}>Left side — outward flux:</strong> at every
              point on the closed surface <Inline tex={"\\partial V"} /> (the sphere), project the
              field onto the outward normal and add it up. Particles streaming outward (or inward)
              show this directly.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Right side — divergence volume:</strong> at
              every point inside, <Inline tex={"\\nabla\\cdot\\mathbf{F}"} /> measures how much the
              field is "spreading out" locally. The cross-section slice colors this: teal for
              expanding, rose for contracting.
            </p>
            <p>
              Here <Inline tex={"\\mathbf{F} = k(x,y,z)"} />, so divergence is a constant{' '}
              <Inline tex={"3k"} /> everywhere — flip the sign to turn the sphere from a source into
              a sink, and resize it to see both readouts scale together.
            </p>
          </Section>

          <Section title="Field strength">
            <label className="flex flex-col gap-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
              <span>
                k = {strength.toFixed(2)} ({kind})
              </span>
              <input
                type="range"
                min={-1.2}
                max={1.2}
                step={0.02}
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
              />
            </label>
            <p className="pt-1">
              Negative values pull particles inward (sink); positive values push them outward
              (source). Zero gives a static, divergence-free field.
            </p>
          </Section>

          <Section title="Live readouts">
            <Readout label="∬ F·dS  — surface flux" value={flux} accent="var(--amber)" />
            <Readout label="∭ (∇·F) dV  — volume integral" value={vol} accent="var(--teal)" />
            <Readout label="|difference|" value={diff} />
          </Section>
        </>
      }
      canvas={
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className="flex flex-wrap items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
          >
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause flow' : '▶ Animate flow'}
            </button>
            <button
              onClick={() => setShowSlice((s) => !s)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border"
              style={{
                borderColor: 'var(--line)',
                color: showSlice ? 'var(--panel)' : 'var(--ink)',
                backgroundColor: showSlice ? 'var(--teal)' : 'transparent',
              }}
            >
              Cross-section heatmap
            </button>
            <label className="flex items-center gap-2 text-sm ml-auto" style={{ color: 'var(--ink-soft)' }}>
              Sphere radius
              <input
                type="range"
                min={0.8}
                max={3.5}
                step={0.05}
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-28"
              />
            </label>
          </div>
          <GaussScene strength={strength} radius={radius} running={running} showSlice={showSlice} />
          <div
            className="px-4 py-2 text-xs border-t"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Drag to orbit · scroll to zoom
          </div>
        </div>
      }
    />
  );
}
