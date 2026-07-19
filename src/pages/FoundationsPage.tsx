import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GradientExplorer from '../components/GradientExplorer';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';

export default function FoundationsPage() {
  const [grad, setGrad] = useState({ gx: 0, gy: 0 });
  const [dirDeriv, setDirDeriv] = useState(0);
  const [angleDeg, setAngleDeg] = useState(0);

  const gradMag = Math.hypot(grad.gx, grad.gy);
  const aligned = gradMag > 1e-6 ? dirDeriv / gradMag : 0;

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="Foundations — vector differentiation & operators">
            <p>
              This page collects the building blocks the three theorem modules rely on: how a
              vector changes, the three core operators (gradient, divergence, curl), and the
              special field types (irrotational, solenoidal, conservative) that make the theorems
              interesting.
            </p>
          </Section>

          <Section title="Differentiation of a vector · velocity & acceleration">
            <p>
              For a position vector{' '}
              <Inline tex={"\\mathbf{r}(t) = x(t)\\hat{\\imath} + y(t)\\hat{\\jmath} + z(t)\\hat{k}"} />{' '}
              tracing a particle's path, the derivative with respect to time gives velocity, and the
              second derivative gives acceleration:
            </p>
            <Equation tex={"\\mathbf{v}(t) = \\frac{d\\mathbf{r}}{dt}, \\qquad \\mathbf{a}(t) = \\frac{d\\mathbf{v}}{dt} = \\frac{d^2\\mathbf{r}}{dt^2}"} />
            <p>
              Geometrically, <Inline tex={"\\mathbf{v}"} /> is always tangent to the path, and{' '}
              <Inline tex={"\\mathbf{a}"} /> can be split into a component along the path (speeding
              up/slowing down) and a component perpendicular to it (curving).
            </p>
          </Section>

          <Section title="Gradient, divergence, curl — the vector differential operator ∇">
            <p>
              All three are built from the same symbolic operator{' '}
              <Inline tex={"\\nabla = \\hat{\\imath}\\dfrac{\\partial}{\\partial x} + \\hat{\\jmath}\\dfrac{\\partial}{\\partial y} + \\hat{k}\\dfrac{\\partial}{\\partial z}"} />,
              applied three different ways:
            </p>
            <Equation
              label="Gradient — turns a scalar field into a vector field, pointing uphill"
              tex={"\\nabla f = \\frac{\\partial f}{\\partial x}\\hat{\\imath} + \\frac{\\partial f}{\\partial y}\\hat{\\jmath} + \\frac{\\partial f}{\\partial z}\\hat{k}"}
            />
            <Equation
              label="Divergence — turns a vector field into a scalar (net outflow density)"
              tex={"\\nabla\\cdot\\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}"}
            />
            <Equation
              label="Curl — turns a vector field into another vector (local spin axis)"
              tex={"\\nabla\\times\\mathbf{F} = \\left(\\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z}\\right)\\hat{\\imath} + \\left(\\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x}\\right)\\hat{\\jmath} + \\left(\\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}\\right)\\hat{k}"}
            />
            <p>
              Green's theorem uses the z-component of curl in 2D; Stokes' uses full 3D curl; Gauss's
              uses divergence.
            </p>
          </Section>

          <Section title="Directional derivative">
            <p>
              The gradient also answers "how fast does f change if I walk in direction{' '}
              <Inline tex={"\\hat{u}"} />?" — that's the directional derivative:
            </p>
            <Equation tex={"D_{\\hat u} f = \\nabla f \\cdot \\hat{u}"} />
            <p>
              It's largest (equal to <Inline tex={"|\\nabla f|"} />) exactly when{' '}
              <Inline tex={"\\hat u"} /> points along the gradient, and zero when you walk
              perpendicular to it — i.e. along a contour line. Try it on the right: drag the dark
              point, then drag the amber direction handle around it.
            </p>
            <Readout label="∇f at this point" value={`(${grad.gx.toFixed(2)}, ${grad.gy.toFixed(2)})`} accent="var(--teal)" />
            <Readout label="D_û f — directional derivative" value={dirDeriv} accent="var(--amber)" />
            <Readout label="direction angle" value={`${angleDeg.toFixed(0)}°`} />
            <p className="text-xs pt-1">
              {Math.abs(aligned) > 0.98
                ? 'Direction is aligned with the gradient — this is the steepest possible rate of change.'
                : Math.abs(aligned) < 0.05
                ? "Direction is perpendicular to the gradient — you're walking along a contour, so f isn't changing at all."
                : 'Try rotating the amber handle until it lines up with the teal gradient arrow.'}
            </p>
          </Section>

          <Section title="Scalar potential of a vector function">
            <p>
              If a vector field <Inline tex={"\\mathbf{F}"} /> can be written as the gradient of some
              scalar function, <Inline tex={"\\mathbf{F} = \\nabla \\phi"} />, then{' '}
              <Inline tex={"\\phi"} /> is called its <em>scalar potential</em>. Not every field has
              one — only{' '}
              <strong style={{ color: 'var(--ink)' }}>irrotational</strong> fields do (see below).
            </p>
          </Section>

          <Section title="Irrotational and solenoidal fields">
            <p>
              <strong style={{ color: 'var(--ink)' }}>Irrotational</strong> (curl-free):{' '}
              <Inline tex={"\\nabla\\times\\mathbf{F} = \\mathbf{0}"} /> everywhere. Equivalent to{' '}
              <Inline tex={"\\mathbf{F} = \\nabla\\phi"} /> for some scalar potential{' '}
              <Inline tex={"\\phi"} /> (on a simply-connected domain). The saddle and source/sink
              fields in the Green's module are irrotational.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Solenoidal</strong> (divergence-free):{' '}
              <Inline tex={"\\nabla\\cdot\\mathbf{F} = 0"} /> everywhere — no net sources or sinks
              anywhere. Equivalent to <Inline tex={"\\mathbf{F} = \\nabla\\times\\mathbf{A}"} /> for some
              vector potential <Inline tex={"\\mathbf{A}"} />. The swirl field in the Stokes' module is
              solenoidal.
            </p>
          </Section>

          <Section title="Vector operator identities (standard results, no proof)">
            <Equation tex={"\\nabla\\times(\\nabla f) = \\mathbf{0}"} />
            <Equation tex={"\\nabla\\cdot(\\nabla\\times\\mathbf{F}) = 0"} />
            <Equation tex={"\\nabla\\cdot(\\phi\\mathbf{F}) = \\phi(\\nabla\\cdot\\mathbf{F}) + \\nabla\\phi\\cdot\\mathbf{F}"} />
            <Equation tex={"\\nabla\\times(\\nabla\\times\\mathbf{F}) = \\nabla(\\nabla\\cdot\\mathbf{F}) - \\nabla^2\\mathbf{F}"} />
          </Section>

          <Section title="Flow of a compressible fluid · incompressibility">
            <p>
              For a fluid with density <Inline tex={"\\rho"} /> and velocity field{' '}
              <Inline tex={"\\mathbf{v}"} />, mass conservation gives the continuity equation:
            </p>
            <Equation tex={"\\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho\\mathbf{v}) = 0"} />
            <p>
              A fluid is <strong style={{ color: 'var(--ink)' }}>incompressible</strong> when
              density along each fluid particle doesn't change, which reduces this to the
              condition <Inline tex={"\\nabla\\cdot\\mathbf{v} = 0"} /> — exactly the solenoidal
              condition above. This is what the Gauss's theorem module's "sink/source" slider is
              deliberately violating when set away from zero.
            </p>
          </Section>

          <Section title="Conservative forces">
            <p>
              A force field <Inline tex={"\\mathbf{F}"} /> is{' '}
              <strong style={{ color: 'var(--ink)' }}>conservative</strong> if it's irrotational,
              so <Inline tex={"\\mathbf{F} = -\\nabla V"} /> for some potential energy function{' '}
              <Inline tex={"V"} />. Work done moving between two points then depends only on the
              endpoints, not the path — which is exactly what "area of a plane region as a line
              integral" and "work done by a force" (below) both lean on.
            </p>
          </Section>

          <Section title="Unit IV — the general integral concepts behind each module">
            <p>
              <strong style={{ color: 'var(--ink)' }}>Line integral:</strong>{' '}
              <Inline tex={"\\int_C \\mathbf{F}\\cdot d\\mathbf{r}"} /> — accumulate a field along a
              curve. This is the left-hand side of both Green's and Stokes' theorems.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Surface integral:</strong>{' '}
              <Inline tex={"\\iint_S \\mathbf{F}\\cdot d\\mathbf{S}"} /> — accumulate a field's flux
              through a surface. Right-hand side of Stokes', left-hand side of Gauss's.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Volume integral:</strong>{' '}
              <Inline tex={"\\iiint_V g \\, dV"} /> — accumulate a scalar over a 3D region.
              Right-hand side of Gauss's theorem.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Work done by a force:</strong> exactly a line
              integral, <Inline tex={"W = \\int_C \\mathbf{F}\\cdot d\\mathbf{r}"} />. For a
              conservative force this equals{' '}
              <Inline tex={"V(\\text{start}) - V(\\text{end})"} /> — see the Gauss and Green
              modules' circulation readouts.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Determining a potential function:</strong>{' '}
              given an irrotational <Inline tex={"\\mathbf{F}"} />, integrate{' '}
              <Inline tex={"\\partial \\phi/\\partial x = F_1"} /> etc. component-by-component (up
              to a constant) to reconstruct <Inline tex={"\\phi"} />.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)' }}>Area as a boundary line integral:</strong> a
              direct corollary of Green's theorem — pick{' '}
              <Inline tex={"P = -y/2,\\ Q = x/2"} /> and the area formula drops out:
            </p>
            <Equation tex={"\\text{Area}(D) = \\oint_C \\frac{1}{2}(x\\,dy - y\\,dx)"} />
            <p className="text-xs">
              Try this yourself on the Green's module: switch to the <em>saddle</em> field, then
              compare the polygon's true area to what the boundary formula gives.
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
            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              Gradient &amp; directional derivative explorer
            </span>
            <span className="text-xs font-mono-data ml-auto" style={{ color: 'var(--ink-soft)' }}>
              f(x, y) = x² + 2y²
            </span>
          </div>
          <GradientExplorer
            onReadouts={(g, d, a) => {
              setGrad(g);
              setDirDeriv(d);
              setAngleDeg(a);
            }}
          />
          <div
            className="px-4 py-2 text-xs border-t"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Drag the dark point to move it · drag the amber dot to rotate the direction
          </div>
        </div>
      }
    />
  );
}
