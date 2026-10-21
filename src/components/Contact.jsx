import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import { SocialIcon } from './SocialIcon'

gsap.registerPlugin(ScrollTrigger)

const fields = [
  { name: 'name', label: 'Your Name', placeholder: 'Your full name', type: 'text', required: true },
  { name: 'email', label: 'Email address', placeholder: 'Your email address', type: 'email', required: true },
  { name: 'phone', label: 'Phone', placeholder: 'Your phone number', type: 'tel' },
  { name: 'subject', label: 'Subject', placeholder: 'Subject', type: 'text' },
]

/**
 * Contact section. The form composes a mailto: link so it needs zero backend.
 * To switch to Formspree later: replace the `action` in handleSubmit with a
 * fetch POST to your Formspree endpoint — nothing else needs to change.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-stagger]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = encodeURIComponent(f.get('subject') || `Portfolio message from ${f.get('name')}`)
    const body = encodeURIComponent(
      `${f.get('message')}\n\n— ${f.get('name')}\n${f.get('email')}${f.get('phone') ? `\n${f.get('phone')}` : ''}`,
    )
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      {/* Subtle green horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 45% 110%, rgba(204,255,0,0.22) 0%, rgba(40,120,30,0.18) 35%, rgba(5,5,5,0) 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 md:px-12 lg:grid-cols-[2fr_3fr] lg:gap-24">
        {/* Left */}
        <div>
          <h2
            data-stagger
            className="metal-text mb-12 font-black uppercase leading-[0.9] tracking-[-0.04em] text-[3rem] sm:text-[4rem] md:text-[5.5rem]"
          >
            Get in
            <br />
            touch
          </h2>

          <div className="space-y-8">
            <div data-stagger>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Email</p>
              <a href={`mailto:${profile.contact.email}`} className="text-lg tracking-wide text-white transition-colors hover:text-lime md:text-xl">
                {profile.contact.email}
              </a>
            </div>
            {profile.contact.phone && (
              <div data-stagger>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Phone</p>
                <a href={profile.contact.phoneHref} className="text-lg tracking-wide text-white transition-colors hover:text-lime md:text-xl">
                  {profile.contact.phone}
                </a>
              </div>
            )}
            <div data-stagger>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Find me on</p>
              <ul className="flex gap-3">
                {profile.socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      title={s.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-lime/60 hover:shadow-[0_0_24px_rgba(204,255,0,0.25)]"
                    >
                      <SocialIcon name={s.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p
              data-stagger
              className="inline-flex items-center gap-2.5 rounded-full border border-lime/30 bg-lime/[0.06] px-4 py-2 text-xs font-medium text-zinc-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              {profile.availability}
            </p>
          </div>
        </div>

        {/* Right — form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.name} data-stagger className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="w-full rounded-[10px] border border-white/5 bg-[#111] px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-lime/40 focus:shadow-[0_0_0_3px_rgba(204,255,0,0.08)]"
                />
              </label>
            ))}
          </div>
          <label data-stagger className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Message</span>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Write something...."
              className="w-full resize-y rounded-[10px] border border-white/5 bg-[#111] px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-lime/40 focus:shadow-[0_0_0_3px_rgba(204,255,0,0.08)]"
            />
          </label>
          <button
            data-stagger
            type="submit"
            className="w-full rounded-[10px] bg-white py-4 font-semibold text-black transition-colors duration-300 hover:bg-zinc-200"
          >
            Send Message
          </button>
          {status === 'sent' && (
            <p className="text-center text-sm text-lime">Your mail app should open with the message ready to send.</p>
          )}
        </form>
      </div>
    </section>
  )
}
