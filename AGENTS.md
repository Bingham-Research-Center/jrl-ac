# Agent instructions for this repository

This is the canonical instructions file for AI coding agents in this repo.

`.github/copilot-instructions.md` points here to avoid duplicated guidance.

## Build, test, and lint commands

- Install dependencies: `npm install`
- Run local dev server (auto-reload): `npm run dev`
- Run production server: `npm start`
- Test command currently configured: `npm test` (placeholder script that exits with code `1`)
- Single-test command: not available yet because no test runner is configured
- Build command: none configured
- Lint command: none configured

## High-level architecture

- Entry point is `server.js` (Express + ESM). It configures Helmet CSP, compression, static assets (`public/`), EJS views (`views/`), and mounts:
  - `/blog` → `src/routes/blog.js`
  - `/team` → `src/routes/team.js`
  - `/videos` → `src/routes/videos.js`
  - `/pdfs` → `src/routes/pdfs.js`
- Rendering is server-side EJS. `views/partials/header.ejs` loads `/css/<%= page %>.css`, so each route should pass `page` matching an existing CSS filename.
- Data/content is file-backed:
  - Blog posts: `content/posts/*.md`
  - Team bios: `content/team/*.md`
  - Video metadata: `content/videos-meta.json`
  - PDF metadata: `content/pdfs-meta.json`
  - Publications: `content/publications/publications-<member-slug>.md`
- Client scripts:
  - `public/js/main.js`: mobile nav, blog expand/collapse, smooth scroll, theme toggle
  - `public/js/publications.js`: publications panel expand/collapse

## Key conventions

- Blog markdown format parsed by `src/utils/markdown.js`:
  - Line 1: `# <title>`
  - Line 2: `## <author>`
  - Line 3: `#### TAG: <tag>`
  - Remaining lines: markdown body
- Blog slug is filename-based. `/blog/post/:slug` resolves `content/posts/<slug>.md`.
- Blog filter tags are fixed in `src/routes/blog.js`: `ALL`, `LOCAL`, `USA`, `WORLD`, `TEAM`, `FUN`.
- Team slug is filename-based (`content/team/<slug>.md`), and image paths follow:
  - `/images/team/<slug>-action.jpg`
  - `/images/team/<slug>-headshot.jpg`
  - `/images/team/<slug>-passion.jpg`
- Publications in resources use member slug lookups in `src/routes/pdfs.js` (`getPublicationsForMember(member.slug)`) with a currently hardcoded team member list in that route.
- Publications markdown parser in `src/services/publications.js` expects section headers (`Recent`, `Featured`, `All`) and metadata labels (`Authors:`, `Journal:`, `Year:`).
- Several routes/services intentionally fall back to sample/default data when source files are missing (`videos`, `pdfs`, `publications`).
