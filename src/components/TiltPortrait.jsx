import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * 3D portrait card.
 * - Hover: tilts toward the pointer (perspective), with a moving glare.
 * - Drag (mouse or touch): spins around the Y axis, keeps momentum on release
 *   and eases back upright.
 * - `caption` / `subcaption` render over a gradient at the bottom of the card.
 * The card fills its parent's height, so the parent decides the size.
 */
export default function TiltPortrait({ src, alt, caption, subcaption, className = '' }) {
  const wrapRef = useRef(null)
  const cardRef = useRef(null)
  const glareRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const card = cardRef.current
    const glare = glareRef.current
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const state = { rx: 0, ry: 0, spin: 0 }
    const qx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const qy = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const gx = gsap.quickTo(glare, 'xPercent', { duration: 0.6, ease: 'power3.out' })
    const gy = gsap.quickTo(glare, 'yPercent', { duration: 0.6, ease: 'power3.out' })

    let dragging = false, lastX = 0, velocity = 0, inertia

    const apply = () => { qx(state.rx); qy(state.ry + state.spin) }

    const onMove = (e) => {
      if (dragging || !fine || reduced) return
      const r = wrap.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      state.ry = px * 22
      state.rx = -py * 16
      gx(px * 60)
      gy(py * 60)
      apply()
    }
    const onLeave = () => {
      if (dragging) return
      state.rx = 0; state.ry = 0
      gx(0); gy(0)
      apply()
    }
    const pointX = (e) => (e.touches ? e.touches[0].clientX : e.clientX)
    const onDown = (e) => {
      if (reduced) return
      dragging = true
      inertia?.kill()
      lastX = pointX(e)
      velocity = 0
      card.style.cursor = 'grabbing'
    }
    const onDrag = (e) => {
      if (!dragging) return
      const x = pointX(e)
      velocity = x - lastX
      lastX = x
      state.spin += velocity * 0.6
      gsap.set(card, { rotationY: state.ry + state.spin, rotationX: state.rx })
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      card.style.cursor = 'grab'
      const momentum = { v: velocity * 0.6 }
      inertia = gsap.to(momentum, {
        v: 0, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { state.spin += momentum.v; gsap.set(card, { rotationY: state.ry + state.spin }) },
        onComplete: () => {
          const settled = Math.round(state.spin / 360) * 360
          gsap.to(state, {
            spin: settled, duration: 0.9, ease: 'power3.out',
            onUpdate: () => gsap.set(card, { rotationY: state.ry + state.spin }),
            onComplete: () => { state.spin = 0; gsap.set(card, { rotationY: state.ry }) },
          })
        },
      })
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    wrap.addEventListener('mousedown', onDown)
    wrap.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('touchmove', onDrag, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
      wrap.removeEventListener('mousedown', onDown)
      wrap.removeEventListener('touchstart', onDown)
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('touchmove', onDrag)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
      inertia?.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} className={`h-full w-full [perspective:1200px] ${className}`}>
      <div
        ref={cardRef}
        className="relative h-full cursor-grab select-none will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[24px] border border-lime/40 bg-[#0b0b0b] [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          aria-hidden="true"
        >
          <span className="font-black tracking-[-0.04em] text-lime text-[2.4rem]">{'</>'}</span>
        </div>

        {/* Front face */}
        <div className="relative h-full overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#070707] shadow-[0_40px_80px_rgba(0,0,0,0.7)] [backface-visibility:hidden]">
          <img
            src={src}
            alt={alt}
            className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2 object-cover object-top"
            draggable="false"
            loading="lazy"
          />
          {/* Top light */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
          {/* Caption */}
          {(caption || subcaption) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-5 pt-14">
              {caption && <p className="text-base font-bold text-white">{caption}</p>}
              {subcaption && (
                <p className="mt-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(204,255,0,0.9)]" />
                  {subcaption}
                </p>
              )}
            </div>
          )}
          {/* Glare */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute -inset-1/2 opacity-50 mix-blend-soft-light"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 55%)' }}
          />
        </div>
      </div>
    </div>
  )
}
