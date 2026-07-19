export type FieldType2D = 'rotation' | 'source' | 'sink' | 'saddle';

export interface Field2D {
  id: FieldType2D;
  label: string;
  description: string;
  P: (x: number, y: number) => number;
  Q: (x: number, y: number) => number;
  curl: (x: number, y: number) => number;
}

export const FIELDS_2D: Record<FieldType2D, Field2D> = {
  rotation: {
    id: 'rotation',
    label: 'Uniform rotation',
    description: 'A rigid rotation field, F = (−y, x). Every point spins the loop the same way.',
    P: (_x, y) => -y,
    Q: (x, _y) => x,
    curl: () => 2,
  },
  source: {
    id: 'source',
    label: 'Source (outflow)',
    description: 'Pure radial outflow, F = (x, y). Curl is zero everywhere — nothing spins.',
    P: (x) => x,
    Q: (_x, y) => y,
    curl: () => 0,
  },
  sink: {
    id: 'sink',
    label: 'Sink (inflow)',
    description: 'Pure radial inflow, F = (−x, −y). Also curl-free, but divergence is negative.',
    P: (x) => -x,
    Q: (_x, y) => -y,
    curl: () => 0,
  },
  saddle: {
    id: 'saddle',
    label: 'Saddle (shear)',
    description: 'Hyperbolic shear flow, F = (x, −y). Stretches one axis, compresses the other; curl-free.',
    P: (x) => x,
    Q: (_x, y) => -y,
    curl: () => 0,
  },
};

export function numericCurl(field: Field2D, x: number, y: number, h = 1e-3): number {
  const dQdx = (field.Q(x + h, y) - field.Q(x - h, y)) / (2 * h);
  const dPdy = (field.P(x, y + h) - field.P(x, y - h)) / (2 * h);
  return dQdx - dPdy;
}

export interface Point {
  x: number;
  y: number;
}

export function lineIntegral(field: Field2D, polygon: Point[]): number {
  if (polygon.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    total += field.P(mx, my) * dx + field.Q(mx, my) * dy;
  }
  return total;
}

export function lineIntegralPartial(field: Field2D, polygon: Point[], t: number): number {
  if (polygon.length < 3) return 0;
  const n = polygon.length;
  const clampedT = Math.max(0, Math.min(1, t));
  const totalEdges = n;
  const exact = clampedT * totalEdges;
  const fullEdges = Math.floor(exact);
  const frac = exact - fullEdges;

  let total = 0;
  for (let i = 0; i < fullEdges; i++) {
    const a = polygon[i % n];
    const b = polygon[(i + 1) % n];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    total += field.P(mx, my) * (b.x - a.x) + field.Q(mx, my) * (b.y - a.y);
  }
  if (frac > 0 && fullEdges < n) {
    const a = polygon[fullEdges % n];
    const b = polygon[(fullEdges + 1) % n];
    const px = a.x + (b.x - a.x) * frac;
    const py = a.y + (b.y - a.y) * frac;
    const mx = (a.x + px) / 2;
    const my = (a.y + py) / 2;
    total += field.P(mx, my) * (px - a.x) + field.Q(mx, my) * (py - a.y);
  }
  return total;
}

export function pointInPolygon(pt: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersects =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function polygonArea(polygon: Point[]): number {
  let sum = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

export function areaIntegralOfCurl(field: Field2D, polygon: Point[], gridStep = 0.15): number {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  let sum = 0;
  const cellArea = gridStep * gridStep;
  for (let x = minX + gridStep / 2; x < maxX; x += gridStep) {
    for (let y = minY + gridStep / 2; y < maxY; y += gridStep) {
      if (pointInPolygon({ x, y }, polygon)) {
        sum += field.curl(x, y) * cellArea;
      }
    }
  }
  return sum;
}

export function sampleInteriorGrid(polygon: Point[], gridStep = 0.6): Point[] {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pts: Point[] = [];
  for (let x = minX + gridStep / 2; x < maxX; x += gridStep) {
    for (let y = minY + gridStep / 2; y < maxY; y += gridStep) {
      if (pointInPolygon({ x, y }, polygon)) pts.push({ x, y });
    }
  }
  return pts;
}

export function makeRegularPolygon(cx: number, cy: number, radius: number, sides = 28): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2;
    pts.push({ x: cx + radius * Math.cos(theta), y: cy + radius * Math.sin(theta) });
  }
  return pts;
}
