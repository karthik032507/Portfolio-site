import { useEffect, useState } from 'react'

/** Terminal-style line that types, holds, deletes and cycles through `lines`. */
export default function TypedLine({ lines, prefix = '$ ', className = '' }) {
  const [text, setText] = useState('')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setText(lines[0])
      return
    }
    let i = 0, pos = 0, deleting = false, t
    const step = () => {
      const full = lines[i]
      if (!deleting) {
        pos++
        setText(full.slice(0, pos))
        if (pos === full.length) {
          deleting = true
          t = setTimeout(step, 1800)
          return
        }
        t = setTimeout(step, 38 + Math.random() * 40)
      } else {
        pos--
        setText(full.slice(0, pos))
        if (pos === 0) {
          deleting = false
          i = (i + 1) % lines.length
          t = setTimeout(step, 350)
          return
        }
        t = setTimeout(step, 18)
      }
    }
    t = setTimeout(step, 600)
    return () => clearTimeout(t)
  }, [lines])

  return (
    <p className={`font-mono ${className}`} aria-live="polite">
      <span className="text-lime">{prefix}</span>
      <span className="text-zinc-300">{text}</span>
      <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-lime" aria-hidden="true" />
    </p>
  )
}
