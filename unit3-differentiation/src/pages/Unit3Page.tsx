import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import GradientExplorer from '../components/GradientExplorer';
import { Section, Equation, Readout, Inline } from '../components/MathPanel';

export default function Unit3Page() {
  const [grad, setGrad] = useState({ gx: 0, gy: 0 });
  const [dirDeriv, setDirDeriv] = useState(0);
  const [angleDeg, setAngleDeg] = useState(0);

  const gradMag = Math.hypot(grad.gx, grad.gy);
  const aligned = gradMag > 1e-6 ? dirDeriv / gradMag : 0;

  return (
    <ModuleLayout
      guide={
        <>
          <Section title="UNIT - III : Vector Differentiation (12 Periods)">
            <p>
              Welcome to the interactive visualizer strictly tailored for **Unit III: Vector
              Differentiation**. This module covers the fundamental rate-of-change operators and field
              classifications without any unrelated topics or integration overlap.
            </p>
          </Section>

          <Section title="1. Differentiation of Vectors — Velocity and Acceleration">
            <p>
              When a particle moves along a trajectory in space described by a position vector{' '}
              <Inline tex={"\\mathbf{r}(t) = x(t)\\hat{\\imath} + y(t)\\hat{\\jmath} + z(t)\\hat{k}"} />,
              differentiating with respect to time <Inline tex={"t"} /> gives the instantaneous
              velocity vector <Inline tex={"\\mathbf{v}(t)"} />, and differentiating again gives the
              instantaneous acceleration vector <Inline tex={"\\mathbf{a}(t)"} />:
            </p>
            <Equation tex={"\\mathbf{v}(t) = \\frac{d\\mathbf{r}}{dt}, \\qquad \\mathbf{a}(t) = \\frac{d\\mathbf{v}}{dt} = \\frac{d^2\\mathbf{r}}{dt^2}"} />
            <p>
              Geometrically, velocity <Inline tex={"\\mathbf{v}"} /> is always tangent to the path.
              Acceleration <Inline tex={"\\mathbf{a}"} /> decomposes into a tangential component
              (speeding up or slowing down) and a normal component (curving the trajectory toward the
              center of curvature).
            </p>
          </Section>

          <Section title="2. Vector Differential Operator — Gradient, Divergence, and Curl">
            <p>
              The central tool of vector differentiation is the vector differential operator, denoted by
              the nabla (or del) symbol <Inline tex={"\\nabla"} />:
            </p>
            <Equation tex={"\\nabla = \\hat{\\imath}\\frac{\\partial}{\\partial x} + \\hat{\\jmath}\\frac{\\partial}{\\partial y} + \\hat{k}\\frac{\\partial}{\\partial z}"} />
            <p>
              Depending on how <Inline tex={"\\nabla"} /> is applied, it produces three distinct operators:
            </p>
            <Equation
              label="Gradient — Acts on a scalar field f to produce a vector pointing uphill"
              tex={"\\text{grad } f = \\nabla f = \\frac{\\partial f}{\\partial x}\\hat{\\imath} + \\frac{\\partial f}{\\partial y}\\hat{\\jmath} + \\frac{\\partial f}{\\partial z}\\hat{k}"}
            />
            <Equation
              label="Divergence — Acts via dot product on vector field F to measure net outflow density"
              tex={"\\text{div } \\mathbf{F} = \\nabla\\cdot\\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}"}
            />
            <Equation
              label="Curl — Acts via cross product on vector field F to measure local rotational spin axis"
              tex={"\\text{curl } \\mathbf{F} = \\nabla\\times\\mathbf{F} = \\left(\\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z}\\right)\\hat{\\imath} + \\left(\\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x}\\right)\\hat{\\jmath} + \\left(\\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}\\right)\\hat{k}"}
            />
          </Section>

          <Section title="3. Directional Derivative">
            <p>
              While the gradient points in the direction of steepest ascent, we often need the rate of
              change of a scalar field <Inline tex={"f(x, y, z)"} /> in an arbitrary unit direction{' '}
              <Inline tex={"\\hat{u}"} />. This is the **directional derivative**:
            </p>
            <Equation tex={"D_{\\hat{u}} f = \\nabla f \\cdot \\hat{u} = |\\nabla f| \\cos\\theta"} />
            <p>
              Try the interactive plane on the right: drag the dark point <Inline tex={"(x, y)"} /> to
              move across the elliptic bowl <Inline tex={"f(x, y) = x^2 + 2y^2"} />, then drag the amber
              direction dot to rotate <Inline tex={"\\hat{u}"} />.
            </p>
            <Readout label="∇f (Gradient vector at point)" value={`(${grad.gx.toFixed(2)}, ${grad.gy.toFixed(2)})`} accent="var(--teal)" />
            <Readout label="D_û f (Directional derivative)" value={dirDeriv} accent="var(--amber)" />
            <Readout label="Direction angle θ" value={`${angleDeg.toFixed(0)}°`} />
            <p className="text-xs pt-1 font-semibold" style={{ color: 'var(--ink)' }}>
              {Math.abs(aligned) > 0.98
                ? 'Aligned with gradient: directional derivative achieves its maximum possible value (|∇f|).'
                : Math.abs(aligned) < 0.05
                ? 'Perpendicular to gradient (tangent to contour line): directional derivative is zero (no change).'
                : 'Notice how changing the direction angle varies the rate of change smoothly from positive to negative.'}
            </p>
          </Section>

          <Section title="4. Scalar Potential of a Vector Function">
            <p>
              If a vector field <Inline tex={"\\mathbf{F}"} /> can be written as the gradient of a continuous scalar
              function <Inline tex={"\\phi"} />, such that:
            </p>
            <Equation tex={"\\mathbf{F} = \\nabla \\phi"} />
            <p>
              then <Inline tex={"\\phi(x, y, z)"} /> is called the **scalar potential** (or potential function)
              of <Inline tex={"\\mathbf{F}"} />. Fields possessing a scalar potential are of fundamental importance in
              physics because their line integrals depend only on the endpoints.
            </p>
          </Section>

          <Section title="5. Irrotational and Solenoidal Vector Fields">
            <p>
              Vector fields are classified based on the vanishing of their curl or divergence:
            </p>
            <Equation
              label="Irrotational Field (Zero Curl — no local rotation around any axis)"
              tex={"\\nabla\\times\\mathbf{F} = \\mathbf{0}"}
            />
            <p>
              Every field with a scalar potential (<Inline tex={"\\mathbf{F} = \\nabla\\phi"} />) is
              automatically **irrotational** because the curl of any gradient is identically zero.
            </p>
            <Equation
              label="Solenoidal Field (Zero Divergence — no net sources or sinks anywhere)"
              tex={"\\nabla\\cdot\\mathbf{F} = 0"}
            />
            <p>
              A field is **solenoidal** when flux lines neither originate nor terminate locally. Such fields can always
              be expressed as the curl of a vector potential (<Inline tex={"\\mathbf{F} = \\nabla\\times\\mathbf{A}"} />).
            </p>
          </Section>

          <Section title="6. Vector Operator Identities (Without Proof)">
            <p>
              These four fundamental differential identities hold for any smooth scalar field{' '}
              <Inline tex={"\\phi"} /> and vector field <Inline tex={"\\mathbf{F}"} />:
            </p>
            <Equation
              label="Identity 1: The curl of a gradient is identically zero vector"
              tex={"\\nabla\\times(\\nabla \\phi) = \\mathbf{0}"}
            />
            <Equation
              label="Identity 2: The divergence of a curl is identically zero scalar"
              tex={"\\nabla\\cdot(\\nabla\\times\\mathbf{F}) = 0"}
            />
            <Equation
              label="Identity 3: Product rule for divergence of a scalar times a vector"
              tex={"\\nabla\\cdot(\\phi\\mathbf{F}) = \\phi(\\nabla\\cdot\\mathbf{F}) + \\nabla\\phi\\cdot\\mathbf{F}"}
            />
            <Equation
              label="Identity 4: Curl of curl relates vector Laplacian to divergence of gradient"
              tex={"\\nabla\\times(\\nabla\\times\\mathbf{F}) = \\nabla(\\nabla\\cdot\\mathbf{F}) - \\nabla^2\\mathbf{F}"}
            />
          </Section>

          <Section title="7. Flow of a Compressible Fluid — Condition of Incompressibility">
            <p>
              Consider a fluid with mass density <Inline tex={"\\rho(x, y, z, t)"} /> moving with velocity field{' '}
              <Inline tex={"\\mathbf{v}(x, y, z, t)"} />. By conservation of mass, the net rate of mass outflow from
              any differential volume must equal the rate of density decrease inside it. This yields the **equation of continuity**:
            </p>
            <Equation tex={"\\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho\\mathbf{v}) = 0"} />
            <p>
              A fluid is defined as **incompressible** if the density of every fluid element remains constant as it moves
              (<Inline tex={"d\\rho/dt = 0"} /> and constant <Inline tex={"\\rho"} /> everywhere). Under this condition, the continuity equation reduces to the exact **condition of incompressibility**:
            </p>
            <Equation tex={"\\nabla\\cdot\\mathbf{v} = 0"} />
            <p>
              Thus, an incompressible fluid flow is strictly characterized by a **solenoidal velocity field**.
            </p>
          </Section>

          <Section title="8. Conservative Forces">
            <p>
              In mechanics, a force field <Inline tex={"\\mathbf{F}"} /> is termed **conservative** if the work done by
              or against the force in moving a particle between two points is independent of the trajectory taken.
              Mathematically, a force is conservative if and only if it is **irrotational**:
            </p>
            <Equation tex={"\\nabla\\times\\mathbf{F} = \\mathbf{0} \\quad \\Longleftrightarrow \\quad \\mathbf{F} = -\\nabla V"} />
            <p>
              where <Inline tex={"V(x, y, z)"} /> is the potential energy function (note the conventional minus sign in physics). For conservative forces, total mechanical energy <Inline tex={"E = T + V"} /> is strictly conserved.
            </p>
          </Section>
        </>
      }
      canvas={
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className="flex flex-wrap items-center gap-3 px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Directional Derivative &amp; Gradient Explorer
            </span>
            <span className="text-xs font-mono-data ml-auto font-medium" style={{ color: 'var(--ink-soft)' }}>
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
            className="px-4 py-2 text-xs border-t shrink-0"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', backgroundColor: 'var(--panel)' }}
          >
            Drag the dark point to move across contours · drag the amber handle to rotate unit vector û
          </div>
        </div>
      }
    />
  );
}
