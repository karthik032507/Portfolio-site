import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'

const links = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Journey', href: '#journey', id: 'journey' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

/**
 * Floating glass nav. A lime pill slides behind the link of the section
 * currently in view. The whole bar hides on scroll-down and returns on
 * scroll-up so it never sits over content while reading.
 */
export default function Nav() {
  const [active, setActive] = useState('home')
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const listRef = useRef(null)
  const pillRef = useRef(null)

  // Hide / show on scroll direction
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 120 && !open)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  // Track the section in view
  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Slide the pill under the active link
  useEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return
    const el = list.querySelector(`[data-id="${active}"]`)
    if (!el) return
    gsap.to(pill, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: 0.5,
      ease: 'power3.out',
      opacity: 1,
    })
  }, [active])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10" aria-label="Primary">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-2.5 text-sm font-black tracking-[0.2em] text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
          </span>
          {profile.firstName.toUpperCase()}
        </a>

        {/* Desktop links in a glass capsule */}
        <ul
          ref={listRef}
          className={`relative hidden items-center rounded-full border p-1 backdrop-blur-xl transition-colors duration-300 md:flex ${
            scrolled ? 'border-white/10 bg-black/60' : 'border-white/5 bg-white/[0.03]'
          }`}
        >
          <span
            ref={pillRef}
            className="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-lime opacity-0"
            aria-hidden="true"
          />
          {links.map((l) => (
            <li key={l.id} className="relative">
              <a
                href={l.href}
                data-id={l.id}
                className={`relative z-10 block rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                  active === l.id ? 'text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Resume CTA */}
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="group hidden items-center gap-2 rounded-full border border-white/15 bg-black/40 py-1.5 pl-4 pr-1.5 text-[13px] font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-lime/60 md:flex"
        >
          Resume
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-black transition-transform duration-300 group-hover:rotate-45">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </span>
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`mx-5 overflow-hidden rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? 'max-h-[420px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-2">
          {links.map((l, i) => (
            <li key={l.id}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                  active === l.id ? 'bg-lime text-black' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {l.label}
                <span className="text-xs opacity-50">0{i + 1}</span>
              </a>
            </li>
          ))}
          <li className="mt-1 border-t border-white/10 pt-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-lime"
            >
              Resume <span>↗</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
