import { useEffect, useState } from 'react'
import { codingProfiles } from '../data/codingProfiles'

// Public, CORS-enabled mirror of LeetCode's GraphQL stats. If it ever goes down the
// card simply falls back to the static "200+ problems solved" line.
const LEETCODE_API = (user) => `https://alfa-leetcode-api.onrender.com/${user}/solved`

function useLeetCode(username) {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    if (!username) return
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch(LEETCODE_API(username))
        const d = await r.json()
        if (!cancelled && d.solvedProblem != null) {
          setStats({ solved: d.solvedProblem, easy: d.easySolved, medium: d.mediumSolved, hard: d.hardSolved })
        }
      } catch {
        /* leave stats null → plain link card */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [username])
  return stats
}

export default function CodingProfiles() {
  const lc = codingProfiles.find((p) => p.live === 'leetcode')
  const stats = useLeetCode(lc?.username)

  return (
    <div className="mx-auto mt-28 max-w-[1400px] md:mt-40">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-mist">Coding profiles</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {codingProfiles.map((p) => {
          const isLc = p.live === 'leetcode'
          return (
            <li key={p.name}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-lime/50 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold">{p.name}</p>
                    <p className="text-sm text-mist">@{p.username}</p>
                  </div>
                  <span className="text-lime transition-transform duration-300 group-hover:rotate-45">↗</span>
                </div>
                {isLc && stats && (
                  <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
                    <Stat label="Solved" value={stats.solved} big />
                    <Stat label="Easy" value={stats.easy} />
                    <Stat label="Medium" value={stats.medium} />
                    <Stat label="Hard" value={stats.hard} />
                  </div>
                )}
                {isLc && !stats && <p className="mt-6 text-sm text-zinc-500">200+ problems solved</p>}
                {!isLc && <p className="mt-6 text-sm text-zinc-500">DSA practice & progress tracking</p>}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Stat({ label, value, big }) {
  return (
    <div>
      <p className={`font-black leading-none ${big ? 'text-4xl text-lime' : 'text-xl text-white'}`}>{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">{label}</p>
    </div>
  )
}
