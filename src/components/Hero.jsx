import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'

const TARGET = 'PORTFOLIO'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const HERO_IMAGE = '/hero.png'

/**
 * Full-viewport cinematic hero.
 * Sequence: brand word scrambles letter-by-letter into PORTFOLIO,
 * then the typography lifts while the portrait rises from below the fold
 * and the subtitle / CTAs fade in. Scroll is locked until it finishes.
 */
export default function Hero() {
  const [text, setText] = useState(profile.brand)
  const typoRef = useRef(null)
  const imgRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const timers = []
    let tl

    document.body.style.overflow = 'hidden'

    gsap.set(typoRef.current, { top: '50%', yPercent: -50 })
    gsap.set(imgRef.current, { y: '100vh' })
    gsap.set([subtitleRef.current, ctaRef.current], { opacity: 0, y: 50 })

    const finish = () => {
      document.body.style.overflow = 'auto'
    }

    const runReveal = () => {
      tl = gsap.timeline({ onComplete: finish })
      tl.to(typoRef.current, {
        top: isMobile ? '20%' : '45%',
        duration: 1.5,
        ease: 'power3.inOut',
      })
        .to(imgRef.current, { y: 0, duration: 1.5, ease: 'power3.out' }, '<')
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
        gsap.set(typoRef.current, { top: isMobile ? '20%' : '45%' })
        gsap.set(imgRef.current, { y: 0 })
        gsap.set([subtitleRef.current, ctaRef.current], { opacity: 1, y: 0 })
        finish()
        return
      }
      timers.push(setTimeout(runScramble, 1000))
    }

    // Preload the portrait so it never pops in mid-animation
    const img = new Image()
    img.src = HERO_IMAGE
    if (img.complete) start()
    else {
      img.onload = start
      img.onerror = start
    }

    return () => {
      img.onload = null
      img.onerror = null
      timers.forEach(clearTimeout)
      tl?.kill()
      finish()
    }
  }, [])

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

      {/* Portrait */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
        <img
          ref={imgRef}
          src={HERO_IMAGE}
          alt={profile.fullName}
          className="w-[88vw] max-h-[88vh] object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] sm:w-[400px] md:w-[500px] xl:w-[600px]"
          draggable="false"
        />
      </div>

      {/* Subtitle — lower-left on desktop, below typography on mobile */}
      <p
        ref={subtitleRef}
        className="absolute z-30 text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.8)] left-1/2 top-[34%] -translate-x-1/2 whitespace-nowrap text-base sm:text-lg md:left-[6vw] md:top-auto md:bottom-[18vh] md:translate-x-0 md:text-3xl xl:text-4xl"
      >
        <span className="font-bold">{profile.role.bold}</span>{' '}
        <span className="font-serif font-light italic">{profile.role.italic}</span>
      </p>

      {/* CTAs — lower-right on desktop, under subtitle on mobile */}
      <div
        ref={ctaRef}
        className="absolute z-30 flex items-center gap-3 left-1/2 top-[40%] -translate-x-1/2 md:left-auto md:top-auto md:right-[6vw] md:bottom-[18vh] md:translate-x-0"
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
