import { useEffect, useRef } from 'react'

/**
 * Interactive dot grid on a <canvas>. Dots repel from the pointer, glow lime
 * near it, and a click sends a ripple outward. Pure 2D canvas — no WebGL.
 */
export default function DotField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0, h = 0, dots = [], raf
    const mouse = { x: -9999, y: -9999 }
    const ripples = []
    const GAP = 34

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const cols = Math.ceil(w / GAP) + 1
      const rows = Math.ceil(h / GAP) + 1
      const ox = (w - (cols - 1) * GAP) / 2
      const oy = (h - (rows - 1) * GAP) / 2
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) dots.push({ ox: ox + c * GAP, oy: oy + r * GAP, x: ox + c * GAP, y: oy + r * GAP })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const now = performance.now()
      for (const d of dots) {
        // Repel from pointer
        let dx = d.ox - mouse.x, dy = d.oy - mouse.y
        let dist = Math.hypot(dx, dy)
        const R = 160
        let tx = d.ox, ty = d.oy
        let glow = 0
        if (dist < R) {
          const f = (1 - dist / R) ** 2
          tx += (dx / (dist || 1)) * f * 28
          ty += (dy / (dist || 1)) * f * 28
          glow = f
        }
        // Ripples
        for (const rp of ripples) {
          const age = (now - rp.t) / 1000
          const radius = age * 420
          const rd = Math.hypot(d.ox - rp.x, d.oy - rp.y)
          const band = Math.abs(rd - radius)
          if (band < 40) {
            const f = (1 - band / 40) * Math.max(0, 1 - age / 1.6)
            glow = Math.max(glow, f)
            tx += ((d.ox - rp.x) / (rd || 1)) * f * 14
            ty += ((d.oy - rp.y) / (rd || 1)) * f * 14
          }
        }
        d.x += (tx - d.x) * 0.18
        d.y += (ty - d.y) * 0.18
        const size = 1 + glow * 1.6
        ctx.beginPath()
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2)
        ctx.fillStyle = glow > 0.02
          ? `rgba(${204 - 170 * (1 - glow)}, ${255 - 170 * (1 - glow)}, ${0 + 90 * (1 - glow)}, ${0.25 + glow * 0.75})`
          : 'rgba(255,255,255,0.13)'
        ctx.fill()
      }
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > 1700) ripples.splice(i, 1)
      raf = requestAnimationFrame(draw)
    }

    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMove = (e) => Object.assign(mouse, toLocal(e))
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onClick = (e) => ripples.push({ ...toLocal(e), t: performance.now() })
    const onTouch = (e) => { const t = e.touches[0]; if (t) Object.assign(mouse, toLocal(t)) }

    build()
    if (reduced) {
      // Static grid only
      for (const d of dots) { ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.fill() }
    } else {
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(build)
    ro.observe(canvas)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('click', onClick)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('click', onClick)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none block h-full w-full ${className}`} aria-hidden="true" />
}
