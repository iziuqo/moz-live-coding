/**
 * Motion tokens: the single source of truth for how things move.
 *
 * Use these instead of ad-hoc numbers so every interaction shares one feel:
 * quick to respond, soft to settle. CSS transitions get the same curves via
 * the `--ease-*` / `--duration-*` variables in `globals.css`.
 */

/** Cubic-bezier curves. `out` for entrances, `inOut` for on-screen moves. */
export const ease = {
  out: [0.16, 1, 0.3, 1], // expo-out: fast start, long gentle landing
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Durations in seconds. Small UI feedback stays under 200ms. */
export const duration = {
  fast: 0.15, // hovers, presses, toggles
  base: 0.3, // menus, popovers, small reveals
  slow: 0.6, // page-level entrances
} as const;

/** Physical springs for things the user drags, flicks or toggles. */
export const spring = {
  snappy: { type: "spring", stiffness: 500, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 26 },
} as const;
