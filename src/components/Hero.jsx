import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'

const TARGET = 'PORTFOLIO'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Full-viewport typographic hero.
 * Sequence: brand word scrambles letter-by-letter into PORTFOLIO, then the
 * typography lifts, a lime rule draws in, and the subtitle / CTAs fade in.
 * Scroll is locked until it finishes.
 */
export default function Hero({ ready = true }) {
  const [text, setText] = useState(profile.brand)
  const typoRef = useRef(null)
  const imgRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const introDone = useRef(false)

  // Mouse parallax: text and portrait drift in opposite directions for depth
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const tx = gsap.quickTo(typoRef.current, 'x', { duration: 1.2, ease: 'power3.out' })
    const ty = gsap.quickTo(typoRef.current, 'y', { duration: 1.2, ease: 'power3.out' })
    const onMove = (e) => {
      if (!introDone.current) return
      const px = e.clientX / window.innerWidth - 0.5
      const py = e.clientY / window.innerHeight - 0.5
      tx(px * -40)
      ty(py * -16)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const timers = []
    let tl

    document.body.style.overflow = 'hidden'

    gsap.set(typoRef.current, { top: '50%', yPercent: -50 })
    gsap.set(imgRef.current, { scaleX: 0 })
    gsap.set([subtitleRef.current, ctaRef.current], { opacity: 0, y: 50 })

    if (!ready) return () => {} // wait for the preloader; effect re-runs when ready flips

    const finish = () => {
      document.body.style.overflow = 'auto'
      introDone.current = true
    }

    const runReveal = () => {
      tl = gsap.timeline({ onComplete: finish })
      tl.to(typoRef.current, {
        top: isMobile ? '36%' : '40%',
        duration: 1.5,
        ease: 'power3.inOut',
      })
        .to(imgRef.current, { scaleX: 1, duration: 1.2, ease: 'power3.out' }, '<0.4')
        .to(
          [subtitleRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 },
          '<0.3',
        )
    }

    // Progressive scramble: each frame locks in one more correct letter from the left,
    // while the remaining slots cycle through random glyphs.
    const runScramble = () => {
      const from = profile.brand
      const len = Math.max(from.length, TARGET.length)
      let locked = 0
      const tick = () => {
        let out = ''
        for (let i = 0; i < len; i++) {
          if (i < locked) out += TARGET[i] ?? ''
          else if (i < TARGET.length) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          else if (Math.random() < 0.5) out += from[i] // trailing extra letter flickers out
        }
        setText(out)
        locked++
        if (locked <= TARGET.length + 2) {
          timers.push(setTimeout(tick, 50))
        } else {
          setText(TARGET)
          timers.push(setTimeout(runReveal, 400))
        }
      }
      tick()
    }

    const start = () => {
      if (prefersReduced) {
        setText(TARGET)
        gsap.set(typoRef.current, { top: isMobile ? '36%' : '40%' })
        gsap.set(imgRef.current, { scaleX: 1 })
        gsap.set([subtitleRef.current, ctaRef.current], { opacity: 1, y: 0 })
        finish()
        return
      }
      timers.push(setTimeout(runScramble, 350))
    }

    start()

    return () => {
      timers.forEach(clearTimeout)
      tl?.kill()
      finish()
    }
  }, [ready])

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-ink"
      aria-label="Introduction"
    >
      {/* Background radial gradient + overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#050505_70%)]" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Giant typography (behind the person) */}
      <h1
        ref={typoRef}
        className="metal-text pointer-events-none absolute left-1/2 z-10 w-full -translate-x-1/2 select-none text-center font-black uppercase leading-none tracking-[-0.04em] text-[16vw] md:text-[10rem] 2xl:text-[14rem]"
        aria-label={`${profile.fullName} — Portfolio`}
      >
        {text}
      </h1>

      {/* Thin lime rule that draws in under the typography */}
      <div ref={imgRef} className="absolute left-1/2 top-[58%] z-20 h-px w-[60vw] max-w-[720px] -translate-x-1/2 bg-gradient-to-r from-transparent via-lime to-transparent md:top-[60%]" />

      {/* Subtitle + education, centered under the typography */}
      <div
        ref={subtitleRef}
        className="absolute left-1/2 top-[62%] z-30 w-full -translate-x-1/2 px-6 text-center text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.8)] md:top-[64%]"
      >
        <p className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl">
          <span className="font-bold">{profile.role.bold}</span>{' '}
          <span className="font-serif font-light italic">{profile.role.italic}</span>
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-mist md:text-sm">{profile.education}</p>
      </div>

      {/* CTAs */}
      <div
        ref={ctaRef}
        className="absolute left-1/2 top-[78%] z-30 flex -translate-x-1/2 items-center gap-3 md:top-[80%]"
      >
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-lime/60 bg-lime px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#b8e600]"
        >
          Resume
        </a>
        <a
          href="#contact"
          className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/40 py-2.5 pl-5 pr-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/60"
        >
          Contact
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 group-hover:rotate-45">
            <ArrowIcon />
          </span>
        </a>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}
