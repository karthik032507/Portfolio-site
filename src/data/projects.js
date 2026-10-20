// ─────────────────────────────────────────────────────────────
//  PROJECTS — newest first. To add one: copy a block, fill it in,
//  drop the screenshot in public/projects/ and push.
//
//  title: use { text: 'PLACEMENT', accent: 'hub' } to render the accent
//         word in light italic serif (like "ai" in the reference design).
//  status: 'completed' | 'in-progress'
//  live / github: leave out either one if you don't have it.
// ─────────────────────────────────────────────────────────────

export const projects = [
  {
    title: [{ text: 'PLACEMENT', accent: 'hub' }],
    description:
      'A full-stack placement portal where students apply to campus drives with saved resumes and track their status in real time, while admins post companies, filter applicants by branch and CGPA, and move them through Applied → Shortlisted → Selected. Built on React, Express and MongoDB with JWT + role-based access for three user roles, and backed by 37 end-to-end API tests.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'RBAC', 'Vercel', 'Render'],
    image: '/projects/placementhub.png',
    live: 'https://placementhub-opal.vercel.app/',
    github: 'https://github.com/karthik032507/placementhub',
    status: 'completed',
  },
]
