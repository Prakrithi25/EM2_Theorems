import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface Arrow3DProps {
  origin: [number, number, number];
  direction: [number, number, number];
  length?: number;
  color?: string;
  thickness?: number;
  opacity?: number;
}

const UP = new THREE.Vector3(0, 1, 0);

export default function Arrow3D({
  origin,
  direction,
  length = 0.5,
  color = '#4FD8C4',
  thickness = 1,
  opacity = 1,
}: Arrow3DProps) {
  const quaternion = useMemo(() => {
    const dir = new THREE.Vector3(...direction);
    if (dir.lengthSq() < 1e-10) return new THREE.Quaternion();
    dir.normalize();
    return new THREE.Quaternion().setFromUnitVectors(UP, dir);
  }, [direction[0], direction[1], direction[2]]);

  const shaftLen = length * 0.7;
  const headLen = length * 0.3;
  const r = 0.02 * thickness;

  const { cylGeo, coneGeo, mat } = useMemo(() => {
    const cg = new THREE.CylinderGeometry(r, r, shaftLen, 8);
    const ng = new THREE.ConeGeometry(r * 3, headLen, 10);
    const m = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity });
    return { cylGeo: cg, coneGeo: ng, mat: m };
  }, [r, shaftLen, headLen, color, opacity]);

  useEffect(() => {
    return () => {
      cylGeo.dispose();
      coneGeo.dispose();
      mat.dispose();
    };
  }, [cylGeo, coneGeo, mat]);

  return (
    <group position={origin} quaternion={quaternion}>
      <mesh position={[0, shaftLen / 2, 0]} geometry={cylGeo} material={mat} />
      <mesh position={[0, shaftLen + headLen / 2, 0]} geometry={coneGeo} material={mat} />
    </group>
  );
}
