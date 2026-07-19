import { useEffect, useRef, useState, useCallback } from 'react';
import type { Point } from '../lib/fieldMath2D';

const WORLD_HALF = 4;

interface Props {
  mode: 'work' | 'area';
  fieldType: 'conservative' | 'non-conservative';
  pathType: 'straight' | 'parabola' | 'lshape';
  shapeType: 'circle' | 'ellipse' | 'triangle';
  running: boolean;
  onWorkReadout: (work: number, deltaPhi: number | null, startPt: Point, endPt: Point) => void;
  onAreaReadout: (lineIntegralArea: number, geometricArea: number) => void;
}

export default function IntegrationCanvas({
  mode,
  fieldType,
  pathType,
  shapeType,
  running,
  onWorkReadout,
  onAreaReadout,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 580, h: 420 });
  const [startPt, setStartPt] = useState<Point>({ x: -2.2, y: -1.2 });
  const [endPt, setEndPt] = useState<Point>({ x: 2.2, y: 1.6 });
  const dragRef = useRef<'none' | 'start' | 'end'>('none');
  const tRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [cssVars, setCssVars] = useState({ ink: '#1B2430', teal: '#0E8C7F', amber: '#B5720F', grid: '#C9BFA9', panel: '#fff' });
  const lastTimeRef = useRef(performance.now());
  const lastWorkReadoutRef = useRef<{ work: number; deltaPhi: number | null; sx: number; sy: number; ex: number; ey: number } | null>(null);
  const lastAreaReadoutRef = useRef<{ areaLine: number; geomArea: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setSize({ w: rect.width, h: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setCssVars({
      ink: root.getPropertyValue('--ink').trim() || '#1B2430',
      teal: root.getPropertyValue('--teal').trim() || '#0E8C7F',
      amber: root.getPropertyValue('--amber').trim() || '#B5720F',
      grid: root.getPropertyValue('--grid').trim() || '#C9BFA9',
      panel: root.getPropertyValue('--panel').trim() || '#fff',
    });
  }, []);

  const worldToScreen = useCallback(
    (p: Point) => {
      const scale = Math.min(size.w, size.h) / (WORLD_HALF * 2);
      return { x: size.w / 2 + p.x * scale, y: size.h / 2 - p.y * scale };
    },
    [size]
  );
  const screenToWorld = useCallback(
    (sx: number, sy: number) => {
      const scale = Math.min(size.w, size.h) / (WORLD_HALF * 2);
      return { x: (sx - size.w / 2) / scale, y: -(sy - size.h / 2) / scale };
    },
    [size]
  );

  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      if (running) {
        tRef.current = (tRef.current + dt * 0.22) % 1;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, fieldType, pathType, shapeType, running, startPt, endPt, size, cssVars]);

  function getField(x: number, y: number) {
    if (fieldType === 'conservative') {
      // F = (2xy, x^2), potential phi(x,y) = x^2 y
      return { fx: 2 * x * y, fy: x * x };
    } else {
      // F = (-y, x), circulation around origin
      return { fx: -y, fy: x };
    }
  }

  function getPotential(p: Point): number | null {
    if (fieldType === 'conservative') {
      return p.x * p.x * p.y;
    }
    return null;
  }

  function getPathPoints(steps = 150): Point[] {
    const pts: Point[] = [];
    if (pathType === 'straight') {
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        pts.push({
          x: startPt.x + (endPt.x - startPt.x) * u,
          y: startPt.y + (endPt.y - startPt.y) * u,
        });
      }
    } else if (pathType === 'parabola') {
      // Parabolic bump perpendicular to straight segment
      const dx = endPt.x - startPt.x;
      const dy = endPt.y - startPt.y;
      const nx = -dy * 0.4;
      const ny = dx * 0.4;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const bump = 4 * u * (1 - u);
        pts.push({
          x: startPt.x + dx * u + nx * bump,
          y: startPt.y + dy * u + ny * bump,
        });
      }
    } else if (pathType === 'lshape') {
      const mid = { x: endPt.x, y: startPt.y };
      const half = Math.floor(steps / 2);
      for (let i = 0; i <= half; i++) {
        const u = i / half;
        pts.push({
          x: startPt.x + (mid.x - startPt.x) * u,
          y: startPt.y + (mid.y - startPt.y) * u,
        });
      }
      for (let i = 1; i <= steps - half; i++) {
        const u = i / (steps - half);
        pts.push({
          x: mid.x + (endPt.x - mid.x) * u,
          y: mid.y + (endPt.y - mid.y) * u,
        });
      }
    }
    return pts;
  }

  function getBoundaryPolygon(steps = 120): Point[] {
    const pts: Point[] = [];
    if (shapeType === 'circle') {
      const R = 2.4;
      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        pts.push({ x: R * Math.cos(theta), y: R * Math.sin(theta) });
      }
    } else if (shapeType === 'ellipse') {
      const a = 2.8, b = 1.6;
      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        pts.push({ x: a * Math.cos(theta), y: b * Math.sin(theta) });
      }
    } else if (shapeType === 'triangle') {
      // Equilateral-ish triangle
      const vertices = [
        { x: -2.4, y: -1.6 },
        { x: 2.4, y: -1.6 },
        { x: 0, y: 2.4 },
      ];
      for (let v = 0; v < 3; v++) {
        const p0 = vertices[v];
        const p1 = vertices[(v + 1) % 3];
        const edgeSteps = Math.floor(steps / 3);
        for (let i = 0; i < edgeSteps; i++) {
          const u = i / edgeSteps;
          pts.push({ x: p0.x + (p1.x - p0.x) * u, y: p0.y + (p1.y - p0.y) * u });
        }
      }
    }
    return pts;
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    if (mode === 'work') {
      drawWorkScene(ctx);
    } else {
      drawAreaScene(ctx);
    }
  }

  function drawWorkScene(ctx: CanvasRenderingContext2D) {
    // Background vector field arrows
    const step = 0.85;
    ctx.strokeStyle = cssVars.grid;
    ctx.fillStyle = cssVars.grid;
    ctx.lineWidth = 1.3;
    for (let x = -WORLD_HALF + step / 2; x < WORLD_HALF; x += step) {
      for (let y = -WORLD_HALF + step / 2; y < WORLD_HALF; y += step) {
        const { fx, fy } = getField(x, y);
        const mag = Math.hypot(fx, fy) || 1e-6;
        const norm = Math.min(mag, 3.5) / mag;
        drawArrow(ctx, worldToScreen({ x, y }), worldToScreen({ x: x + fx * norm * 0.22, y: y + fy * norm * 0.22 }));
      }
    }

    const path = getPathPoints(150);
    // Draw path
    ctx.beginPath();
    path.forEach((p, i) => {
      const s = worldToScreen(p);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.strokeStyle = cssVars.teal;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate line integral
    let work = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p0 = path[i];
      const p1 = path[i + 1];
      const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const { fx, fy } = getField(mid.x, mid.y);
      work += fx * (p1.x - p0.x) + fy * (p1.y - p0.y);
    }

    // Walker along path
    const idx = Math.floor(tRef.current * (path.length - 1));
    const wp = worldToScreen(path[idx]);
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.amber;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draggable start & end markers
    const sStart = worldToScreen(startPt);
    const sEnd = worldToScreen(endPt);

    ctx.beginPath();
    ctx.arc(sStart.x, sStart.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.ink;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = cssVars.ink;
    ctx.fillText('A (Start)', sStart.x + 12, sStart.y + 4);

    ctx.beginPath();
    ctx.arc(sEnd.x, sEnd.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.teal;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = cssVars.teal;
    ctx.fillText('B (End)', sEnd.x + 12, sEnd.y + 4);

    const phiStart = getPotential(startPt);
    const phiEnd = getPotential(endPt);
    const deltaPhi = phiStart !== null && phiEnd !== null ? phiEnd - phiStart : null;

    const lw = lastWorkReadoutRef.current;
    if (
      !lw ||
      Math.abs(lw.work - work) > 1e-6 ||
      lw.deltaPhi !== deltaPhi ||
      lw.sx !== startPt.x ||
      lw.sy !== startPt.y ||
      lw.ex !== endPt.x ||
      lw.ey !== endPt.y
    ) {
      lastWorkReadoutRef.current = { work, deltaPhi, sx: startPt.x, sy: startPt.y, ex: endPt.x, ey: endPt.y };
      onWorkReadout(work, deltaPhi, startPt, endPt);
    }
  }

  function drawAreaScene(ctx: CanvasRenderingContext2D) {
    const poly = getBoundaryPolygon(140);
    ctx.beginPath();
    poly.forEach((p, i) => {
      const s = worldToScreen(p);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.strokeStyle = cssVars.teal;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = cssVars.teal + '20';
    ctx.fill();

    // Numerical area integral 1/2 \oint (x dy - y dx)
    let areaLine = 0;
    for (let i = 0; i < poly.length; i++) {
      const p0 = poly[i];
      const p1 = poly[(i + 1) % poly.length];
      areaLine += (p0.x * p1.y - p1.x * p0.y) / 2;
    }

    let geomArea = 0;
    if (shapeType === 'circle') geomArea = Math.PI * 2.4 * 2.4;
    else if (shapeType === 'ellipse') geomArea = Math.PI * 2.8 * 1.6;
    else if (shapeType === 'triangle') geomArea = 0.5 * 4.8 * 4.0;

    // Walker walking CCW
    const idx = Math.floor(tRef.current * poly.length) % poly.length;
    const wp = worldToScreen(poly[idx]);
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.amber;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    const la = lastAreaReadoutRef.current;
    if (!la || Math.abs(la.areaLine - areaLine) > 1e-6 || Math.abs(la.geomArea - geomArea) > 1e-6) {
      lastAreaReadoutRef.current = { areaLine, geomArea };
      onAreaReadout(areaLine, geomArea);
    }
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    const a = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 4;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(a - Math.PI / 6), to.y - headLen * Math.sin(a - Math.PI / 6));
    ctx.lineTo(to.x - headLen * Math.cos(a + Math.PI / 6), to.y - headLen * Math.sin(a + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (mode !== 'work') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const distStart = Math.hypot(w.x - startPt.x, w.y - startPt.y);
    const distEnd = Math.hypot(w.x - endPt.x, w.y - endPt.y);
    if (distStart < 0.85) dragRef.current = 'start';
    else if (distEnd < 0.85) dragRef.current = 'end';
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current === 'none' || mode !== 'work') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const clamped = {
      x: Math.max(-WORLD_HALF + 0.4, Math.min(WORLD_HALF - 0.4, w.x)),
      y: Math.max(-WORLD_HALF + 0.4, Math.min(WORLD_HALF - 0.4, w.y)),
    };
    if (dragRef.current === 'start') setStartPt(clamped);
    else if (dragRef.current === 'end') setEndPt(clamped);
  }

  function handlePointerUp() {
    dragRef.current = 'none';
  }

  return (
    <div ref={containerRef} className="flex-1 relative min-h-0">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute inset-0 touch-none ${mode === 'work' ? 'cursor-grab active:cursor-grabbing' : ''}`}
      />
    </div>
  );
}
