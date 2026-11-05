# Moz Live Coding

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Web Components · Supabase · Storybook.

The rules every change follows are in [CLAUDE.md](CLAUDE.md).

- **Live:** https://moz-live-coding.vercel.app (every push to `main` deploys)
- **Docs:** `npm run storybook` → http://localhost:6006

## Run it locally

```bash
git clone https://github.com/iziuqo/moz-live-coding.git
cd moz-live-coding
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                   | What it does                         |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start the app with hot reload        |
| `npm run build`           | Production build (also type-checks)  |
| `npm run lint`            | ESLint                               |
| `npm run storybook`       | Component docs on port 6006          |
| `npm run build-storybook` | Static docs build in `storybook-static/` |

## Project layout

```
src/
  app/         Routes, layouts and global styles (Next.js App Router)
  elements/    Framework-agnostic web components (<moz-*> tags)
  components/  React-only wiring (e.g. registering the elements)
  docs/        Storybook pages written in MDX
.storybook/  Storybook config (loads the app's global styles)
```

## Environment

See [`.env.example`](.env.example). Only `NEXT_PUBLIC_*` values reach the browser;
`OPENAI_API_KEY` stays on the server.
