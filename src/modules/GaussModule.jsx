import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MathEquation from '../components/MathEquation'

function FluxParticle({ origin, divergence }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scale = 0.45 + 0.25 * Math.sin(t * 0.7 + origin.length())
    const direction = origin.clone().normalize().multiplyScalar(scale * divergence)
    ref.current.position.copy(origin.clone().add(direction))
  })

  return (
    <mesh ref={ref} position={origin}>
      <sphereGeometry args={[0.03, 10, 10]} />
      <meshStandardMaterial color={divergence >= 0 ? '#f87171' : '#60a5fa'} />
    </mesh>
  )
}

function DivergenceShell({ radius, divergence, showFlux }) {
  const samplePoints = useMemo(() => {
    const pts = []
    for (let i = 0; i < 30; i += 1) {
      const u = (i / 30) * Math.PI * 2
      const v = ((i * 7) % 30) / 30 * Math.PI
      pts.push(new THREE.Vector3(
        radius * Math.cos(u) * Math.sin(v),
        radius * Math.sin(u) * Math.sin(v),
        radius * Math.cos(v),
      ))
    }
    return pts
  }, [radius])

  return (
    <>
      <mesh>
        <sphereGeometry args={[radius, 36, 28]} />
        <meshStandardMaterial color="#38bdf8" wireframe transparent opacity={0.65} />
      </mesh>

      {showFlux
        ? samplePoints.map((point, index) => (
            <arrowHelper
              key={`flux-${index}`}
              args={[
                point.clone().normalize().multiplyScalar(Math.sign(divergence || 1)),
                point,
                0.32,
                divergence >= 0 ? '#ef4444' : '#3b82f6',
                0.1,
                0.06,
              ]}
            />
          ))
        : null}

      {samplePoints.map((point, index) => (
        <FluxParticle key={`particle-${index}`} origin={point.clone().multiplyScalar(0.55)} divergence={divergence} />
      ))}
    </>
  )
}

function CrossSectionPlane({ level }) {
  return (
    <mesh position={[0, level, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial color="#eab308" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  )
}

function GaussModule() {
  const [divergence, setDivergence] = useState(0.8)
  const [radius, setRadius] = useState(1.1)
  const [sliceLevel, setSliceLevel] = useState(0)
  const [showFlux, setShowFlux] = useState(true)

  const flux = useMemo(() => 4 * Math.PI * divergence * radius ** 3, [divergence, radius])
  const volumeIntegral = useMemo(() => (3 * divergence) * ((4 / 3) * Math.PI * radius ** 3), [divergence, radius])

  return (
    <section className="h-full">
      <h2 className="text-xl font-semibold">Gauss&apos;s Divergence Theorem (3D)</h2>
      <MathEquation equation={'\\iint_S \\mathbf{F}\\cdot d\\mathbf{S}=\\iiint_V (\\nabla\\cdot\\mathbf{F})\\,dV'} />

      <ol className="mb-4 list-inside list-decimal space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li>The shell is a closed surface S that encloses volume V.</li>
        <li>Arrows show outward/inward flux depending on source or sink behavior.</li>
        <li>The yellow plane sweeps through V to inspect local divergence density.</li>
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="h-[440px] overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
          <Canvas camera={{ position: [3, 2, 2], fov: 52 }}>
            <ambientLight intensity={0.8} />
            <directionalLight intensity={1.2} position={[3, 3, 2]} />
            <DivergenceShell radius={radius} divergence={divergence} showFlux={showFlux} />
            <CrossSectionPlane level={sliceLevel} />
            <gridHelper args={[6, 12, '#64748b', '#1e293b']} />
            <axesHelper args={[1.6]} />
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-300 p-4 text-sm dark:border-slate-700">
          <label className="block">
            Divergence coefficient: {divergence.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min="-1.3"
              max="1.3"
              step="0.05"
              value={divergence}
              onChange={(event) => setDivergence(Number(event.target.value))}
            />
          </label>

          <label className="block">
            Surface size: {radius.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min="0.6"
              max="1.6"
              step="0.05"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </label>

          <label className="block">
            Slice plane position: {sliceLevel.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min={(-radius).toString()}
              max={radius.toString()}
              step="0.05"
              value={sliceLevel}
              onChange={(event) => setSliceLevel(Number(event.target.value))}
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            Show flux arrows
            <input type="checkbox" checked={showFlux} onChange={(event) => setShowFlux(event.target.checked)} />
          </label>

          <div className="space-y-1 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <p>
              Outward surface flux: <strong>{flux.toFixed(4)}</strong>
            </p>
            <p>
              Volume divergence integral: <strong>{volumeIntegral.toFixed(4)}</strong>
            </p>
            <p>
              Local divergence on slice: <strong>{(3 * divergence).toFixed(3)}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GaussModule
