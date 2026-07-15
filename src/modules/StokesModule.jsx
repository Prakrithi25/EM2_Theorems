import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MathEquation from '../components/MathEquation'

function FlowParticles({ strength }) {
  const points = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        angle: (index / 36) * Math.PI * 2,
        radius: 0.65 + (index % 4) * 0.12,
        z: -0.45 + (index % 6) * 0.18,
      })),
    [],
  )

  return points.map((point, index) => <MovingPoint key={index} base={point} speed={strength} />)
}

function MovingPoint({ base, speed }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const angle = base.angle + t * speed
    ref.current.position.set(Math.cos(angle) * base.radius, Math.sin(angle) * base.radius, base.z)
  })

  return (
    <mesh ref={ref} position={[base.radius * Math.cos(base.angle), base.radius * Math.sin(base.angle), base.z]}>
      <sphereGeometry args={[0.03, 10, 10]} />
      <meshStandardMaterial color="#22d3ee" />
    </mesh>
  )
}

function TangentArrows({ radius }) {
  const tangentVectors = useMemo(() => {
    const arrows = []
    for (let i = 0; i < 14; i += 1) {
      const angle = (i / 14) * Math.PI * 2
      const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).normalize()
      arrows.push({ position, tangent })
    }
    return arrows
  }, [radius])

  return tangentVectors.map(({ position, tangent }, index) => (
    <arrowHelper
      key={index}
      args={[tangent, position, 0.32, '#f59e0b', 0.1, 0.06]}
    />
  ))
}

function NormalArrows({ radius }) {
  const normals = useMemo(() => {
    const arrows = []
    for (let i = 0; i < 5; i += 1) {
      for (let j = 1; j <= 3; j += 1) {
        const theta = (i / 5) * Math.PI * 2
        const phi = (j / 6) * Math.PI
        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)
        const position = new THREE.Vector3(x, y, z)
        arrows.push({ position, normal: position.clone().normalize() })
      }
    }
    return arrows
  }, [radius])

  return normals.map(({ position, normal }, index) => (
    <arrowHelper key={index} args={[normal, position, 0.3, '#34d399', 0.1, 0.06]} />
  ))
}

function StokesScene({ radius, showNormals, showTangents, showParticles, strength }) {
  return (
    <Canvas camera={{ position: [2.8, 2.4, 2.2], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={1.1} position={[2, 3, 1]} />
      <mesh>
        <sphereGeometry args={[radius, 36, 22, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.68} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 84]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {showTangents && <TangentArrows radius={radius} />}
      {showNormals && <NormalArrows radius={radius} />}
      {showParticles && <FlowParticles strength={Math.abs(strength) + 0.25} />}

      <gridHelper args={[6, 12, '#64748b', '#1e293b']} />
      <axesHelper args={[1.6]} />
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}

function StokesModule() {
  const [strength, setStrength] = useState(0.9)
  const [radius, setRadius] = useState(1)
  const [showTangents, setShowTangents] = useState(true)
  const [showNormals, setShowNormals] = useState(true)
  const [showParticles, setShowParticles] = useState(true)

  const lineIntegral = useMemo(() => 2 * Math.PI * radius * radius * strength, [radius, strength])

  return (
    <section className="h-full">
      <h2 className="text-xl font-semibold">Stokes&apos; Theorem (3D)</h2>
      <MathEquation equation={'\\oint_C \\mathbf{F}\\cdot d\\mathbf{r}=\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}'} />

      <ol className="mb-4 list-inside list-decimal space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li>The orange ring is boundary C with tangent vectors.</li>
        <li>The hemisphere is surface S with normal vectors.</li>
        <li>Particle flow visualizes the field direction that drives circulation.</li>
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="h-[440px] overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
          <StokesScene
            radius={radius}
            showNormals={showNormals}
            showTangents={showTangents}
            showParticles={showParticles}
            strength={strength}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-slate-300 p-4 text-sm dark:border-slate-700">
          <label className="block">
            Curl/field strength: {strength.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min="-1.6"
              max="1.6"
              step="0.05"
              value={strength}
              onChange={(event) => setStrength(Number(event.target.value))}
            />
          </label>

          <label className="block">
            Surface radius: {radius.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min="0.5"
              max="1.6"
              step="0.05"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            Show tangent vectors
            <input type="checkbox" checked={showTangents} onChange={(event) => setShowTangents(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between gap-3">
            Show normal vectors
            <input type="checkbox" checked={showNormals} onChange={(event) => setShowNormals(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between gap-3">
            Show particles
            <input type="checkbox" checked={showParticles} onChange={(event) => setShowParticles(event.target.checked)} />
          </label>

          <div className="space-y-1 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <p>
              Boundary line integral: <strong>{lineIntegral.toFixed(4)}</strong>
            </p>
            <p>
              Curl flux through S: <strong>{lineIntegral.toFixed(4)}</strong>
            </p>
            <p>
              Boundary radius: <strong>{radius.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StokesModule
