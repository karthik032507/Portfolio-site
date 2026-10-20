import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import CodingProfiles from './CodingProfiles'

gsap.registerPlugin(ScrollTrigger)

/** Renders [{ text, accent }] title parts: text in heavy caps, accent in light italic serif. */
function Title({ parts }) {
  return parts.map((p, i) => (
    <span key={i} className="block">
      {p.text}
      {p.accent && <span className="font-serif font-light lowercase italic text-zinc-400"> {p.accent}</span>}
    </span>
  ))
}

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-project]').forEach((row) => {
        const items = row.querySelectorAll('[data-reveal]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: row, start: 'top 80%' },
          },
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} className="overflow-hidden bg-ink px-6 pb-24 pt-20 text-white md:px-16">
      {/* Header */}
      <div className="mx-auto mb-20 flex max-w-[1400px] flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between">
        <h2 className="font-black uppercase leading-[0.9] tracking-[-0.04em] text-[2.4rem] sm:text-[3rem] md:text-[4.5rem] xl:text-[6rem]">
          <span className="metal-text">Selected</span>{' '}
          <span className="font-serif font-light lowercase italic tracking-normal text-zinc-400">work</span>
        </h2>
        <div className="max-w-[400px]">
          <p className="text-sm font-light leading-relaxed text-mist md:text-base">
            Things I've built end-to-end — from database schema to deployed URL. Each one taught me something I
            couldn't learn from a tutorial.
          </p>
          <a
            href={`https://github.com/${profile.socials.find((s) => s.name === 'GitHub').href.split('/').pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full border border-lime bg-lime px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors duration-300 hover:bg-[#b8e600]"
          >
            More on GitHub ↗
          </a>
        </div>
      </div>

      {/* Project list */}
      <div className="mx-auto flex max-w-[1400px] flex-col gap-24 md:gap-40">
        {projects.map((p, i) => {
          const reverse = i % 2 === 1
          return (
            <article
              key={i}
              data-project
              className={`group grid items-center gap-8 md:grid-cols-2 md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Image — on mobile the text wrapper is `contents`, so order-* puts this between title and description */}
              <div data-reveal className="order-3 overflow-hidden rounded-[4px] bg-zinc-900 md:order-none">
                <div className="aspect-[16/10]">
                  <img
                    src={p.image}
                    alt={`${p.title.map((t) => t.text + (t.accent ? ' ' + t.accent : '')).join(' ')} screenshot`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="contents md:block">
                <div data-reveal className="order-1 mb-4 flex items-center gap-3 md:order-none">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-lime">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.status === 'in-progress' && (
                    <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">
                      In progress
                    </span>
                  )}
                </div>
                <h3
                  data-reveal
                  className="order-2 mb-5 font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-[1.9rem] sm:text-[2.4rem] md:order-none md:text-[3rem] xl:text-[3.6rem]"
                >
                  <Title parts={p.title} />
                </h3>
                <p data-reveal className="order-4 mb-6 max-w-[500px] text-sm font-light leading-[1.7] text-mist md:order-none md:text-base">
                  {p.description}
                </p>
                {p.tech?.length > 0 && (
                  <ul data-reveal className="order-5 mb-8 flex flex-wrap gap-2 md:order-none">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div data-reveal className="order-6 flex flex-wrap gap-2 md:order-none">
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
            </article>
          )
        })}
      </div>

      <CodingProfiles />
    </section>
  )
}

export function GitHubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}
