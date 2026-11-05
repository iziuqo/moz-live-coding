import { Reveal } from "@/components/Reveal";

/**
 * Home: a deliberately quiet starting canvas for the live session.
 * Everything built during the interview replaces or extends this page.
 */
export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
            Live coding session
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="text-4xl font-semibold tracking-tight text-balance">
            Moz, built live.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-base/7 text-foreground/60 text-pretty">
            Next.js, TypeScript and Tailwind, deployed on every push.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
