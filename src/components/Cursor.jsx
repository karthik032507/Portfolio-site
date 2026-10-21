import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Custom cursor: a lime dot that sticks to the pointer and a ring that lags
 * behind. Over links/buttons the ring swells; elements with `data-magnetic`
 * are pulled toward the pointer. Only on fine pointers (desktop).
 */
export default function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cursor-dot'
    ring.className = 'cursor-ring'
    document.body.append(dot, ring)
    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    let magnet = null
    const onMove = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const mx = e.clientX - (r.left + r.width / 2)
        const my = e.clientY - (r.top + r.height / 2)
        gsap.to(magnet, { x: mx * 0.3, y: my * 0.3, duration: 0.4, ease: 'power3.out' })
      }
    }
    const onOver = (e) => {
      const t = e.target.closest('a, button, [data-cursor]')
      if (t) {
        ring.classList.add('is-active')
        if (t.dataset.cursor === 'text') ring.classList.add('is-text')
      }
      const m = e.target.closest('[data-magnetic]')
      if (m && m !== magnet) magnet = m
    }
    const onOut = (e) => {
      const t = e.target.closest('a, button, [data-cursor]')
      if (t && !t.contains(e.relatedTarget)) ring.classList.remove('is-active', 'is-text')
      const m = e.target.closest('[data-magnetic]')
      if (m && m === magnet && !m.contains(e.relatedTarget)) {
        gsap.to(m, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        magnet = null
      }
    }
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      dot.remove()
      ring.remove()
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return null
}
