import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GaussScene from '../components/GaussScene';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import { makeRadialField, sphereFlux, sphereVolumeIntegral } from '../lib/fieldMath3D';

export default function GaussPage() {
  const [strength, setStrength] = useState(1.0);
  const [radius, setRadius] = useState(2.2);
  const [showSlice, setShowSlice] = useState(true);
  const [running, setRunning] = useState(true);

  const field = makeRadialField(strength);
  const flux = sphereFlux(field, radius);
  const volInt = sphereVolumeIntegral(field, radius);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Gauss Divergence Theorem (Without Proof)">
            <p>
              The **Gauss Divergence Theorem** links the total outward flux of a vector field <Inline tex={"\\mathbf{F}"} /> across a closed bounding surface <Inline tex={"S"} /> to the volume integral of the divergence inside the enclosed solid region <Inline tex={"V"} />.
            </p>
            <p className="font-semibold pt-1" style={{ color: 'var(--ink)' }}>
              Statement (Verification &amp; Evaluation):
            </p>
            <Equation tex={"\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV"} />
            <p>
              - **Surface Integral (Outward Flux)**: Measures net flow leaving across the spherical boundary per unit time.
            </p>
            <p>
              - **Volume Integral (Divergence Sum)**: Sums the divergence (<Inline tex={"\\nabla\\cdot\\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}"} />) over all interior volume elements.
            </p>
          </Section>

          <Section title="Interactive Evaluation">
            <p>
              In our radial field <Inline tex={"\\mathbf{F} = k\\mathbf{r}"} />, the divergence is strictly constant (<Inline tex={"\\nabla\\cdot\\mathbf{F} = 3k"} />). Vary the source/sink strength <Inline tex={"k"} /> and sphere radius <Inline tex={"R"} /> below to verify that both integrals always evaluate to exactly <Inline tex={"4\\pi k R^3"} />!
            </p>
          </Section>

          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Field Strength k (Source vs Sink):</span>
                <span className="font-mono-data font-medium" style={{ color: strength >= 0 ? 'var(--teal)' : 'var(--rose)' }}>{strength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-[var(--teal)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Sphere Radius R:</span>
                <span className="font-mono-data font-medium" style={{ color: 'var(--ink)' }}>{radius.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full accent-[var(--teal)] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="slice-check"
                checked={showSlice}
                onChange={(e) => setShowSlice(e.target.checked)}
                className="w-4 h-4 accent-[var(--teal)] rounded"
              />
              <label htmlFor="slice-check" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--ink)' }}>
                Show equatorial divergence cross-section plane
              </label>
            </div>

            <Readout label="Total Outward Surface Flux ∯ S F · dS" value={flux} accent="var(--teal)" />
            <Readout label="Volume Integral of Divergence ∭ V (∇·F) dV" value={volInt} accent="var(--amber)" />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ GAUSS VERIFICATION: Notice that the 2D surface flux integral and the 3D interior divergence integral evaluate to identical values across every radius and field strength!
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
              Gauss Divergence 3D Sphere Chamber
            </span>
            <button
              onClick={() => setRunning(!running)}
              className="px-3 py-1 rounded text-xs font-semibold border transition-all"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel-2)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
          <GaussScene strength={strength} radius={radius} running={running} showSlice={showSlice} />
          <div
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Rotate with mouse drag · scroll to zoom · positive strength creates outflow (green), negative creates inflow (pink)
          </div>
        </div>
      }
    />
  );
}
