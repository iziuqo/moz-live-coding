/**
 * <moz-reveal delay="80">…</moz-reveal>
 *
 * Eases its content into view on load. Siblings with rising delays read as
 * one fluid sequence. Styles live in moz-reveal.css.
 *
 * Why a web component and not a React component:
 * - Framework-agnostic: the same tag works in React, Vue, Svelte, plain HTML
 *   or a CMS template, so it survives any future stack change.
 * - Zero runtime dependencies: native Custom Elements + CSS animations,
 *   so nothing extra ships to the browser.
 * - Works without JavaScript: content stays readable if the script never runs.
 */

const TAG = "moz-reveal";

/** Registers <moz-reveal>. Safe to call many times and on the server (no-op). */
export function defineMozReveal(): void {
  if (typeof customElements === "undefined" || customElements.get(TAG)) return;

  customElements.define(
    TAG,
    class MozReveal extends HTMLElement {
      static observedAttributes = ["delay"];

      /** Maps the `delay` attribute (milliseconds) to the CSS animation delay. */
      attributeChangedCallback(): void {
        const delayMs = Number(this.getAttribute("delay")) || 0;
        this.style.setProperty("--reveal-delay", `${delayMs}ms`);
      }
    },
  );
}
