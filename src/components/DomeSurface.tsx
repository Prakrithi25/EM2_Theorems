import { useMemo } from 'react';
import * as THREE from 'three';
import { domePoint } from '../lib/fieldMath3D';

interface Props {
  baseRadius: number;
  height: number;
  color: string;
}

export default function DomeSurface({ baseRadius, height, color }: Props) {
  const geometry = useMemo(() => {
    const nu = 28;
    const nv = 48;
    const positions: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      for (let j = 0; j <= nv; j++) {
        const v = j / nv;
        const p = domePoint(u, v, baseRadius, height);
        positions.push(p.x, p.z, p.y); // swap y/z: three.js Y is "up"
      }
    }
    for (let i = 0; i < nu; i++) {
      for (let j = 0; j < nv; j++) {
        const a = i * (nv + 1) + j;
        const b = a + 1;
        const c = a + (nv + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [baseRadius, height]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        roughness={0.6}
      />
    </mesh>
  );
}
