import { useMemo, useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import StokesScene from '../components/StokesScene';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import { FIELDS_3D, type FieldType3D, rimCirculation, surfaceCurlFlux } from '../lib/fieldMath3D';

const BASE_RADIUS = 2;

export default function StokesPage() {
  const [fieldType, setFieldType] = useState<FieldType3D>('swirl');
  const [height, setHeight] = useState(1.6);
  const [running, setRunning] = useState(true);

  const field = FIELDS_3D[fieldType];

  const rim = useMemo(() => rimCirculation(field, BASE_RADIUS, 300), [field]);
  const flux = useMemo(() => surfaceCurlFlux(field, BASE_RADIUS, height, 44, 64), [field, height]);
  const diff = Math.abs(rim - flux);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Stokes' Theorem">
            <p>
              Stokes' theorem lifts Green's theorem into 3D: it relates circulation around the rim
              of a curved surface to the flux of curl passing through that surface.
            </p>
          </Section>

          <Equation tex="\oint_{\partial S} \mathbf{F}\cdot d\mathbf{r} \;=\; \iint_S (\nabla\times\mathbf{F})\cdot d\mathbf{S}" />

          <Section title="What each side means">
            <p>
              <strong style={{ color: 'var(--ink)' }}>Left side — rim circulation:</strong> walk
              once around the boundary curve <Inline tex="\partial S" /> (the amber ring) and add
              up the field's push along your path, shown by the tangent arrows.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Right side — curl flux:</strong> at every
              point on the surface, project the curl of <Inline tex="\mathbf{F}" /> onto the
              surface's normal direction (teal arrows), and add it up over the whole dome.
            </p>
            <p>
              The remarkable part: the surface can be <em>any</em> shape spanning that same rim —
              flat disk, tall dome, anything — and the flux integral never changes. Drag the height
              slider and watch the flux readout hold steady.
            </p>
          </Section>

          <Section title="Field">
            <div className="grid grid-cols-1 gap-2">
              {Object.values(FIELDS_3D).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFieldType(f.id)}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: fieldType === f.id ? 'var(--teal)' : 'var(--panel-2)',
                    color: fieldType === f.id ? 'var(--panel)' : 'var(--ink)',
                    border: '1px solid var(--line)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="pt-1">{field.description}</p>
          </Section>

          <Section title="Live readouts">
            <Readout label="∮ F·dr  — rim circulation" value={rim} accent="var(--amber)" />
            <Readout label="∬ (∇×F)·dS  — curl flux" value={flux} accent="var(--teal)" />
            <Readout label="|difference|" value={diff} />
            <p className="text-xs pt-1">
              Both numbers are computed independently — one only knows about the rim, the other
              only about the surface. That they agree, for every height you try, is the theorem.
            </p>
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
              {running ? '⏸ Pause walker' : '▶ Animate walker'}
            </button>
            <label className="flex items-center gap-2 text-sm ml-auto" style={{ color: 'var(--ink-soft)' }}>
              Dome height (0 = flat disk)
              <input
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-32"
              />
            </label>
          </div>
          <StokesScene fieldType={fieldType} height={height} running={running} />
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
