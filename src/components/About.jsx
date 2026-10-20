import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import SkillsMarquee from './SkillsMarquee'

gsap.registerPlugin(ScrollTrigger)

const ABOUT_IMAGE = '/about.png'

/** Splits the about paragraph into words, bolding any that appear in `highlights`. */
function buildWords(text, highlights) {
  const hl = highlights.map((h) => h.toLowerCase())
  return text.split(' ').map((word, i) => {
    const clean = word.replace(/[^\w.+#-]/g, '').toLowerCase()
    // allow multi-word highlights like "System Design" by checking the pair too
    const isHl = hl.includes(clean)
    return { word, isHl, key: i }
  })
}

export default function About() {
  const sectionRef = useRef(null)
  const headingDesktopRef = useRef(null)
  const headingMobileRef = useRef(null)
  const paraRef = useRef(null)

  const words = buildWords(profile.about, profile.highlights)
  // Multi-word highlights: mark both words of each phrase
  const phrases = profile.highlights.filter((h) => h.includes(' ')).map((h) => h.toLowerCase().split(' '))
  words.forEach((w, i) => {
    phrases.forEach((p) => {
      const slice = words.slice(i, i + p.length).map((x) => x.word.replace(/[^\w.+#-]/g, '').toLowerCase())
      if (slice.join(' ') === p.join(' ')) for (let k = 0; k < p.length; k++) words[i + k].isHl = true
    })
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading rises in, reverses on scroll-up
      ;[headingDesktopRef.current, headingMobileRef.current].forEach((el) => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        )
      })

      // Word-by-word reading reveal, scrubbed to scroll
      const wordEls = paraRef.current.querySelectorAll('[data-word]')
      gsap.fromTo(
        wordEls,
        { color: '#52525b', opacity: 0.2 },
        {
          color: '#ffffff',
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: paraRef.current,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: true,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const Heading = ({ innerRef, className }) => (
    <h2 ref={innerRef} className={`metal-text font-black uppercase leading-[0.85] tracking-[-0.05em] ${className}`}>
      Intro
    </h2>
  )

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
        {/* Mobile / tablet heading */}
        <Heading innerRef={headingMobileRef} className="mb-10 text-center text-[18vw] md:text-[8rem] lg:hidden" />

        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-16">
          {/* Portrait */}
          <div className="flex w-full justify-center lg:justify-start">
            <img
              src={ABOUT_IMAGE}
              alt={profile.fullName}
              className="w-[190px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] md:w-[220px] lg:w-[260px]"
              loading="lazy"
              draggable="false"
            />
          </div>

          <div>
            {/* Desktop heading */}
            <Heading innerRef={headingDesktopRef} className="mb-10 hidden text-[11rem] lg:block" />

            {/* Glass card */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.07] md:p-10">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-lime lg:text-left">
                {profile.education}
              </p>
              <p className="mb-5 text-center text-2xl font-bold text-white lg:text-left">
                Hey, I'm {profile.firstName}.
              </p>
              <p ref={paraRef} className="text-center text-base font-light leading-relaxed text-mist md:text-xl lg:text-left">
                {words.map(({ word, isHl, key }) => (
                  <span key={key}>
                    <span data-word className={isHl ? 'font-semibold' : ''}>
                      {word}
                    </span>{' '}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SkillsMarquee />
    </section>
  )
}
