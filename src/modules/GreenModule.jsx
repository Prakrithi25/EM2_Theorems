import { useEffect, useMemo, useRef, useState } from 'react'
import MathEquation from '../components/MathEquation'

const FIELD_TYPES = {
  rotation: {
    label: 'Uniform rotation',
    field: (x, y, s) => ({ x: -s * y, y: s * x }),
    curl: (s) => 2 * s,
  },
  source: {
    label: 'Source',
    field: (x, y, s) => ({ x: s * x, y: s * y }),
    curl: () => 0,
  },
  sink: {
    label: 'Sink',
    field: (x, y, s) => ({ x: -s * x, y: -s * y }),
    curl: () => 0,
  },
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function GreenModule({ darkMode }) {
  const canvasRef = useRef(null)
  const [time, setTime] = useState(0)
  const [fieldType, setFieldType] = useState('rotation')
  const [strength, setStrength] = useState(0.8)
  const [radius, setRadius] = useState(95)
  const [showCurlGears, setShowCurlGears] = useState(true)
  const [showCirculation, setShowCirculation] = useState(true)
  const [draggingBoundary, setDraggingBoundary] = useState(false)

  const center = useMemo(() => ({ x: 210, y: 210 }), [])
  const selectedField = FIELD_TYPES[fieldType]

  useEffect(() => {
    let frameId = 0
    const tick = (timestamp) => {
      setTime(timestamp)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const drawArrow = (x, y, vx, vy, color) => {
      const magnitude = Math.hypot(vx, vy)
      if (magnitude < 0.001) return

      const scale = 16 / (magnitude + 0.25)
      const dx = vx * scale
      const dy = vy * scale

      context.strokeStyle = color
      context.fillStyle = color
      context.lineWidth = 1.5
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + dx, y + dy)
      context.stroke()

      const angle = Math.atan2(dy, dx)
      context.beginPath()
      context.moveTo(x + dx, y + dy)
      context.lineTo(x + dx - 6 * Math.cos(angle - Math.PI / 6), y + dy - 6 * Math.sin(angle - Math.PI / 6))
      context.lineTo(x + dx - 6 * Math.cos(angle + Math.PI / 6), y + dy - 6 * Math.sin(angle + Math.PI / 6))
      context.closePath()
      context.fill()
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = darkMode ? '#0f172a' : '#f8fafc'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Draw 2D vector field samples.
    for (let px = 30; px <= canvas.width - 30; px += 36) {
      for (let py = 30; py <= canvas.height - 30; py += 36) {
        const x = (px - center.x) / 100
        const y = (center.y - py) / 100
        const vector = selectedField.field(x, y, strength)
        drawArrow(px, py, vector.x, -vector.y, darkMode ? '#7dd3fc' : '#0f766e')
      }
    }

    // Boundary loop C used in the line integral.
    context.strokeStyle = darkMode ? '#c4b5fd' : '#6d28d9'
    context.lineWidth = 3
    context.beginPath()
    context.arc(center.x, center.y, radius, 0, Math.PI * 2)
    context.stroke()

    // Direction marker for oriented boundary traversal.
    if (showCirculation) {
      const markerAngle = -Math.PI / 4
      const markerX = center.x + radius * Math.cos(markerAngle)
      const markerY = center.y + radius * Math.sin(markerAngle)
      drawArrow(markerX, markerY, -Math.sin(markerAngle) * 14, Math.cos(markerAngle) * 14, darkMode ? '#facc15' : '#b45309')
    }

    // Microscopic spinning gears approximate local curl inside region R.
    if (showCurlGears) {
      const curl = selectedField.curl(strength)
      for (let gx = center.x - radius + 24; gx <= center.x + radius - 24; gx += 28) {
        for (let gy = center.y - radius + 24; gy <= center.y + radius - 24; gy += 28) {
          if (Math.hypot(gx - center.x, gy - center.y) >= radius - 20) continue
          context.strokeStyle = curl >= 0 ? '#10b981' : '#ef4444'
          context.lineWidth = 1
          context.beginPath()
          context.arc(gx, gy, 7, 0, Math.PI * 2)
          context.stroke()

          const angle = (time / 600) * Math.sign(curl || 1)
          drawArrow(gx, gy, Math.cos(angle) * 6, Math.sin(angle) * 6, curl >= 0 ? '#10b981' : '#ef4444')
        }
      }
    }

    // Region label R.
    context.fillStyle = darkMode ? '#f8fafc' : '#0f172a'
    context.font = '16px ui-sans-serif, system-ui'
    context.fillText('R', center.x - 6, center.y + 6)
    context.fillText('C', center.x + radius + 8, center.y)
  }, [center, darkMode, radius, selectedField, showCirculation, showCurlGears, strength, time])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const toCanvasCoordinates = (event) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const onPointerDown = (event) => {
      const { x, y } = toCanvasCoordinates(event)
      const distance = Math.hypot(x - center.x, y - center.y)
      if (Math.abs(distance - radius) < 14) {
        setDraggingBoundary(true)
      }
    }

    const onPointerMove = (event) => {
      if (!draggingBoundary) return
      const { x, y } = toCanvasCoordinates(event)
      const distance = Math.hypot(x - center.x, y - center.y)
      setRadius(clamp(distance, 45, 170))
    }

    const stopDragging = () => setDraggingBoundary(false)

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDragging)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDragging)
    }
  }, [center, draggingBoundary, radius])

  const circulationValue = useMemo(() => {
    const r = radius / 100
    return fieldType === 'rotation' ? 2 * Math.PI * strength * r * r : 0
  }, [fieldType, radius, strength])

  const areaCurlValue = useMemo(() => {
    const r = radius / 100
    return selectedField.curl(strength) * Math.PI * r * r
  }, [radius, selectedField, strength])

  return (
    <section className="h-full">
      <h2 className="text-xl font-semibold">Green&apos;s Theorem (2D)</h2>
      <MathEquation equation={'\\oint_C (P\\,dx + Q\\,dy)=\\iint_R\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dA'} />

      <ol className="mb-4 list-inside list-decimal space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li>The boundary loop C measures macroscopic circulation.</li>
        <li>Gears inside R represent microscopic curl density.</li>
        <li>Resize C by dragging its edge to see both totals change together.</li>
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="w-full rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
          aria-label="Green theorem visualization canvas"
        />

        <div className="space-y-3 rounded-xl border border-slate-300 p-4 text-sm dark:border-slate-700">
          <label className="block">
            Field model
            <select
              className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600"
              value={fieldType}
              onChange={(event) => setFieldType(event.target.value)}
            >
              {Object.entries(FIELD_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            Vector field strength: {strength.toFixed(2)}
            <input
              className="mt-1 w-full"
              type="range"
              min="-1.5"
              max="1.5"
              step="0.05"
              value={strength}
              onChange={(event) => setStrength(Number(event.target.value))}
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            Show circulation path
            <input type="checkbox" checked={showCirculation} onChange={(event) => setShowCirculation(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between gap-3">
            Show curl gears
            <input type="checkbox" checked={showCurlGears} onChange={(event) => setShowCurlGears(event.target.checked)} />
          </label>

          <div className="space-y-1 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <p>
              Boundary circulation: <strong>{circulationValue.toFixed(4)}</strong>
            </p>
            <p>
              Area curl integral: <strong>{areaCurlValue.toFixed(4)}</strong>
            </p>
            <p>
              Difference: <strong>{Math.abs(circulationValue - areaCurlValue).toExponential(2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GreenModule
