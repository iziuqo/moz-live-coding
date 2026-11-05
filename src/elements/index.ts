import { defineMozReveal } from "./moz-reveal";

/**
 * Registers every custom element in the design system.
 * Add each new element's `define…` call here so apps register them in one go.
 */
export function defineElements(): void {
  defineMozReveal();
}
