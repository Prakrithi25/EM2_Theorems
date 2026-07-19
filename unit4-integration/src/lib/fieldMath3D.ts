export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = {
  add: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  sub: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  scale: (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
  dot: (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z,
  cross: (a: Vec3, b: Vec3): Vec3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  length: (a: Vec3): number => Math.hypot(a.x, a.y, a.z),
  normalize: (a: Vec3): Vec3 => {
    const l = v3.length(a) || 1e-9;
    return { x: a.x / l, y: a.y / l, z: a.z / l };
  },
};

export type FieldType3D = 'swirl' | 'shear' | 'uniform';

export interface Field3D {
  id: FieldType3D;
  label: string;
  description: string;
  F: (p: Vec3) => Vec3;
  curl: (p: Vec3) => Vec3;
}

export const FIELDS_3D: Record<FieldType3D, Field3D> = {
  swirl: {
    id: 'swirl',
    label: 'Vertical swirl',
    description: 'F = (−y, x, 0.3) — rotates around the z-axis while drifting upward. Curl points straight up.',
    F: (p) => ({ x: -p.y, y: p.x, z: 0.3 }),
    curl: () => ({ x: 0, y: 0, z: 2 }),
  },
  shear: {
    id: 'shear',
    label: 'Tilted shear',
    description: 'F = (z, 0, x) — a shear that tilts the swirl axis sideways.',
    F: (p) => ({ x: p.z, y: 0, z: p.x }),
    curl: () => ({ x: 0, y: 2, z: 0 }),
  },
  uniform: {
    id: 'uniform',
    label: 'Uniform flow',
    description: 'F = (0.6, 0.4, 0.2) — constant everywhere. Zero curl: circulation vanishes for any loop.',
    F: () => ({ x: 0.6, y: 0.4, z: 0.2 }),
    curl: () => ({ x: 0, y: 0, z: 0 }),
  },
};

export function numericCurl3D(field: Field3D, p: Vec3, h = 1e-3): Vec3 {
  const dFzdy = (field.F({ ...p, y: p.y + h }).z - field.F({ ...p, y: p.y - h }).z) / (2 * h);
  const dFydz = (field.F({ ...p, z: p.z + h }).y - field.F({ ...p, z: p.z - h }).y) / (2 * h);
  const dFxdz = (field.F({ ...p, z: p.z + h }).x - field.F({ ...p, z: p.z - h }).x) / (2 * h);
  const dFzdx = (field.F({ ...p, x: p.x + h }).z - field.F({ ...p, x: p.x - h }).z) / (2 * h);
  const dFydx = (field.F({ ...p, x: p.x + h }).y - field.F({ ...p, x: p.x - h }).y) / (2 * h);
  const dFxdy = (field.F({ ...p, y: p.y + h }).x - field.F({ ...p, y: p.y - h }).x) / (2 * h);
  return { x: dFzdy - dFydz, y: dFxdz - dFzdx, z: dFydx - dFxdy };
}

export function domePoint(u: number, v: number, baseRadius: number, height: number): Vec3 {
  const r = u * baseRadius;
  const theta = v * Math.PI * 2;
  const z = height * (1 - (r * r) / (baseRadius * baseRadius));
  return { x: r * Math.cos(theta), y: r * Math.sin(theta), z };
}

export function domeRim(baseRadius: number, steps = 64): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    pts.push({ x: baseRadius * Math.cos(theta), y: baseRadius * Math.sin(theta), z: 0 });
  }
  return pts;
}

export function domeRimTangent(_baseRadius: number, t: number): Vec3 {
  const theta = t * Math.PI * 2;
  return { x: -Math.sin(theta), y: Math.cos(theta), z: 0 };
}

export function rimCirculation(field: Field3D, baseRadius: number, steps = 200): number {
  let total = 0;
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps;
    const t1 = (i + 1) / steps;
    const theta0 = t0 * Math.PI * 2;
    const theta1 = t1 * Math.PI * 2;
    const p0 = { x: baseRadius * Math.cos(theta0), y: baseRadius * Math.sin(theta0), z: 0 };
    const p1 = { x: baseRadius * Math.cos(theta1), y: baseRadius * Math.sin(theta1), z: 0 };
    const mid = v3.scale(v3.add(p0, p1), 0.5);
    const d = v3.sub(p1, p0);
    total += v3.dot(field.F(mid), d);
  }
  return total;
}

export function rimCirculationPartial(field: Field3D, baseRadius: number, t: number, stepsPerFull = 200): number {
  const steps = Math.max(1, Math.floor(stepsPerFull * Math.max(0, Math.min(1, t))));
  return rimCirculation(field, baseRadius, steps === 0 ? 1 : steps) * (steps === 0 ? 0 : 1);
}

export function surfaceCurlFlux(
  field: Field3D,
  baseRadius: number,
  height: number,
  nu = 40,
  nv = 60
): number {
  let total = 0;
  const du = 1 / nu;
  const dv = 1 / nv;
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      const u = (i + 0.5) * du;
      const v = (j + 0.5) * dv;
      const p = domePoint(u, v, baseRadius, height);
      const h = 1e-4;
      const pu = v3.scale(
        v3.sub(domePoint(u + h, v, baseRadius, height), domePoint(u - h, v, baseRadius, height)),
        1 / (2 * h)
      );
      const pv = v3.scale(
        v3.sub(domePoint(u, v + h, baseRadius, height), domePoint(u, v - h, baseRadius, height)),
        1 / (2 * h)
      );
      let normal = v3.cross(pu, pv);
      if (normal.z < 0 && u > 0.02) normal = v3.scale(normal, -1);
      const dS = v3.scale(normal, du * dv);
      total += v3.dot(field.curl(p), dS);
    }
  }
  return total;
}

export type DivFieldType = 'radial';

export interface DivergenceField {
  strength: number;
  F: (p: Vec3) => Vec3;
  divergence: (p: Vec3) => number;
}

export function makeRadialField(strength: number): DivergenceField {
  return {
    strength,
    F: (p) => v3.scale(p, strength),
    divergence: () => 3 * strength,
  };
}

export function numericDivergence(field: DivergenceField, p: Vec3, h = 1e-3): number {
  const dFxdx = (field.F({ ...p, x: p.x + h }).x - field.F({ ...p, x: p.x - h }).x) / (2 * h);
  const dFydy = (field.F({ ...p, y: p.y + h }).y - field.F({ ...p, y: p.y - h }).y) / (2 * h);
  const dFzdz = (field.F({ ...p, z: p.z + h }).z - field.F({ ...p, z: p.z - h }).z) / (2 * h);
  return dFxdx + dFydy + dFzdz;
}

export function sphereFlux(field: DivergenceField, radius: number, nLat = 40, nLon = 60): number {
  let total = 0;
  for (let i = 0; i < nLat; i++) {
    const theta0 = (i / nLat) * Math.PI;
    const theta1 = ((i + 1) / nLat) * Math.PI;
    const theta = (theta0 + theta1) / 2;
    for (let j = 0; j < nLon; j++) {
      const phi = ((j + 0.5) / nLon) * Math.PI * 2;
      const p: Vec3 = {
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      };
      const normal = { x: Math.sin(theta) * Math.cos(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(theta) };
      const dTheta = theta1 - theta0;
      const dPhi = (Math.PI * 2) / nLon;
      const dA = radius * radius * Math.sin(theta) * dTheta * dPhi;
      total += v3.dot(field.F(p), normal) * dA;
    }
  }
  return total;
}

export function sphereVolumeIntegral(field: DivergenceField, radius: number, nR = 30): number {
  let total = 0;
  const dr = radius / nR;
  for (let i = 0; i < nR; i++) {
    const r = (i + 0.5) * dr;
    const shellVolume = 4 * Math.PI * r * r * dr;
    const p: Vec3 = { x: r, y: 0, z: 0 };
    total += field.divergence(p) * shellVolume;
  }
  return total;
}
