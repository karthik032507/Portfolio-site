import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import CodingProfiles from './CodingProfiles'

/** Renders [{ text, accent }] title parts: text in heavy caps, accent in light italic serif. */
function Title({ parts }) {
  return parts.map((p, i) => (
    <span key={i} className="block">
      {p.text}
      {p.accent && <span className="font-serif font-light lowercase italic text-zinc-400"> {p.accent}</span>}
    </span>
  ))
}

const pad = (n) => String(n).padStart(2, '0')

/**
 * Selected Work: one rectangular card at a time with prev / next arrows.
 * Changing project slides the card out, swaps the content, and slides the new one in.
 * Also works with the keyboard arrows and with swipes on touch screens.
 */
export default function Projects() {
  const [index, setIndex] = useState(0)
  const contentRef = useRef(null)
  const busy = useRef(false)
  const dir = useRef(1)
  const first = useRef(true)
  const touchX = useRef(null)
  const reduced = useRef(false)

  const total = projects.length
  const p = projects[index]
  const githubHandle = profile.socials.find((s) => s.name === 'GitHub').href.split('/').pop()

  // Slide the new content in after each index change (not on first paint)
  useLayoutEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (first.current) {
      first.current = false
      return
    }
    const el = contentRef.current
    if (reduced.current) {
      gsap.set(el, { clearProps: 'all' })
      busy.current = false
      return
    }
    gsap.fromTo(
      el,
      { x: dir.current * 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', onComplete: () => { busy.current = false } },
    )
  }, [index])

  const go = (step) => {
    if (busy.current || total < 2) return
    busy.current = true
    dir.current = step
    const next = (index + step + total) % total
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIndex(next)
      return
    }
    gsap.to(contentRef.current, {
      x: -step * 80,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => setIndex(next),
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  return (
    <section id="work" className="overflow-hidden bg-ink px-6 pb-24 pt-20 text-white md:px-16">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-[1200px] md:mb-16">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-black uppercase leading-[0.9] tracking-[-0.04em] text-[2.4rem] sm:text-[3rem] md:text-[4.5rem] xl:text-[6rem]">
            <span className="metal-text">Selected</span>{' '}
            <span className="font-serif font-light lowercase italic tracking-normal text-zinc-400">work</span>
          </h2>
          <a
            href={`https://github.com/${githubHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 shrink-0 rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300 transition-colors duration-300 hover:border-lime hover:text-lime md:mb-3"
          >
            All on GitHub ↗
          </a>
        </div>
        <p className="mt-5 max-w-[460px] text-sm font-light leading-relaxed text-zinc-400 md:mt-6 md:text-base">
          Built end-to-end, from database schema to deployed URL.
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative mx-auto max-w-[1200px] outline-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div ref={contentRef} className="grid will-change-transform md:grid-cols-[1.15fr_1fr]" aria-live="polite">
            {/* Image */}
            <div className="group relative aspect-[16/10] overflow-hidden bg-zinc-900 md:aspect-auto md:min-h-[460px]">
              <img
                key={p.image}
                src={p.image}
                alt={`${p.title.map((t) => t.text + (t.accent ? ' ' + t.accent : '')).join(' ')} screenshot`}
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover object-[15%_center] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold tracking-[0.25em] text-lime backdrop-blur-md">
                  {pad(index + 1)}
                </span>
                {p.status === 'in-progress' && (
                  <span className="flex items-center gap-1.5 rounded-full border border-lime/40 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-lime backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
                    Building
                  </span>
                )}
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h3 className="mb-4 pr-24 font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-[1.9rem] md:pr-0 md:text-[2.6rem]">
                <Title parts={p.title} />
              </h3>
              <p className="mb-5 text-sm font-light leading-[1.7] text-mist md:text-[0.95rem]">{p.description}</p>
              {p.tech?.length > 0 && (
                <ul className="mb-7 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-300">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-lime bg-lime px-6 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-[#b8e600]"
                  >
                    Live Demo ↗
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black"
                  >
                    GitHub <GitHubIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side arrows — frosted glass, centred on the card's left and right edges */}
        {total > 1 && (
          <>
            <ArrowButton label="Previous project" onClick={() => go(-1)} flip className="left-2 md:-left-7" />
            <ArrowButton label="Next project" onClick={() => go(1)} className="right-2 md:-right-7" />
          </>
        )}

        {/* Phones only: a second pair beside the title. Positioned from the card's top: image height
            (card width = 100vw − 3rem, 16:10 → ×0.625) + the card's 1.25rem padding. */}
        {total > 1 && (
          <div className="absolute right-5 top-[calc((100vw_-_3rem)_*_0.625_+_1.25rem)] z-20 flex gap-2 md:hidden">
            <MiniArrow label="Previous project" onClick={() => go(-1)} flip />
            <MiniArrow label="Next project" onClick={() => go(1)} />
          </div>
        )}

        {/* Counter + dots */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="font-mono text-xs tabular-nums text-mist">
              <span className="text-lime">{pad(index + 1)}</span> / {pad(total)}
            </span>
            <ul className="flex gap-1.5" aria-hidden="true">
              {projects.map((_, i) => (
                <li
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-lime' : 'w-3 bg-white/20'}`}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <CodingProfiles />
    </section>
  )
}

/**
 * Glass arrow. On mobile it sits inside the card edge, level with the middle of the image
 * (card width = 100vw − 3rem, image is 16:10). From md up it straddles the card's edge,
 * vertically centred.
 */
function ArrowButton({ label, onClick, flip, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-[calc((100vw_-_3rem)_*_0.3125)] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:border-lime/70 hover:bg-lime hover:text-black active:scale-95 md:top-1/2 md:h-14 md:w-14 ${className}`}
    >
      <svg
        className={`h-4 w-4 md:h-5 md:w-5 ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}

/** Compact outlined arrow for the title row on phones. */
function MiniArrow({ label, onClick, flip }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-lime hover:bg-lime hover:text-black active:scale-95"
    >
      <svg
        className={`h-4 w-4 ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}

export function GitHubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}
