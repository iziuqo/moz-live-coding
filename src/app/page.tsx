/**
 * Home: a deliberately quiet starting canvas for the live session.
 * Everything built during the interview replaces or extends this page.
 *
 * Text colours use 70%+ foreground opacity to keep WCAG AA contrast
 * in both light and dark mode.
 */
export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <moz-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">
            Live coding session
          </p>
        </moz-reveal>
        <moz-reveal delay={80}>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Moz, built live.
          </h1>
        </moz-reveal>
        <moz-reveal delay={160}>
          <p className="text-base/7 text-foreground/75 text-pretty">
            Next.js, TypeScript and Tailwind, deployed on every push.
          </p>
        </moz-reveal>
      </div>
    </main>
  );
}
