import { useEffect, useRef, useState, useCallback } from 'react';
import { BOWL_FIELD, directionalDerivative } from '../lib/scalarField';
import type { Point } from '../lib/fieldMath2D';

const WORLD_HALF = 4;

interface Props {
  externalPoint?: { x: number; y: number };
  externalAngleDeg?: number;
  onReadouts: (
    point: { x: number; y: number },
    grad: { gx: number; gy: number },
    dirDeriv: number,
    angleDeg: number
  ) => void;
}

export default function GradientExplorer({ externalPoint, externalAngleDeg, onReadouts }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 500, h: 380 });
  
  // Stable ref for callback to prevent React infinite re-render loops
  const onReadoutsRef = useRef(onReadouts);
  useEffect(() => {
    onReadoutsRef.current = onReadouts;
  }, [onReadouts]);

  // Use refs for dragging so canvas repaints instantly at 60/120 FPS without React layout thrashing
  const pointRef = useRef<Point>({ x: 1.2, y: 0.8 });
  const angleRef = useRef(0.9); // radians
  const dragRef = useRef<'none' | 'point' | 'dir'>('none');
  const rafId = useRef<number | undefined>(undefined);

  const [cssVars, setCssVars] = useState({ ink: '#E9E6DC', teal: '#4FD8C4', amber: '#E8A33D', grid: '#2A3240', panel: '#12161D' });

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
      ink: root.getPropertyValue('--ink').trim() || '#E9E6DC',
      teal: root.getPropertyValue('--teal').trim() || '#4FD8C4',
      amber: root.getPropertyValue('--amber').trim() || '#E8A33D',
      grid: root.getPropertyValue('--grid').trim() || '#2A3240',
      panel: root.getPropertyValue('--panel').trim() || '#12161D',
    });
  }, []);

  const triggerReadout = useCallback(() => {
    const p = pointRef.current;
    const a = angleRef.current;
    const { gx, gy } = BOWL_FIELD.grad(p.x, p.y);
    const dir = { x: Math.cos(a), y: Math.sin(a) };
    const dDeriv = directionalDerivative(BOWL_FIELD, p.x, p.y, dir.x, dir.y);
    onReadoutsRef.current({ x: p.x, y: p.y }, { gx, gy }, dDeriv, (a * 180) / Math.PI);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size.w * dpr || canvas.height !== size.h * dpr) {
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      canvas.style.width = `${size.w}px`;
      canvas.style.height = `${size.h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    const point = pointRef.current;
    const angle = angleRef.current;

    // Fast inline coordinate transform constants
    const scale = Math.min(size.w, size.h) / (WORLD_HALF * 2);
    const cx = size.w / 2;
    const cy = size.h / 2;
    const wToScreen = (wx: number, wy: number) => ({ x: cx + wx * scale, y: cy - wy * scale });

    // 1. Draw contour lines: f(x,y) = c for a range of c
    ctx.strokeStyle = cssVars.grid;
    ctx.lineWidth = 1.3;
    let labelContourPos = { x: 0, y: 0 };
    for (let c = 1; c <= 16; c += 1.6) {
      ctx.beginPath();
      let started = false;
      const steps = 72; // High performance step count
      const sqrtC = Math.sqrt(c);
      const sqrtC2 = Math.sqrt(c / 2);
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = sqrtC * Math.cos(t);
        const y = sqrtC2 * Math.sin(t);
        const sx = cx + x * scale;
        const sy = cy - y * scale;
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
        if (Math.abs(c - 7.4) < 0.8 && i === 12) {
          labelContourPos = { x: sx, y: sy };
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Label on one contour line
    if (labelContourPos.x > 0) {
      ctx.font = '500 11px system-ui, sans-serif';
      ctx.fillStyle = cssVars.grid;
      ctx.fillText('Contour f(x,y)=const', labelContourPos.x + 4, labelContourPos.y - 4);
    }

    // 2. Background gradient field arrows on a grid
    const step = 1.0;
    for (let x = -WORLD_HALF + step / 2; x < WORLD_HALF; x += step) {
      for (let y = -WORLD_HALF + step / 2; y < WORLD_HALF; y += step) {
        const { gx, gy } = BOWL_FIELD.grad(x, y);
        const mag = Math.hypot(gx, gy) || 1e-6;
        const norm = Math.min(mag, 4) / mag;
        drawArrow(
          ctx,
          wToScreen(x, y),
          wToScreen(x + gx * norm * 0.09, y + gy * norm * 0.09),
          0.6,
          cssVars.grid
        );
      }
    }

    // 3. Gradient vector at chosen point (bold teal arrow scaling dynamically with slope magnitude)
    const { gx, gy } = BOWL_FIELD.grad(point.x, point.y);
    const gmag = Math.hypot(gx, gy) || 1e-6;
    const gUnit = { x: gx / gmag, y: gy / gmag };
    const p0 = wToScreen(point.x, point.y);
    
    const gradArrowLen = Math.min(3.4, Math.max(0.6, gmag * 0.4));
    const gTip = wToScreen(point.x + gUnit.x * gradArrowLen, point.y + gUnit.y * gradArrowLen);
    drawArrow(ctx, p0, gTip, 2.5, cssVars.teal);

    // Label for Gradient Vector
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = cssVars.teal;
    ctx.fillText(`∇f (|∇f|=${gmag.toFixed(1)})`, gTip.x + 8, gTip.y - 4);

    // 4. Direction vector (draggable amber arrow with fixed reference length)
    const dir = { x: Math.cos(angle), y: Math.sin(angle) };
    const dirTip = wToScreen(point.x + dir.x * 1.3, point.y + dir.y * 1.3);
    drawArrow(ctx, p0, dirTip, 2.5, cssVars.amber);

    // Label for Direction Vector û
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = cssVars.amber;
    ctx.fillText('û (Probe Direction)', dirTip.x + 10, dirTip.y + 16);

    // 5. Point marker P(x, y)
    ctx.beginPath();
    ctx.arc(p0.x, p0.y, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.ink;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label for Point
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillStyle = cssVars.ink;
    ctx.fillText('P(x,y)', p0.x - 38, p0.y + 18);

    // 6. Direction handle (draggable amber dot at end of amber arrow)
    ctx.beginPath();
    ctx.arc(dirTip.x, dirTip.y, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = cssVars.amber;
    ctx.fill();
    ctx.strokeStyle = cssVars.panel;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. On-canvas Legend box
    ctx.save();
    ctx.fillStyle = cssVars.panel;
    ctx.globalAlpha = 0.92;
    ctx.fillRect(10, 10, 250, 78);
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = cssVars.grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 250, 78);

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = cssVars.ink;
    ctx.fillText('SIMULATION VISUAL KEY:', 20, 28);

    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = cssVars.teal;
    ctx.fillText('■ Teal Arrow: Gradient ∇f (grows when steeper)', 20, 45);
    ctx.fillStyle = cssVars.amber;
    ctx.fillText('■ Amber Arrow: Unit direction û (drag dot to rotate)', 20, 61);
    ctx.fillStyle = cssVars.ink;
    ctx.fillText('■ Dark Dot P(x,y): Drag outwards across contours', 20, 77);
    ctx.restore();
  }, [size, cssVars]);

  // Synchronize when external point prop changes from Telemetry inputs
  useEffect(() => {
    if (externalPoint) {
      const dx = Math.abs(externalPoint.x - pointRef.current.x);
      const dy = Math.abs(externalPoint.y - pointRef.current.y);
      if (dx > 1e-4 || dy > 1e-4) {
        pointRef.current = {
          x: Math.max(-WORLD_HALF + 0.35, Math.min(WORLD_HALF - 0.35, externalPoint.x)),
          y: Math.max(-WORLD_HALF + 0.35, Math.min(WORLD_HALF - 0.35, externalPoint.y)),
        };
        draw();
        triggerReadout();
      }
    }
  }, [externalPoint, draw, triggerReadout]);

  // Synchronize when external angle prop changes from Telemetry inputs
  useEffect(() => {
    if (externalAngleDeg !== undefined) {
      const rad = (externalAngleDeg * Math.PI) / 180;
      if (Math.abs(rad - angleRef.current) > 1e-4) {
        angleRef.current = rad;
        draw();
        triggerReadout();
      }
    }
  }, [externalAngleDeg, draw, triggerReadout]);

  useEffect(() => {
    draw();
    triggerReadout();
  }, [draw, triggerReadout]);

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
    const scale = Math.min(size.w, size.h) / (WORLD_HALF * 2);
    const wx = (e.clientX - rect.left - size.w / 2) / scale;
    const wy = -(e.clientY - rect.top - size.h / 2) / scale;
    const dir = { x: Math.cos(angleRef.current), y: Math.sin(angleRef.current) };
    const p = pointRef.current;
    const handlePos = { x: p.x + dir.x * 1.3, y: p.y + dir.y * 1.3 };
    const distToHandle = Math.hypot(wx - handlePos.x, wy - handlePos.y);
    const distToPoint = Math.hypot(wx - p.x, wy - p.y);
    if (distToHandle < 0.48) dragRef.current = 'dir';
    else if (distToPoint < 0.58) dragRef.current = 'point';
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current !== 'none') {
      const rect = canvasRef.current!.getBoundingClientRect();
      const scale = Math.min(size.w, size.h) / (WORLD_HALF * 2);
      const wx = (e.clientX - rect.left - size.w / 2) / scale;
      const wy = -(e.clientY - rect.top - size.h / 2) / scale;
      if (dragRef.current === 'point') {
        pointRef.current = {
          x: Math.max(-WORLD_HALF + 0.35, Math.min(WORLD_HALF - 0.35, wx)),
          y: Math.max(-WORLD_HALF + 0.35, Math.min(WORLD_HALF - 0.35, wy)),
        };
      } else if (dragRef.current === 'dir') {
        const p = pointRef.current;
        angleRef.current = Math.atan2(wy - p.y, wx - p.x);
      }
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        draw();
      });
    }
  }

  function handlePointerUp() {
    if (dragRef.current !== 'none') {
      dragRef.current = 'none';
      triggerReadout();
    }
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
