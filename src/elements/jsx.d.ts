import type { DetailedHTMLProps, HTMLAttributes } from "react";

/** Lets TSX type-check our custom elements like built-in HTML tags. */
type CustomElement<Attributes = object> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
  Attributes;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "moz-reveal": CustomElement<{ delay?: number }>;
    }
  }
}
