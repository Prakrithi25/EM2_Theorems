import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import DomeSurface from './DomeSurface';
import Arrow3D from './Arrow3D';
import {
  FIELDS_3D,
  getScaledField3D,
  type FieldType3D,
  domeRim,
  domeRimTangent,
  domePoint,
  type Vec3,
} from '../lib/fieldMath3D';

function toThree(p: Vec3): [number, number, number] {
  return [p.x, p.z, p.y];
}

interface SceneContentProps {
  fieldType: FieldType3D;
  height: number;
  running: boolean;
  strength: number;
  baseRadius: number;
  teal: string;
  amber: string;
  ink: string;
}

function Walker({ running, teal, baseRadius }: { running: boolean; teal: string; baseRadius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    if (running) t.current = (t.current + delta * 0.15) % 1;
    if (ref.current) {
      const theta = t.current * Math.PI * 2;
      const p: Vec3 = { x: baseRadius * Math.cos(theta), y: baseRadius * Math.sin(theta), z: 0 };
      const [x, y, z] = toThree(p);
      ref.current.position.set(x, y, z);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={0.4} />
    </mesh>
  );
}

function SceneContent({ fieldType, height, running, strength, baseRadius, teal, amber, ink }: SceneContentProps) {
  const field = useMemo(() => getScaledField3D(FIELDS_3D[fieldType], strength), [fieldType, strength]);

  const rimPoints = useMemo(
    () => domeRim(baseRadius, 80).map((p) => toThree(p)) as [number, number, number][],
    [baseRadius]
  );

  const tangentArrows = useMemo(() => {
    const n = 12;
    const arrows = [];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const theta = t * Math.PI * 2;
      const p: Vec3 = { x: baseRadius * Math.cos(theta), y: baseRadius * Math.sin(theta), z: 0 };
      const tangent = domeRimTangent(baseRadius, t);
      arrows.push({ origin: toThree(p), direction: toThree(tangent) });
    }
    return arrows;
  }, [baseRadius]);

  const normalArrows = useMemo(() => {
    const arrows = [];
    const nu = 4;
    const nv = 8;
    for (let i = 1; i <= nu; i++) {
      const u = (i - 0.3) / (nu + 0.5);
      for (let j = 0; j < nv; j++) {
        const v = j / nv;
        const p = domePoint(u, v, baseRadius, height);
        const h = 1e-3;
        const pu = domePoint(u + h, v, baseRadius, height);
        const pv = domePoint(u, v + h, baseRadius, height);
        const du = { x: pu.x - p.x, y: pu.y - p.y, z: pu.z - p.z };
        const dv = { x: pv.x - p.x, y: pv.y - p.y, z: pv.z - p.z };
        let normal = {
          x: du.y * dv.z - du.z * dv.y,
          y: du.z * dv.x - du.x * dv.z,
          z: du.x * dv.y - du.y * dv.x,
        };
        const len = Math.hypot(normal.x, normal.y, normal.z) || 1;
        normal = { x: normal.x / len, y: normal.y / len, z: normal.z / len };
        if (normal.z < 0) normal = { x: -normal.x, y: -normal.y, z: -normal.z };
        arrows.push({ origin: toThree(p), direction: toThree(normal) });
      }
    }
    return arrows;
  }, [height, baseRadius]);

  const curlArrows = useMemo(() => {
    const arrows = [];
    const nu = 4;
    const nv = 8;
    for (let i = 1; i <= nu; i++) {
      const u = (i - 0.3) / (nu + 0.5);
      for (let j = 0; j < nv; j++) {
        const v = j / nv;
        const p = domePoint(u, v, baseRadius, height);
        const c = field.curl(p);
        const len = Math.hypot(c.x, c.y, c.z);
        if (len < 0.01) continue;
        const normC = { x: c.x / len, y: c.y / len, z: c.z / len };
        arrows.push({ origin: toThree(p), direction: toThree(normC), length: Math.min(0.65, 0.2 + len * 0.15) });
      }
    }
    return arrows;
  }, [field, height, baseRadius]);

  const fieldArrows = useMemo(() => {
    const arrows = [];
    const pts: Vec3[] = [];
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const x = i * 1.1;
        const y = j * 1.1;
        if (Math.hypot(x, y) > baseRadius + 0.6) continue;
        pts.push({ x, y, z: -1.4 });
      }
    }
    for (const p of pts) {
      const f = field.F(p);
      arrows.push({ origin: toThree(p), direction: toThree(f), mag: Math.hypot(f.x, f.y, f.z) });
    }
    return arrows;
  }, [field, baseRadius]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />

      <DomeSurface baseRadius={baseRadius} height={height} color={teal} />

      <Line points={rimPoints} color={ink} lineWidth={2.5} />

      {tangentArrows.map((a, i) => (
        <Arrow3D key={`tan-${i}`} origin={a.origin} direction={a.direction} length={0.45} color={amber} />
      ))}

      {normalArrows.map((a, i) => (
        <Arrow3D key={`norm-${i}`} origin={a.origin} direction={a.direction} length={0.35} color={teal} thickness={0.7} opacity={0.85} />
      ))}

      {curlArrows.map((a, i) => (
        <Arrow3D key={`curl-${i}`} origin={a.origin} direction={a.direction} length={a.length} color="#F43F5E" thickness={0.8} opacity={0.9} />
      ))}

      {fieldArrows.map((a, i) => (
        <Arrow3D
          key={`field-${i}`}
          origin={a.origin}
          direction={a.direction}
          length={Math.min(0.9, 0.25 + a.mag * 0.12)}
          color="#8B94A3"
          thickness={0.6}
          opacity={0.55}
        />
      ))}

      <Walker running={running} teal={amber} baseRadius={baseRadius} />

      <gridHelper args={[10, 20, '#444444', '#333333']} position={[0, -1.5, 0]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12} />
    </>
  );
}

interface StokesSceneProps {
  fieldType: FieldType3D;
  height: number;
  running: boolean;
  strength?: number;
  baseRadius?: number;
}

export default function StokesScene({ fieldType, height, running, strength = 1.0, baseRadius = 2.0 }: StokesSceneProps) {
  const [colors] = useState(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      teal: root.getPropertyValue('--teal').trim() || '#4FD8C4',
      amber: root.getPropertyValue('--amber').trim() || '#E8A33D',
      ink: root.getPropertyValue('--ink').trim() || '#E9E6DC',
    };
  });

  return (
    <div className="flex-1 min-h-0 relative flex flex-col">
      <Canvas camera={{ position: [4.5, 3.2, 4.5], fov: 45 }}>
        <SceneContent fieldType={fieldType} height={height} running={running} strength={strength} baseRadius={baseRadius} {...colors} />
      </Canvas>
      <div className="absolute top-3 left-3 pointer-events-none flex flex-wrap gap-2.5 text-[11px] sm:text-xs font-semibold px-3 py-2 rounded-lg shadow-md border" style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#F43F5E' }}></span> Local Curl Vector (∇×F)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: colors.teal }}></span> Surface Normal (n̂)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: colors.amber }}></span> Rim Tangent Velocity (F)</div>
      </div>
    </div>
  );
}
