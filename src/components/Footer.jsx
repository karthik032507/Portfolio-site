import { profile } from '../data/profile'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const YEAR = new Date().getFullYear()

/**
 * Sign-off footer. Contact details live in the Contact section above, so this
 * stays minimal: quick links, back-to-top, the giant name, and the legal line.
 */
export default function Footer() {
  return (
    <footer className="relative flex min-h-[70vh] flex-col overflow-hidden bg-black text-white">
      {/* Cinematic green horizon glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 45% 105%, rgba(204,255,0,0.3) 0%, rgba(30,110,30,0.22) 32%, rgba(0,0,0,0) 68%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-8 pt-16 md:px-12 md:pt-20">
        {/* Top row */}
        <div className="flex flex-col items-center gap-8 border-b border-white/10 pb-8">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-lime">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#home"
            className="group flex w-fit items-center gap-3 rounded-full border border-white/15 py-2 pl-5 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:border-lime/60"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-black transition-transform duration-300 group-hover:-translate-y-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </a>
        </div>

        {/* Giant brand */}
        <p
          className="mt-auto select-none pt-16 text-center font-black uppercase leading-none tracking-[-0.06em] text-white text-[13vw] md:text-[12vw]"
          aria-hidden="true"
        >
          {profile.brand}
        </p>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col gap-2 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} {profile.fullName}. All rights reserved.</p>
          <p>Designed &amp; built by me with React, Tailwind &amp; GSAP</p>
        </div>
      </div>
    </footer>
  )
}
