// ─────────────────────────────────────────────────────────────
//  YOUR PROFILE — edit anything here and the whole site updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  // Giant word shown in the hero (scrambles into "PORTFOLIO") and the footer
  brand: 'KARTHIKEYA',
  fullName: 'Karthikeya Mothukuri',
  firstName: 'Karthikeya',

  // Hero subtitle → "Software" bold, "Developer" light italic
  role: { bold: 'Software', italic: 'Developer' },

  education: 'B.Tech @ IIIT Sri City · Class of 2028',

  // About card. Words listed in `highlights` are rendered bright white + bold.
  about:
    "A B.Tech student at IIIT Sri City who loves building scalable, real-world web apps that people actually use. I work mostly with React, Node.js, Express and MongoDB, and I care about clean architecture, secure APIs and code that holds up in production. Right now I'm sharpening my problem-solving through DSA, learning System Design, and gearing up to dive into GenAI.",
  highlights: ['scalable', 'React', 'Node.js', 'Express', 'MongoDB', 'DSA', 'System Design', 'GenAI'],

  // "Right now" chips under the About paragraph
  now: [
    { tag: 'Grinding', text: 'DSA' },
    { tag: 'Learning', text: 'System Design' },
    { tag: 'Next up', text: 'GenAI' },
    { tag: 'Open to', text: 'Internships 2026–27' },
  ],

  // Put your PDF at public/resume.pdf — replace the file any time, nothing else to change.
  resume: '/resume.pdf',

  contact: {
    email: 'karthikeya0325@gmail.com',
    phone: '+91 91006 81956',
    phoneHref: 'tel:+919100681956',
  },

  socials: [
    { name: 'GitHub', href: 'https://github.com/karthik032507' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/karthikeya-mothukuri-a764ab349' },
    { name: 'LeetCode', href: 'https://leetcode.com/u/karthikeya_25/' },
    { name: 'Instagram', href: 'https://instagram.com/karthikk__25' },
  ],

  // Shown in the footer/contact: short status line recruiters like to see
  availability: 'Open to internships · 2026–27',
}
