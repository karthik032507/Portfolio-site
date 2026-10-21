# How to update your portfolio

Everything you'll ever change lives in two places:

```
src/data/        ← all your text content (one file per section)
public/          ← your files: resume, photos, project screenshots
```

You never need to touch `src/components/`. After any change: save → `git add .` → `git commit -m "..."` → `git push`. If the site is on Vercel it redeploys itself in about a minute.

To preview locally first: `npm run dev` and open the URL it prints.

---

## Add a project

Open `src/data/projects.js`, copy one block and fill it in. Newest projects go at the top.

```js
{
  title: [{ text: 'SMART', accent: 'notes' }],   // accent = the italic serif word (optional)
  description: 'One or two lines on what it does and what it is built with.',
  tech: ['React', 'FastAPI', 'PostgreSQL'],
  image: '/projects/smart-notes.png',           // put the screenshot in public/projects/
  live: 'https://...',                           // delete this line if there is no live link
  github: 'https://github.com/karthik032507/...',
  status: 'in-progress',                        // or 'completed' — shows a small tag
},
```

Screenshot tip: take it at roughly 1600×1000 so it fits the 16:10 frame without cropping oddly.

For a multi-line title use two parts:
```js
title: [{ text: 'JARVIS', accent: 'ai' }, { text: 'DESKTOP ASSISTANT' }],
```

## Add a skill

Open `src/data/skills.js` and add the name to the right row's `items` array. To add a new row, add another `{ label, items }` object — ticker direction alternates automatically.

## Update your resume

Replace `public/resume.pdf` with the new file. Keep the same name. Push. Done.

## Add to My Journey

Open `src/data/journey.js` and copy a block. `points` (bullet list) and `cta` (button) are optional.

## Change contact info, bio, role, socials

All in `src/data/profile.js`. The `highlights` array controls which words in your About paragraph are bold.

## Change your photo

- `public/about.png` — the portrait card in the Intro section (a waist-up photo with the background removed works best)

To remove a background from any photo, upload it to remove.bg and save the result over `public/about.png`.

## Coding profiles

`src/data/codingProfiles.js`. LeetCode stats are fetched live from your public profile, so they update themselves.

## Make the contact form deliver to your inbox (optional)

Right now the form opens the visitor's mail app. To receive messages directly:
1. Create a free form at https://formspree.io and copy its endpoint URL.
2. In `src/components/Contact.jsx`, inside `handleSubmit`, replace the `window.location.href = ...` line with a `fetch(ENDPOINT, { method: 'POST', body: f })` call. That's the only change needed.
