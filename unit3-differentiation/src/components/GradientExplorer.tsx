import { useEffect, useRef, useState, useCallback } from 'react';
import { BOWL_FIELD, directionalDerivative } from '../lib/scalarField';
import type { Point } from '../lib/fieldMath2D';

const WORLD_HALF = 4;

interface Props {
  onReadouts: (grad: { gx: number; gy: number }, dirDeriv: number, angleDeg: number) => void;
}

export default function GradientExplorer({ onReadouts }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 500, h: 380 });
  const [point, setPoint] = useState<Point>({ x: 1.2, y: 0.8 });
  const [angle, setAngle] = useState(0.9); // radians
  const dragRef = useRef<'none' | 'point' | 'dir'>('none');
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
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, point, angle, cssVars]);

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

    // contour lines: f(x,y) = c for a range of c
    ctx.strokeStyle = cssVars.grid;
    ctx.lineWidth = 1.2;
    for (let c = 1; c <= 16; c += 1.6) {
      ctx.beginPath();
      let started = false;
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = Math.sqrt(c) * Math.cos(t);
        const y = Math.sqrt(c / 2) * Math.sin(t);
        const s = worldToScreen({ x, y });
        if (!started) {
          ctx.moveTo(s.x, s.y);
          started = true;
        } else ctx.lineTo(s.x, s.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // gradient field arrows on a grid
    const step = 1.0;
    ctx.strokeStyle = cssVars.grid;
    ctx.fillStyle = cssVars.grid;
    for (let x = -WORLD_HALF + step / 2; x < WORLD_HALF; x += step) {
      for (let y = -WORLD_HALF + step / 2; y < WORLD_HALF; y += step) {
        const { gx, gy } = BOWL_FIELD.grad(x, y);
        const mag = Math.hypot(gx, gy) || 1e-6;
        const norm = Math.min(mag, 4) / mag;
        drawArrow(ctx, worldToScreen({ x, y }), worldToScreen({ x: x + gx * norm * 0.09, y: y + gy * norm * 0.09 }), 0.5);
      }
    }

    // gradient vector at chosen point (bold)
    const { gx, gy } = BOWL_FIELD.grad(point.x, point.y);
    const gmag = Math.hypot(gx, gy) || 1e-6;
    const gUnit = { x: gx / gmag, y: gy / gmag };
    const p0 = worldToScreen(point);
    drawArrow(ctx, p0, worldToScreen({ x: point.x + gUnit.x * 0.9, y: point.y + gUnit.y * 0.9 }), 1.8, cssVars.teal);

    // direction vector (draggable)
    const dir = { x: Math.cos(angle), y: Math.sin(angle) };
    drawArrow(ctx, p0, worldToScreen({ x: point.x + dir.x * 0.9, y: point.y + dir.y * 0.9 }), 1.8, cssVars.amber);

    // point marker
    ctx.beginPath();
    ctx.arc(p0.x, p0.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.ink;
    ctx.fill();

    // direction handle (draggable dot at end of amber arrow)
    const handle = worldToScreen({ x: point.x + dir.x * 0.9, y: point.y + dir.y * 0.9 });
    ctx.beginPath();
    ctx.arc(handle.x, handle.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.amber;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    const dDeriv = directionalDerivative(BOWL_FIELD, point.x, point.y, dir.x, dir.y);
    onReadouts({ gx, gy }, dDeriv, (angle * 180) / Math.PI);
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    width: number,
    color?: string
  ) {
    if (color) ctx.strokeStyle = color;
    if (color) ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    const a = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 4 + width * 2;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(a - Math.PI / 6), to.y - headLen * Math.sin(a - Math.PI / 6));
    ctx.lineTo(to.x - headLen * Math.cos(a + Math.PI / 6), to.y - headLen * Math.sin(a + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const dir = { x: Math.cos(angle), y: Math.sin(angle) };
    const handlePos = { x: point.x + dir.x * 0.9, y: point.y + dir.y * 0.9 };
    const distToHandle = Math.hypot(w.x - handlePos.x, w.y - handlePos.y);
    const distToPoint = Math.hypot(w.x - point.x, w.y - point.y);
    if (distToHandle < 0.45) dragRef.current = 'dir';
    else if (distToPoint < 0.55) dragRef.current = 'point';
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current === 'none') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    if (dragRef.current === 'point') {
      setPoint({
        x: Math.max(-WORLD_HALF + 0.3, Math.min(WORLD_HALF - 0.3, w.x)),
        y: Math.max(-WORLD_HALF + 0.3, Math.min(WORLD_HALF - 0.3, w.y)),
      });
    } else if (dragRef.current === 'dir') {
      setAngle(Math.atan2(w.y - point.y, w.x - point.x));
    }
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
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
