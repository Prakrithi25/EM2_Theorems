import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GaussScene from '../components/GaussScene';
import { Section, Equation, Readout, Inline, PillarCard, IntuitionBox, ControlGuide, ImpactBox } from '../components/MathPanel';
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
          <Section title="4. Gauss Divergence Theorem (Without Proof)">
            <p>
              The <strong className="font-semibold text-ink dark:text-white">Gauss Divergence Theorem</strong> links the 2D total outward flux of a vector field <Inline tex={"\\mathbf{F}"} /> across a closed bounding surface <Inline tex={"S"} /> to the 3D volume integral of the divergence inside the enclosed solid container <Inline tex={"V"} />.
            </p>
            <Equation
              label="Gauss Divergence Theorem — Surface flux equals interior divergence volume integral"
              tex={"\\oiint_S \\mathbf{F}\\cdot\\hat{n}\\,dS = \\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV"}
            />
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
              <li>
                <strong className="font-semibold text-ink dark:text-white">Surface Integral (Outward Flux):</strong> Measures net fluid or energy leaving right across the spherical boundary skin per unit time.
              </li>
              <li>
                <strong className="font-semibold text-ink dark:text-white">Volume Integral (Divergence Sum):</strong> Sums the expansion rate (<Inline tex={"\\nabla\\cdot\\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}"} />) inside every microscopic cubic inch of volume.
              </li>
            </ul>
          </Section>

          <PillarCard title="What is this Simulation?" accent="var(--rose)">
            <p>
              You are peering into a 3D translucent spherical container placed inside a radial vector field. Glowing vectors show fluid either spraying outward (<strong className="text-[var(--teal)] font-semibold">Source</strong>, green arrows) or sucking inward (<strong className="text-[var(--rose)] font-semibold">Sink</strong>, pink arrows).
            </p>
          </PillarCard>

          <IntuitionBox title="Why Do We Have This? (The Leaky Hose in a Porous Balloon)">
            Imagine wrapping a porous, stretchy rubber balloon completely around a sprinkler head that is pumping water inside. How much total water sprays out through the skin of the balloon per second (<span className="font-semibold text-[var(--ink)]">Outward Surface Flux</span> <Inline tex="\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S}" />)?
            <br /><br />
            Common sense tells us that the total outflow through the balloon&apos;s skin must exactly match the rate at which water is being created by the leaky sprinkler head trapped inside (<span className="font-semibold text-[var(--ink)]">Volume Divergence</span> <Inline tex="\\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV" />)! If no water is created or destroyed inside (<Inline tex="\\nabla\\cdot\\mathbf{F} = 0" />), whatever enters from one side must exit the other. That is Gauss&apos;s Divergence Theorem!
          </IntuitionBox>

          <ControlGuide
            items={[
              {
                label: 'Field Strength Slider (k)',
                desc: 'Drag positive (k > 0) to turn on an outward-blowing Source (green arrows). Drag negative (k < 0) to turn on an inward-sucking Sink (pink arrows). Set to 0 for calm.',
                badgeColor: 'var(--teal)',
              },
              {
                label: 'Sphere Radius Slider (R)',
                desc: 'Expand or shrink the spherical balloon. Notice how both the Outward Flux and Volume Integral grow proportionally to 4πkR³, always matching with 100% precision!',
                badgeColor: 'var(--amber)',
              },
              {
                label: 'Cross-Section & Navigation',
                desc: 'Toggle the equatorial cross-section plane to inspect the internal core divergence. Click and drag the mouse to rotate the 3D sphere from any angle!',
                badgeColor: 'var(--rose)',
              },
            ]}
          />

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

            <Readout
              label={<span className="flex items-center gap-1.5"><span>Total Outward Surface Flux</span><Inline tex="\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S}" /></span>}
              value={flux}
              accent="var(--teal)"
            />
            <Readout
              label={<span className="flex items-center gap-1.5"><span>Volume Integral of Divergence</span><Inline tex="\\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV" /></span>}
              value={volInt}
              accent="var(--amber)"
            />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ GAUSS VERIFICATION: Notice that the 2D surface flux integral and the 3D interior divergence integral evaluate to identical values across every radius and field strength!
            </div>
          </div>

          <ImpactBox
            items={[
              {
                title: 'Gauss’s Law in Electrostatics',
                desc: 'This exact theorem forms the first of Maxwell’s Equations—allowing engineers to compute electric fields around charged capacitors and microchips instantly by drawing an imaginary bounding sphere around them.',
              },
              {
                title: 'Thermal & Electronics Cooling',
                desc: 'CPU designers use divergence volume integrals to calculate total heat generation inside processor cores, and surface flux integrals to design cooling fins and fans that remove that exact heat.',
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

