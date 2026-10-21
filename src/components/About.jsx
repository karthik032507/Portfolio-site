import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import SkillsMarquee from './SkillsMarquee'
import TiltPortrait from './TiltPortrait'

gsap.registerPlugin(ScrollTrigger)

const ABOUT_IMAGE = '/about.png'

/** Splits the about paragraph into words, flagging any that appear in `highlights`. */
function buildWords(text, highlights) {
  const hl = highlights.map((h) => h.toLowerCase())
  const words = text.split(' ').map((word, i) => {
    const clean = word.replace(/[^\w.+#-]/g, '').toLowerCase()
    return { word, isHl: hl.includes(clean), key: i }
  })
  const phrases = highlights.filter((h) => h.includes(' ')).map((h) => h.toLowerCase().split(' '))
  words.forEach((w, i) => {
    phrases.forEach((p) => {
      const slice = words.slice(i, i + p.length).map((x) => x.word.replace(/[^\w.+#-]/g, '').toLowerCase())
      if (slice.join(' ') === p.join(' ')) for (let k = 0; k < p.length; k++) words[i + k].isHl = true
    })
  })
  return words
}

export default function About() {
  const sectionRef = useRef(null)
  const headingDesktopRef = useRef(null)
  const headingMobileRef = useRef(null)
  const paraRef = useRef(null)
  const words = buildWords(profile.about, profile.highlights)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ;[headingDesktopRef.current, headingMobileRef.current].forEach((el) => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } },
        )
      })

      // Word-by-word reveal; highlighted words land on lime, the rest on white
      gsap.fromTo(
        paraRef.current.querySelectorAll('[data-word]'),
        { color: '#3f3f46', opacity: 0.25 },
        {
          color: (i, el) => (el.dataset.hl ? '#ccff00' : '#ffffff'),
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: paraRef.current, start: 'top 85%', end: 'bottom 55%', scrub: true },
        },
      )

      gsap.fromTo(
        '[data-float]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '[data-float]', start: 'top 92%' } },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const Heading = ({ innerRef, className }) => (
    <div ref={innerRef} className={`relative z-10 ${className}`}>
      <span
        className="pointer-events-none absolute inset-0 translate-x-[0.06em] translate-y-[0.06em] select-none font-black uppercase leading-[0.85] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(204,255,0,0.4)]"
        aria-hidden="true"
      >
        Intro
      </span>
      <h2 className="metal-text relative font-black uppercase leading-[0.85] tracking-[-0.05em]">Intro</h2>
    </div>
  )

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden bg-ink text-white">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[560px] w-[560px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0) 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-60 bottom-0 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)' }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
        <Heading innerRef={headingMobileRef} className="mb-10 text-center text-[18vw] md:text-[8rem] lg:hidden" />

        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-[360px_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0">
          {/* Heading — right column, row 1 */}
          <Heading innerRef={headingDesktopRef} className="-mb-8 hidden text-[11rem] lg:col-start-2 lg:row-start-1 lg:block" />

          {/* Portrait — left column, stretches to the card's height */}
          <div className="relative h-[400px] w-[280px] md:h-[460px] md:w-[320px] lg:col-start-1 lg:row-start-2 lg:h-auto lg:w-full lg:self-stretch">
            <TiltPortrait
              src={ABOUT_IMAGE}
              alt={profile.fullName}
              caption={profile.fullName}
              subcaption={profile.availability}
              className="lg:absolute lg:inset-0"
            />
          </div>

          <div className="w-full lg:col-start-2 lg:row-start-2">
            <div className="relative h-full rounded-[28px] border border-white/10 bg-white/[0.04] p-7 pt-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-12 md:pt-14 lg:pt-20">
              <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-lime/70 to-transparent" aria-hidden="true" />

              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
                <p className="text-2xl font-bold text-white md:text-3xl">Hey, I'm {profile.firstName}.</p>
                <span className="hidden h-px w-10 bg-white/20 sm:block" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime">{profile.education}</p>
              </div>

              <p ref={paraRef} className="text-center text-lg font-light leading-[1.6] md:text-[1.55rem] lg:text-left">
                {words.map(({ word, isHl, key }) => (
                  <span key={key}>
                    <span data-word data-hl={isHl || undefined} className={isHl ? 'font-semibold' : ''}>{word}</span>{' '}
                  </span>
                ))}
              </p>

              <ul className="mt-9 flex flex-wrap justify-center gap-2 lg:justify-start">
                {profile.now.map((n) => (
                  <li
                    key={n.tag}
                    data-float
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 py-1.5 pl-2 pr-3.5 text-xs transition-colors hover:border-lime/50"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(204,255,0,0.9)]" />
                    <span className="uppercase tracking-[0.15em] text-zinc-500">{n.tag}</span>
                    <span className="font-semibold text-white">{n.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SkillsMarquee />
    </section>
  )
}

