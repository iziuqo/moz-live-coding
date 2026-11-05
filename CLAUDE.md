# Working rules for this repo

These rules apply to every change, by any person or agent.

## Code
- Lean, clean, DRY and SOLID: the smallest change that does the job well.
- Self-explaining: clear names first, then a short doc comment on every
  exported function, component and token that says what it is for.
- TypeScript strict, no `any`. Keep components small and single-purpose.
- `npm run build`, `npm run lint` and `npm run build-storybook` must pass.

## Design
- Crafted, never generic: deliberate typography, generous spacing, one accent.
- Motion is smooth and satisfying. Use the tokens in `src/lib/motion.ts`
  (or the matching `ease-out` / `ease-in-out` CSS utilities); never ad-hoc
  curves. Always respect "reduce motion".

## Docs
- Every component gets a `*.stories.tsx` beside it; Storybook is the docs.
- Visual explanations are quick-to-read diagrams and flows (FigJam).

## Workflow
- Prefer CLI and APIs over clicking through UIs.
- `main` deploys to Vercel (Free tier) on every push; work on branches + PRs.
- Figma account: izaias.cavalcanti@usp.br.
