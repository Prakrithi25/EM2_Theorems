import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GreensCanvas from '../components/GreensCanvas';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';
import { FIELDS_2D, type FieldType2D, type Point } from '../lib/fieldMath2D';

export default function GreensPage() {
  const [fieldType, setFieldType] = useState<FieldType2D>('rotation');
  const [mode, setMode] = useState<'circulation' | 'curl'>('circulation');
  const [running, setRunning] = useState(true);
  const [radius, setRadius] = useState(2.2);
  const [center, setCenter] = useState<Point>({ x: 0, y: 0 });
  const [line, setLine] = useState(0);
  const [area, setArea] = useState(0);

  const field = FIELDS_2D[fieldType];
  const diff = Math.abs(line - area);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Green's Theorem">
            <p>
              Green's theorem connects two ways of measuring rotation in a 2D vector field{' '}
              <Inline tex={"\\mathbf{F} = (P, Q)"} />: walking its boundary, or summing its spin
              over the interior.
            </p>
          </Section>

          <Equation tex={"\\oint_C (P\\,dx + Q\\,dy) \\;=\\; \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA"} />

          <Section title="What each side means">
            <p>
              <strong style={{ color: 'var(--ink)' }}>Left side — circulation:</strong> walk once
              around the closed curve <Inline tex={"C"} /> counter-clockwise, and add up how much
              the field pushes along your direction of travel at every step.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Right side — total curl:</strong> at every
              point inside the region <Inline tex={"D"} />, the quantity{' '}
              <Inline tex={"\\partial Q/\\partial x - \\partial P/\\partial y"} /> measures local
              spin. Add it up over the whole interior.
            </p>
            <p>
              The theorem says these are exactly equal, for <em>any</em> closed curve and{' '}
              <em>any</em> smooth field. Drag the boundary below to resize or move it — both
              numbers stay locked together.
            </p>
          </Section>

          <Section title="Field">
            <div className="grid grid-cols-2 gap-2">
              {Object.values(FIELDS_2D).map((f) => (
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
            <Readout label="∮ (P dx + Q dy)  — circulation" value={line} accent="var(--amber)" />
            <Readout label="∬ curl dA  — area sum" value={area} accent="var(--teal)" />
            <Readout label="|difference|" value={diff} />
            <p className="text-xs pt-1">
              As the animated particle completes its lap, circulation converges to the same value
              as the area sum — try dragging the loop bigger, smaller, or off-center.
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
            <div className="flex rounded-full p-1" style={{ backgroundColor: 'var(--panel-2)' }}>
              {(['circulation', 'curl'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors"
                  style={{
                    backgroundColor: mode === m ? 'var(--amber)' : 'transparent',
                    color: mode === m ? 'var(--panel)' : 'var(--ink)',
                  }}
                >
                  {m} mode
                </button>
              ))}
            </div>
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              {running ? '⏸ Pause' : '▶ Play'}
            </button>
            <label className="flex items-center gap-2 text-sm ml-auto" style={{ color: 'var(--ink-soft)' }}>
              Radius
              <input
                type="range"
                min={0.6}
                max={4.6}
                step={0.05}
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-28"
              />
            </label>
          </div>
          <GreensCanvas
            fieldType={fieldType}
            mode={mode}
            running={running}
            onReadouts={(l, a) => {
              setLine(l);
              setArea(a);
            }}
            radius={radius}
            onRadiusChange={setRadius}
            center={center}
            onCenterChange={setCenter}
          />
          <div
            className="px-4 py-2 text-xs border-t"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Drag inside the loop to move it · drag the teal dot on its edge to resize
          </div>
        </div>
      }
    />
  );
}
