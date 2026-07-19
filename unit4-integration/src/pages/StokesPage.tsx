import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import StokesScene from '../components/StokesScene';
import { Section, Equation, Readout, Inline, PillarCard, IntuitionBox, ControlGuide, ImpactBox } from '../components/MathPanel';
import { FIELDS_3D, type FieldType3D, rimCirculation, surfaceCurlFlux } from '../lib/fieldMath3D';

export default function StokesPage() {
  const [fieldType, setFieldType] = useState<FieldType3D>('swirl');
  const [height, setHeight] = useState(1.4);
  const [running, setRunning] = useState(true);

  const field = FIELDS_3D[fieldType];
  const circulation = rimCirculation(field, 2.0);
  const curlFlux = surfaceCurlFlux(field, 2.0, height);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="3. Stoke's Theorem (Without Proof)">
            <p>
              <strong className="font-semibold text-ink dark:text-white">Stoke&apos;s Theorem</strong> is the 3D big brother of Green&apos;s theorem. It connects the 1D circulation of a spatial vector field around a closed boundary rim <Inline tex={"C"} /> to the 2D surface flux of the curl across <strong className="text-white">any</strong> smooth oriented surface dome <Inline tex={"S"} /> sharing that rim.
            </p>
            <Equation
              label="Stoke's Theorem — Surface integral of curl equals boundary circulation"
              tex={"\\iint_S (\\nabla\\times\\mathbf{F})\\cdot\\hat{n}\\,dS = \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}"}
            />
          </Section>

          <PillarCard title="What is this Simulation?" accent="var(--teal)">
            <p>
              You are exploring a 3D interactive chamber containing a circular wire rim <Inline tex={"C"} /> capped by a translucent surface dome <Inline tex={"S"} /> resting inside a 3D wind field. The arrows indicate the 3D vector forces and local curl vectors across the surface.
            </p>
          </PillarCard>

          <IntuitionBox title="Why Do We Have This? (The Butterfly Net & Soap Bubble Analogy)">
            Imagine holding a circular wire hoop in a breezy field. Whether you stretch a flat screen across the hoop, dip a round soap bubble across it, or attach a deep 3-foot butterfly net, <strong className="text-[var(--ink)] font-semibold">the total swirling air captured inside the mesh is 100% identical!</strong>
            <br /><br />
            Why? Because any swirling air that passes through the deep fabric of the net must first enter right across the outer wire ring (<Inline tex="\\oint_C \\mathbf{F}\\cdot d\\mathbf{r}" />). Therefore, you can puff up, squash, or stretch the dome height into any shape, and the total surface integral of curl (<Inline tex="\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}" />) remains strictly invariant and equal to the rim circulation!
          </IntuitionBox>

          <ControlGuide
            items={[
              {
                label: '3D Mouse Navigation',
                desc: 'Click and drag anywhere on the 3D canvas with your mouse to rotate the scene from any viewing angle. Scroll to zoom in or out!',
                badgeColor: 'var(--teal)',
              },
              {
                label: 'Dome Height Slider',
                desc: 'Drag the slider from 0.00 (flat disk) up to 2.50 (tall stretched dome). Watch the surface curve change while the Curl Flux stays locked equal to the Rim Circulation!',
                badgeColor: 'var(--amber)',
              },
              {
                label: '3D Field Selector',
                desc: 'Switch between Swirl (intense vortex), Shear (layered asymmetric wind), and Uniform (constant breeze where both circulation and curl drop to 0).',
                badgeColor: 'var(--rose)',
              },
            ]}
          />

          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>3D Vector Field:</span>
              <div className="flex gap-1.5">
                {(['swirl', 'shear', 'uniform'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldType(f)}
                    className="px-3 py-1 rounded border text-xs font-semibold tracking-wide uppercase transition-all"
                    style={fieldType === f ? { backgroundColor: 'var(--teal)', color: '#0B0E13', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Dome Height Profile:</span>
                <span className="font-mono-data font-medium" style={{ color: 'var(--ink)' }}>{height.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.05"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full accent-[var(--teal)] cursor-pointer"
              />
            </div>

            <Readout
              label={<span className="flex items-center gap-1.5"><span>Rim Circulation</span><Inline tex="\\oint_C \\mathbf{F}\\cdot d\\mathbf{r}" /></span>}
              value={circulation}
              accent="var(--amber)"
            />
            <Readout
              label={<span className="flex items-center gap-1.5"><span>Surface Curl Flux</span><Inline tex="\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}" /></span>}
              value={curlFlux}
              accent="var(--teal)"
            />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ STOKE&apos;S VERIFICATION: The circulation around the fixed circular rim strictly equals the flux of curl through the 3D dome, regardless of height profile.
            </div>
          </div>

          <ImpactBox
            items={[
              {
                title: 'Maxwell’s Electromagnetic Laws',
                desc: 'Faraday’s Law and Ampere’s Law work strictly via Stokes’ theorem—explaining how changing magnetic flux through a coil induces electrical current in generators and transformers.',
              },
              {
                title: 'Aerodynamic Wing Tip Vortices',
                desc: 'Aircraft designers use Stokes’ theorem to relate air velocity circulation around wings directly to the trailing vortices that spin off wing tips during takeoff.',
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
              Stoke&apos;s Theorem 3D Capping Dome
            </span>
            <button
              onClick={() => setRunning(!running)}
              className="px-3 py-1 rounded text-xs font-semibold border transition-all"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel-2)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
          <StokesScene fieldType={fieldType} height={height} running={running} />
          <div
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Rotate scene with mouse drag · scroll to zoom · adjust slider to morph dome curvature
          </div>
        </div>
      }
    />
  );
}

