import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FIELDS_2D,
  type FieldType2D,
  makeRegularPolygon,
  lineIntegralPartial,
  areaIntegralOfCurl,
  sampleInteriorGrid,
  type Point,
} from '../lib/fieldMath2D';

const WORLD_HALF = 5;

interface Props {
  fieldType: FieldType2D;
  mode: 'circulation' | 'curl';
  running: boolean;
  onReadouts: (line: number, area: number) => void;
  radius: number;
  onRadiusChange: (r: number) => void;
  center: Point;
  onCenterChange: (c: Point) => void;
}

export default function GreensCanvas({
  fieldType,
  mode,
  running,
  onReadouts,
  radius,
  onRadiusChange,
  center,
  onCenterChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<'none' | 'move' | 'resize'>('none');
  const tRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [size, setSize] = useState({ w: 600, h: 500 });
  const [cssVars, setCssVars] = useState({ ink: '#1B2430', teal: '#0E8C7F', amber: '#B5720F', grid: '#C9BFA9', panel: '#fff' });

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
  });

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

  const field = FIELDS_2D[fieldType];

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (running) {
        tRef.current = (tRef.current + dt * 0.18) % 1;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, fieldType, mode, radius, center, size, cssVars]);

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

    const polygon = makeRegularPolygon(center.x, center.y, radius, 48);

    drawFieldArrows(ctx);
    drawBoundary(ctx, polygon);

    if (mode === 'circulation') {
      drawParticleWalk(ctx, polygon);
    } else {
      drawCurlGears(ctx, polygon);
    }

    const line = lineIntegralPartial(field, polygon, mode === 'circulation' ? tRef.current : 1);
    const area = areaIntegralOfCurl(field, polygon, Math.max(0.08, radius / 30));
    onReadouts(line, area);
  }

  function drawFieldArrows(ctx: CanvasRenderingContext2D) {
    const step = 0.8;
    ctx.strokeStyle = cssVars.grid;
    ctx.fillStyle = cssVars.grid;
    ctx.lineWidth = 1.4;
    for (let x = -WORLD_HALF + step / 2; x < WORLD_HALF; x += step) {
      for (let y = -WORLD_HALF + step / 2; y < WORLD_HALF; y += step) {
        const vx = field.P(x, y);
        const vy = field.Q(x, y);
        const mag = Math.hypot(vx, vy) || 1e-6;
        const norm = Math.min(mag, 3) / mag;
        const dx = vx * norm * 0.28;
        const dy = vy * norm * 0.28;
        const p0 = worldToScreen({ x, y });
        const p1 = worldToScreen({ x: x + dx, y: y + dy });
        drawArrow(ctx, p0, p1);
      }
    }
  }

  function drawArrow(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 4;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function drawBoundary(ctx: CanvasRenderingContext2D, polygon: Point[]) {
    ctx.beginPath();
    polygon.forEach((p, i) => {
      const s = worldToScreen(p);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.strokeStyle = cssVars.teal;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = cssVars.teal + '18';
    ctx.fill();

    const handle = worldToScreen({ x: center.x + radius, y: center.y });
    ctx.beginPath();
    ctx.arc(handle.x, handle.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.teal;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    const c = worldToScreen(center);
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.ink;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawParticleWalk(ctx: CanvasRenderingContext2D, polygon: Point[]) {
    const n = polygon.length;
    const exact = tRef.current * n;
    const i = Math.floor(exact) % n;
    const frac = exact - Math.floor(exact);
    const a = polygon[i];
    const b = polygon[(i + 1) % n];
    const pos = { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
    const s = worldToScreen(pos);

    ctx.beginPath();
    const traceLen = Math.floor(tRef.current * n) + 1;
    for (let k = 0; k <= traceLen; k++) {
      const p = polygon[k % n];
      const sp = worldToScreen(k === traceLen ? pos : p);
      if (k === 0) ctx.moveTo(sp.x, sp.y);
      else ctx.lineTo(sp.x, sp.y);
    }
    ctx.strokeStyle = cssVars.amber;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.amber;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawCurlGears(ctx: CanvasRenderingContext2D, polygon: Point[]) {
    const pts = sampleInteriorGrid(polygon, Math.max(0.35, radius / 6));
    for (const p of pts) {
      const c = field.curl(p.x, p.y);
      const s = worldToScreen(p);
      const spin = tRef.current * Math.PI * 2 * Math.sign(c || 1) * (0.4 + Math.min(Math.abs(c), 3) * 0.6);
      const r = 9;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(spin);
      ctx.strokeStyle = c > 0.01 ? cssVars.teal : c < -0.01 ? cssVars.amber : cssVars.grid;
      ctx.lineWidth = 2;
      const teeth = 6;
      ctx.beginPath();
      for (let i = 0; i <= teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        const rr = r + (i % 2 === 0 ? 2 : -2);
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const w = screenToWorld(sx, sy);
    const handlePos = { x: center.x + radius, y: center.y };
    const distToHandle = Math.hypot(w.x - handlePos.x, w.y - handlePos.y);
    const distToCenter = Math.hypot(w.x - center.x, w.y - center.y);
    if (distToHandle < 0.5) {
      dragState.current = 'resize';
    } else if (distToCenter < radius) {
      dragState.current = 'move';
    }
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragState.current === 'none') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const w = screenToWorld(sx, sy);
    if (dragState.current === 'move') {
      const clamped = {
        x: Math.max(-WORLD_HALF + 0.5, Math.min(WORLD_HALF - 0.5, w.x)),
        y: Math.max(-WORLD_HALF + 0.5, Math.min(WORLD_HALF - 0.5, w.y)),
      };
      onCenterChange(clamped);
    } else if (dragState.current === 'resize') {
      const r = Math.hypot(w.x - center.x, w.y - center.y);
      onRadiusChange(Math.max(0.6, Math.min(WORLD_HALF - 0.2, r)));
    }
  }

  function handlePointerUp() {
    dragState.current = 'none';
  }

  return (
    <div ref={containerRef} className="flex-1 relative min-h-0">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
