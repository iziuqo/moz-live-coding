# Working rules for this repo

These rules apply to every change, by any person or agent.

## Code
- Lean, clean, DRY, SOLID, modular: the smallest change that does the job well.
- Fast, reliable and performant: no dependency without a clear payoff; animate
  only `opacity`/`transform`; features degrade gracefully without JavaScript.
- Self-explaining: clear names first, then a short doc comment on every
  exported function, component, element and token saying what it is for and why.
- TypeScript strict, no `any`. Keep each unit small and single-purpose.
- `npm run build`, `npm run lint` and `npm run build-storybook` must pass.

## Components
- Prefer framework-agnostic web components in `src/elements/` (`moz-*` tags):
  they work in any stack and ship no runtime. Each one has a `.ts` (behaviour),
  a `.css` (look), a `.stories.tsx` (docs) and is registered in `index.ts`.
  Document *why* in the file header.
- Use React components only for app wiring (routes, layouts, data).

## Design
- Crafted, never generic: deliberate typography, generous spacing, one accent.
- Motion is smooth, fluid and satisfying. Use the `--ease-*` and `--duration-*`
  tokens in `globals.css`; never ad-hoc curves or timings.

## Responsive and accessible
- Mobile-first; every screen works from 320px up.
- WCAG 2.2 AA at minimum: semantic HTML, keyboard reachable, visible focus,
  4.5:1 text contrast, labels on every control, and "reduce motion" respected.
  Check the a11y panel in Storybook for every story.

## Docs
- Every element/component gets a story; Storybook is the docs.
- Visual explanations are quick-to-follow diagrams and flows (FigJam).

## Workflow
- Prefer CLI and APIs over clicking through UIs.
- `main` deploys to Vercel (Free tier) on every push; work on branches + PRs.
- Figma account: izaias.cavalcanti@usp.br.
