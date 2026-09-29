# CLAUDE.md

Read README.md first. Two versions live here: the Next.js app at the root (qremoji.cc on Vercel) and the plain static copy in `docs/` (gh.qremoji.cc on GitHub Pages).

## Cloud sessions

For Claude Code on the web (claude.ai/code). `scripts/cloud-setup.sh` runs automatically at session start (`npm ci`).

- Check: `npm run check` (`tsc --noEmit && eslint && next build`). `docs/` has no build; open its `index.html` to review.
- Work on the session's branch and open a PR. Merging to `main` deploys qremoji.cc on Vercel and `docs/` on GitHub Pages, so never push `main`.
- Never run the `vercel` CLI (`vercel`, `vercel --prod`, `vercel deploy`).
- No secrets are available or needed. Keep changes small and in the site's voice.
