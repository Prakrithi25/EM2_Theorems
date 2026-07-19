import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import StokesScene from '../components/StokesScene';
import { Section, Equation, Readout, Inline, PillarCard, IntuitionBox, ControlGuide, ImpactBox } from '../components/MathPanel';
import { FIELDS_3D, type FieldType3D, rimCirculation, surfaceCurlFlux } from '../lib/fieldMath3D';

export default function StokesPage() {
  const [fieldType, setFieldType] = useState<FieldType3D>('swirl');
  const [height, setHeight] = useState(1.4);
  const [strength, setStrength] = useState(1.0);
  const [baseRadius, setBaseRadius] = useState(2.0);
  const [running, setRunning] = useState(true);

  const field = FIELDS_3D[fieldType];
  const circulation = rimCirculation(field, baseRadius, 200, strength);
  const curlFlux = surfaceCurlFlux(field, baseRadius, height, 40, 60, strength);

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="3. Stoke's Theorem (Without Proof)">
            <p>
              <strong className="font-semibold text-ink dark:text-white">Stoke&apos;s Theorem</strong> is the 3D big brother of Green&apos;s theorem. It connects the 1D boundary circulation of a vector field around a closed wire ring <Inline tex={"C"} /> directly to the 2D surface flux of the local curl across <strong className="text-white">any</strong> smooth oriented dome <Inline tex={"S"} /> capped over that ring.
            </p>
            <Equation
              label="Stoke's Theorem — Surface integral of curl equals boundary circulation"
              tex={"\\iint_S (\\nabla\\times\\mathbf{F})\\cdot\\hat{n}\\,dS = \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}"}
            />
          </Section>

          <PillarCard title="What is this Simulation?" accent="var(--teal)">
            <p>
              You are manipulating a 3D interactive chamber containing a circular wire boundary rim <Inline tex={"C"} /> capped by a stretchy translucent dome <Inline tex={"S"} /> inside a 3D wind field. Notice the glowing <strong style={{ color: '#F43F5E' }}>Rose arrows (∇×F)</strong> showing how the local microscopic rotational curl twists right across every patch of the sloped membrane!
            </p>
          </PillarCard>

          <IntuitionBox title="Why Do We Have This? (The Butterfly Net & Soap Bubble Analogy)">
            Imagine holding a circular wire hoop in a breezy field. Whether you stretch a flat screen across the hoop, dip a round soap bubble over it, or attach a deep 3-foot butterfly net, <strong className="text-[var(--ink)] font-semibold">the total amount of spinning air trapped inside the fabric is 100% identical!</strong>
            <br /><br />
            Why? Because any spinning wind that blows into the deep net must first pass straight through the outer wire ring! So whether you flatten the dome or stretch it into a tall cone using the slider below, the total spinning air captured (`Surface Curl Flux`) stays locked equal to the wind pushing around the ring (`Rim Circulation`).
          </IntuitionBox>

          <ControlGuide
            items={[
              {
                label: 'Field Strength & Loop Size',
                desc: 'Use the k-slider to make the wind spin faster or reverse directions. Use the R-slider to widen the wire ring—a bigger loop captures much more spinning wind!',
                badgeColor: 'var(--rose)',
              },
              {
                label: 'Dome Height Profile',
                desc: 'Flatten the capping surface into a flat disk (0.00) or stretch it into a tall dome (2.50). Watch how the arrows along the sloped walls tilt while the total numbers stay locked together!',
                badgeColor: 'var(--amber)',
              },
              {
                label: '3D Wind Mode Selector',
                desc: 'Switch between Swirl (spinning whirlpool), Shear (sliding layers of wind), and Uniform (constant straight breeze).',
                badgeColor: 'var(--teal)',
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
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Field Strength Multiplier (k):</span>
                <span className="font-mono-data font-medium" style={{ color: 'var(--ink)' }}>{strength.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-[var(--rose)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Wire Rim Radius Profile (R):</span>
                <span className="font-mono-data font-medium" style={{ color: 'var(--ink)' }}>{baseRadius.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={baseRadius}
                onChange={(e) => setBaseRadius(parseFloat(e.target.value))}
                className="w-full accent-[var(--amber)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Dome Height Profile (h):</span>
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
            {fieldType === 'swirl' && (
              <div className="p-3.5 rounded-xl border space-y-2 shadow-sm transition-all" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--amber)', color: 'var(--ink)' }}>
                <div className="font-bold uppercase tracking-wide text-[var(--amber)] flex items-center gap-1.5">
                  <span>The Merry-Go-Round Whirlpool</span>
                </div>
                <p className="text-xs leading-relaxed text-white font-medium">
                  Imagine the wind in the room is spinning in circles around you like a merry-go-round:
                </p>
                <div className="space-y-1.5 text-xs leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--amber)] shrink-0">1. Around our Ring:</span>
                    <span>Because the wind swirls in a circle, it blows right along our circular wire hoop endlessly! It pushes our ring non-stop, giving us our positive numbers (`+25.13`).</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--teal)] shrink-0">2. Through our Net:</span>
                    <span>Because the whirlpool spins flat horizontally, the "whirl" points straight UP into the sky—right through the opening of our net! Whether our net is shallow like a plate or deep like a butterfly net, it catches the exact same amount of spinning wind.</span>
                  </div>
                </div>
              </div>
            )}

            {fieldType === 'shear' && (
              <div className="p-3.5 rounded-xl border space-y-2 shadow-sm transition-all" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--teal)', color: 'var(--ink)' }}>
                <div className="font-bold uppercase tracking-wide text-[var(--teal)] flex items-center gap-1.5">
                  <span>Highway with Fast & Slow Lanes</span>
                </div>
                <p className="text-xs leading-relaxed text-white font-medium">
                  Imagine wind blowing down a highway where air higher up moves very fast, but air down on the floor is completely still:
                </p>
                <div className="space-y-1.5 text-xs leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--amber)] shrink-0">1. Around our Ring:</span>
                    <span>Our wire ring is sitting flat on the floor where the wind speed is zero! Since there is no wind moving on the floor, the wind gives exactly <strong>zero</strong> push along our ring (`0.00`).</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--teal)] shrink-0">2. Through our Net:</span>
                    <span>As you reach higher up across our dome, there is fast wind. But because the wind blows horizontally across the room, it enters the left side of our net and blows right back out the right side! What blows in immediately blows out, leaving the net total caught inside at exactly <strong>0.00</strong>.</span>
                  </div>
                </div>
              </div>
            )}

            {fieldType === 'uniform' && (
              <div className="p-3.5 rounded-xl border space-y-2 shadow-sm transition-all" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--rose)', color: 'var(--ink)' }}>
                <div className="font-bold uppercase tracking-wide text-[var(--rose)] flex items-center gap-1.5">
                  <span>Open Window Breeze</span>
                </div>
                <p className="text-xs leading-relaxed text-white font-medium">
                  Imagine a smooth, steady breeze blowing straight through an open window at a constant speed:
                </p>
                <div className="space-y-1.5 text-xs leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--amber)] shrink-0">1. Around our Ring:</span>
                    <span>As the straight breeze hits our wire ring, it pushes forward along the front half of the hoop. But as the hoop curves back around towards you, the exact same straight breeze blows right in your face! The forward push and backward push cancel out completely (`0.00`).</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="font-bold text-[var(--teal)] shrink-0">2. Through our Net:</span>
                    <span>Because the breeze blows straight without any twisting or whirlpools inside it, there is zero spin to catch inside our net (`0.00`).</span>
                  </div>
                </div>
              </div>
            )}
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
          <StokesScene fieldType={fieldType} height={height} running={running} strength={strength} baseRadius={baseRadius} />
          <div
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Rotate scene with mouse drag · scroll to zoom · adjust sliders to scale field strength, loop radius & dome curvature
          </div>
        </div>
      }
    />
  );
}

