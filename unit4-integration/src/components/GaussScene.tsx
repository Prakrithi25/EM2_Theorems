import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { makeRadialField, v3, type Vec3 } from '../lib/fieldMath3D';

interface Props {
  strength: number;
  radius: number;
  running: boolean;
  showSlice: boolean;
}

const PARTICLE_COUNT = 380;

function Particles({ strength, radius, running }: { strength: number; radius: number; running: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const lanes = useMemo(() => {
    const arr: { dir: Vec3; phase: number; speedOffset: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const dir = {
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
      };
      arr.push({ dir, phase: Math.random(), speedOffset: 0.75 + Math.random() * 0.5 });
    }
    return arr;
  }, []);

  const color = useMemo(() => (strength >= 0 ? new THREE.Color('#4FD8C4') : new THREE.Color('#E8607A')), [strength]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speed = Math.max(0.1, Math.abs(strength)) * 0.55;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      if (running && strength !== 0) {
        // Advance phase from 0 to 1 smoothly for both Source and Shrink
        lane.phase = (lane.phase + delta * speed * lane.speedOffset) % 1;
      }
      // Set boundary beyond the sphere radius (1.65 * radius) so particles clearly cross into/out of the sphere
      const maxDist = radius * 1.65;
      
      // If strength >= 0 (Source): particles start at center (0) and fly outward to maxDist
      // If strength < 0 (Shrink): particles start outside (maxDist) and fly inward across the sphere boundary into the center (0)
      const dist = strength >= 0 ? lane.phase * maxDist : (1 - lane.phase) * maxDist;
      
      const p = v3.scale(lane.dir, dist);
      dummy.position.set(p.x, p.z, p.y);
      
      // Dynamic scaling:
      // progressToCenter is 0 exactly at the center (origin) and 1 at maxDist outside
      const progressToCenter = strength >= 0 ? lane.phase : 1 - lane.phase;
      let s = 0.045 + 0.015 * Math.sin(lane.phase * Math.PI * 2);
      if (progressToCenter < 0.1) {
        // Smoothly scale from 0 right as they spawn at (or get sucked into) the center
        s *= progressToCenter / 0.1;
      } else if (progressToCenter > 0.88) {
        // Smoothly fade out near the outer reach
        s *= (1 - progressToCenter) / 0.12;
      }
      dummy.scale.setScalar(Math.max(0.001, s));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} />
    </instancedMesh>
  );
}

function CrossSectionSlice({ strength, radius }: { strength: number; radius: number }) {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const field = makeRadialField(strength);
    const img = ctx.createImageData(size, size);
    const maxDiv = Math.max(1e-6, Math.abs(3 * strength));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = ((i / size) - 0.5) * radius * 2.4;
        const y = ((j / size) - 0.5) * radius * 2.4;
        const div = field.divergence({ x, y, z: 0 });
        const t = Math.max(-1, Math.min(1, div / maxDiv));
        const idx = (j * size + i) * 4;
        if (t >= 0) {
          img.data[idx] = Math.round(79 + (255 - 79) * t);
          img.data[idx + 1] = Math.round(216 - 40 * t);
          img.data[idx + 2] = Math.round(196 - 100 * t);
        } else {
          const s = -t;
          img.data[idx] = Math.round(232 - 30 * s);
          img.data[idx + 1] = Math.round(96 - 40 * s);
          img.data[idx + 2] = Math.round(122 + 40 * s);
        }
        img.data[idx + 3] = Math.hypot(x, y) < radius ? 200 : 0;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [strength, radius]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[radius * 2.4, radius * 2.4]} />
      <meshBasicMaterial map={texture} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SceneContent({ strength, radius, running, showSlice, teal, ink }: Props & { teal: string; ink: string }) {
  const sphereEdgesGeo = useMemo(() => new THREE.SphereGeometry(radius, 24, 16), [radius]);
  useEffect(() => {
    return () => sphereEdgesGeo.dispose();
  }, [sphereEdgesGeo]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1} />

      <mesh>
        <sphereGeometry args={[radius, 48, 32]} />
        <meshStandardMaterial color={strength >= 0 ? teal : '#E8607A'} transparent opacity={0.18} side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[sphereEdgesGeo]} />
        <lineBasicMaterial color={ink} transparent opacity={0.25} />
      </lineSegments>

      <Particles strength={strength} radius={radius} running={running} />
      {showSlice && <CrossSectionSlice strength={strength} radius={radius} />}

      <gridHelper args={[10, 20, '#444444', '#333333']} position={[0, -radius - 1.2, 0]} />
      <OrbitControls enablePan={false} minDistance={2} maxDistance={14} />
    </>
  );
}

export default function GaussScene({ strength, radius, running, showSlice }: Props) {
  const [colors] = useState(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      teal: root.getPropertyValue('--teal').trim() || '#4FD8C4',
      ink: root.getPropertyValue('--ink').trim() || '#E9E6DC',
    };
  });

  return (
    <div className="flex-1 min-h-0">
      <Canvas camera={{ position: [5, 3.5, 5], fov: 45 }}>
        <SceneContent strength={strength} radius={radius} running={running} showSlice={showSlice} {...colors} />
      </Canvas>
    </div>
  );
}
