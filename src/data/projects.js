// ─────────────────────────────────────────────────────────────
//  PROJECTS — order here = order on the site. To add one: copy a block, fill it in,
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
  {
    title: [{ text: 'INKWELL', accent: 'books' }],
    description:
      'A full-stack online bookstore with a searchable catalog, persistent cart, wishlist and purchase-gated reviews. Checkout reserves stock atomically to prevent overselling, and an admin dashboard tracks revenue, top sellers and low stock, with Open Library auto-fill for adding new books.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Zod', 'Vercel'],
    image: '/projects/inkwell-books.svg',
    live: 'https://inkwell-books-six.vercel.app/',
    github: 'https://github.com/karthik032507/Book-store-project',
    status: 'completed',
  },
  {
    title: [{ text: 'FLASH', accent: 'sale' }, { text: 'TICKET PLATFORM' }],
    description:
      'A flash-sale ticket booking platform for events, designed to stay fair and stable when a crowd hits "buy" at the same second. Built on the MERN stack around role-based access control, API rate limiting and a waiting queue so buyers compete for limited seats without overselling.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'RBAC', 'Rate Limiting', 'Queueing'],
    image: '/projects/flash-tickets.svg',
    github: 'https://github.com/karthik032507/Event-tickets-sale',
    status: 'in-progress',
  },
]
