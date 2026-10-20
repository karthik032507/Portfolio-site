import { skillRows } from '../data/skills'

/**
 * Full-width skills ticker. Each row's items are rendered twice inside a track
 * that translates by exactly 50%, so the loop is seamless. Odd rows scroll
 * right, even rows scroll left.
 */
export default function SkillsMarquee() {
  return (
    <div className="border-t border-white/5 bg-ink-2 py-6" aria-label="Skills">
      {skillRows.map((row, i) => {
        const dir = i % 2 === 0 ? 'marquee-right' : 'marquee-left'
        // Longer rows scroll a touch slower so every row feels the same speed
        const duration = `${28 + row.items.length * 2.5}s`
        return (
          <div key={row.label} className="overflow-hidden py-2" aria-label={row.label}>
            <div className={`flex w-max ${dir}`} style={{ '--marquee-duration': duration }}>
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                  <li className="mx-6 text-sm font-semibold uppercase tracking-[0.3em] text-lime/80 md:text-base">
                    {row.label}
                  </li>
                  {row.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center text-sm font-medium tracking-[0.15em] text-zinc-400 md:text-lg"
                    >
                      <span className="mx-5 text-zinc-700">·</span>
                      {item}
                    </li>
                  ))}
                  <li className="mx-5 text-zinc-700">·</li>
                </ul>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
