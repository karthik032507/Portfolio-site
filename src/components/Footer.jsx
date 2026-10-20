import { profile } from '../data/profile'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#work' },
]

const GLOW_IMAGE = '/glow-bg.png' // optional — drop the generated image in /public to use it

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Cinematic background — image if present, CSS glow underneath as fallback */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 40% 100%, rgba(204,255,0,0.28) 0%, rgba(30,110,30,0.22) 30%, rgba(0,0,0,0) 65%)',
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${GLOW_IMAGE})`, backgroundSize: '140%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-8 pt-28 md:px-12 md:pt-36">
        {/* Top */}
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">Connect with me</p>
            <a
              href={`mailto:${profile.contact.email}`}
              className="break-all text-2xl font-semibold text-white transition-colors duration-300 hover:text-lime sm:text-3xl md:text-4xl"
            >
              {profile.contact.email}
            </a>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-zinc-400 transition-colors duration-300 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-right">
            <p className="text-2xl font-bold md:text-3xl">Let's build something</p>
            <p className="mt-2 text-sm text-zinc-400">{profile.availability}</p>
            <a
              href="#contact"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-lime"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Socials */}
        <ul className="mt-16 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6">
          {profile.socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 transition-colors duration-300 hover:text-lime"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Giant brand */}
        <p
          className="mt-auto select-none pt-16 text-center font-black uppercase leading-none tracking-[-0.06em] text-white text-[13vw] md:text-[12vw]"
          aria-hidden="true"
        >
          {profile.brand}
        </p>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col gap-2 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.fullName}. All rights reserved.</p>
          <p>
            Built with React, Tailwind & GSAP ·{' '}
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              Resume
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
