"use client";

import { defineElements } from "@/elements";

// Runs as soon as this client chunk loads, before React hydrates,
// so custom elements upgrade without waiting for an effect.
defineElements();

/** Mount once in the root layout to register all custom elements. */
export function DefineElements() {
  return null;
}
