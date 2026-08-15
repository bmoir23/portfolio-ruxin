## Learned User Preferences

- Keep Cal.com booking; do not remove it when replacing Craft/project content.
- The Craft section should be named Projects and used as a work showcase; the user supplies GitHub repo links for those examples.
- Remove the sound toggle and all app audio entirely.
- Start or restart the local preview when asked so changes can be checked in the browser.
- The home-page CV/Resume control should open the current resume (Google Doc / PDF export).
- Put the GitHub contribution calendar on the home page; keep the grid dense, non-scrolling, and responsive on phone and desktop.
- Keep Next.js on the latest release when upgrading the site.

## Learned Workspace Facts

- This repo is Brian Moir’s portfolio, rebranded from the Ruixen template.
- Live/content source of record is https://portfolio.brianmoir.dev.
- The site lives in `apps/website` (pnpm/turbo monorepo, Next.js, shadcn, Tailwind).
- Local website dev server is `next dev -p 6969`.
- Identity and socials live in `apps/website/config/user.ts` (GitHub `bmoir23`).
- GitHub contribution calendar is `apps/website/components/ui/retro-space-shooter-git-hub-calendar.tsx`.
- Ignore `.pnpm-store` and `.cursor/hooks/state/`; do not commit pnpm cache or Cursor hook state.
