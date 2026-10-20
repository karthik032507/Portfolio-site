import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'

const ASSETS = ['/about.png']

/**
 * Full-screen loader. The counter is tied to real work: fonts + hero images.
 * Once everything is in, it finishes the count, then the panel wipes upward
 * and `onDone` fires so the hero intro can begin.
 */
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const rootRef = useRef(null)
  const lettersRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const letters = lettersRef.current.querySelectorAll('span')
    const progress = { v: 0 }
    let loaded = 0
    const total = ASSETS.length + 1 // +1 for fonts

    // Letters rise in with a stagger while loading starts
    gsap.fromTo(
      letters,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out', stagger: 0.04, delay: 0.1 },
    )

    // Ease the visible number toward the real progress so it never jumps
    const target = { v: 0 }
    const tick = gsap.to(progress, {
      v: () => target.v,
      duration: 0.6,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        setCount(Math.round(progress.v))
        gsap.set(barRef.current, { scaleX: progress.v / 100 })
      },
    })
    // Minimum on-screen time so a fast load still reads as an intro, not a flash
    const MIN_MS = 1400
    const startedAt = performance.now()
    const bump = () => {
      loaded++
      target.v = Math.min(100, Math.round((loaded / total) * 100))
      tick.invalidate().restart()
      if (loaded >= total) setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - startedAt)))
    }

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      gsap.timeline({ delay: 0.5 })
        .to(progress, {
          v: 100,
          duration: 0.4,
          onUpdate: () => {
            setCount(Math.round(progress.v))
            gsap.set(barRef.current, { scaleX: progress.v / 100 })
          },
        })
        .to([counterRef.current, barRef.current], { opacity: 0, duration: 0.3 })
        .to(letters, { yPercent: -110, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.03 }, '<')
        .to(rootRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.2')
        .call(onDone)
    }

    // Fonts
    if (document.fonts?.ready) document.fonts.ready.then(bump)
    else bump()

    // Images (count errors as loaded so a missing file never blocks the site)
    ASSETS.forEach((src) => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = src
    })

    // Safety net: never hang longer than 6s
    const safety = setTimeout(() => {
      target.v = 100
      finish()
    }, 6000)

    return () => {
      clearTimeout(safety)
      tick.kill()
    }
  }, [onDone])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-white"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Faint grid for a technical feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div ref={lettersRef} className="flex overflow-hidden font-black uppercase leading-none tracking-[-0.04em] text-[12vw] md:text-[7rem]">
        {profile.brand.split('').map((ch, i) => (
          <span key={i} className="metal-text inline-block">
            {ch}
          </span>
        ))}
      </div>

      <div className="mt-8 w-[60vw] max-w-[420px]">
        <div ref={barRef} className="h-px w-full origin-left bg-lime" style={{ transform: 'scaleX(0)' }} />
      </div>

      <p ref={counterRef} className="absolute bottom-10 right-8 font-mono text-sm tabular-nums text-mist md:bottom-12 md:right-12 md:text-base">
        <span className="text-lime">{String(count).padStart(3, '0')}</span> / 100
      </p>
      <p className="absolute bottom-10 left-8 text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-600 md:bottom-12 md:left-12">
        {profile.role.bold} {profile.role.italic} · Portfolio
      </p>
    </div>
  )
}
