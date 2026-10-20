import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

/** Slim fixed nav. Transparent over the hero, frosted once the page is scrolled. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12" aria-label="Primary">
        <a href="#home" className="text-sm font-black tracking-[0.2em] text-white">
          {profile.firstName.toUpperCase()}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-mist transition-colors duration-300 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white transition-all duration-300 hover:border-lime hover:text-lime"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/5 bg-ink/95 px-6 py-4 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-base text-mist hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="block py-2 text-base text-lime">
              Resume ↗
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
