import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '../data/journey'

gsap.registerPlugin(ScrollTrigger)

/**
 * "MY JOURNEY" accordion. Each row turns lime on hover (desktop) and
 * expands on click. Only one row is open at a time.
 */
export default function Journey() {
  const [open, setOpen] = useState(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" className="overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <h2
          ref={headingRef}
          className="metal-text mb-12 text-right font-black uppercase leading-[0.9] tracking-[-0.04em] text-[2.6rem] sm:text-[4rem] md:text-[7rem] xl:text-[8rem]"
        >
          My
          <br />
          Journey
        </h2>
      </div>

      <ul className="border-t border-white/15">
        {journey.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={item.title} className="group border-b border-white/15">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`w-full text-left transition-colors duration-300 ${
                  isOpen ? 'bg-lime text-black' : 'bg-transparent text-white md:hover:bg-lime md:hover:text-black'
                }`}
              >
                <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-6 md:gap-10 md:px-12 md:py-8">
                  <span className="w-8 shrink-0 text-sm font-semibold tabular-nums opacity-60 md:w-12 md:text-base">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-extrabold uppercase tracking-tight sm:text-2xl md:text-4xl">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-[0.2em] opacity-60 md:text-sm">
                      {item.org} · {item.period}
                    </span>
                  </span>
                  <Arrow open={isOpen} />
                </div>

                {/* Expandable body */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="mx-auto grid max-w-[1400px] gap-8 px-6 pb-10 pl-[4.5rem] md:grid-cols-2 md:px-12 md:pb-12 md:pl-[8.5rem]">
                      {item.points?.length > 0 && (
                        <ul className="space-y-2.5">
                          {item.points.map((p) => (
                            <li key={p} className="flex gap-3 text-sm font-light leading-relaxed md:text-base">
                              <span className={`mt-[0.55em] h-1.5 w-1.5 shrink-0 ${isOpen ? 'bg-black' : 'bg-lime'}`} />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div>
                        <p className="text-sm font-light leading-relaxed md:text-base">{item.description}</p>
                        {item.cta && (
                          <a
                            href={item.cta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="relative mt-6 inline-block border border-black bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-lime transition-colors duration-300 hover:bg-zinc-900"
                          >
                            <Corner className="-left-1 -top-1" />
                            <Corner className="-right-1 -top-1" />
                            <Corner className="-bottom-1 -left-1" />
                            <Corner className="-bottom-1 -right-1" />
                            {item.cta.label} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Arrow({ open }) {
  return (
    <svg
      className={`h-6 w-6 shrink-0 transition-transform duration-300 md:h-10 md:w-10 ${open ? '-rotate-45' : 'rotate-0'}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function Corner({ className }) {
  return <span className={`absolute h-2 w-2 border border-lime ${className}`} aria-hidden="true" />
}
