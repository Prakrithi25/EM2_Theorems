import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import StokesScene from '../components/StokesScene';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
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
          <Section title="Stoke's Theorem (Without Proof)">
            <p>
              **Stoke's Theorem** is the 3D generalization of Green's theorem, connecting the circulation of a spatial vector field around a closed boundary loop <Inline tex={"C"} /> to the surface flux of the curl across any smooth oriented surface <Inline tex={"S"} /> bounded by <Inline tex={"C"} />.
            </p>
            <p className="font-semibold pt-1" style={{ color: 'var(--ink)' }}>
              Statement (Verification &amp; Evaluation):
            </p>
            <Equation tex={"\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla\\times\\mathbf{F}) \\cdot d\\mathbf{S}"} />
            <p>
              Notice that the surface <Inline tex={"S"} /> can be **any** capping dome sharing the boundary <Inline tex={"C"} />. Changing the dome height alters the surface normal vectors and local area elements, but the total flux of <Inline tex={"\\nabla\\times\\mathbf{F}"} /> remains invariant and strictly equal to the rim circulation!
            </p>
          </Section>

          <Section title="Interactive 3D Evaluation">
            <p>
              Use the controls below to vary the dome height and select different spatial vector fields. Watch how the surface integral <Inline tex={"\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}"} /> stays constant as the surface puffs up or flattens!
            </p>
          </Section>

          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>3D Vector Field:</span>
              <div className="flex gap-1.5">
                {(['swirl', 'shear', 'uniform'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldType(f)}
                    className="px-3 py-1 rounded border text-xs font-medium capitalize"
                    style={fieldType === f ? { backgroundColor: 'var(--teal)', color: '#fff', borderColor: 'var(--teal)' } : { backgroundColor: 'var(--panel-2)', color: 'var(--ink)', borderColor: 'var(--line)' }}
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

            <Readout label="Rim Circulation ∮ C F · dr" value={circulation} accent="var(--amber)" />
            <Readout label="Surface Curl Flux ∬ S (∇×F) · dS" value={curlFlux} accent="var(--teal)" />
            <div className="p-3 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--panel-2)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ✓ STOKE&apos;S VERIFICATION: The circulation around the fixed circular rim strictly equals the flux of curl through the 3D dome, regardless of height profile.
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
