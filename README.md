# JRL Academic Website

A modern, minimalist academic website with an iridescent/holographic theme, designed for research communication and public outreach.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Features

- Markdown-based blog with tag filtering
- Team member profiles with image galleries
- Video repository
- PDF downloads for CV and reports
- Responsive design
- Iridescent/holographic theme

## RA SOP: start-to-finish task workflow

@LukeNeilsonSkywalker1 this is your quick handy tips list for self-contained tasks.

1. Update local `main`: `git checkout main && git pull origin main`.
2. Create a task branch: `git checkout -b feature/<short-task-name>`.
3. For a new team bio, add `content/team/<slug>.md`.
4. Bio format: line 1 `# Name`, line 2 `## Role: [Google Scholar](url)`, then bio text.
5. Keep the task self-contained (only files needed for that task).
6. Preview locally: `npm run dev`, then check `/team`.
7. Commit clearly: `git add ... && git commit -m "Add bio for <name>"`.
8. Push branch: `git push -u origin feature/<short-task-name>`.
9. Open a PR to `main`.
10. Copilot review runs automatically; fix comments if needed.
11. One human approval is required (John).
12. New pushes to the PR can require re-approval.
13. Luke can push branches and open PRs, but not bypass `main` rules.
14. Use Copilot for plain-English help with wording or commands.

See documentation in the README for full details.
