import type { Preview } from "@storybook/nextjs-vite";

// Load the app's global styles (Tailwind + design tokens) so stories
// render exactly like the real app.
import "../src/app/globals.css";
import { defineElements } from "../src/elements";

// Register custom elements so stories can use them like any HTML tag.
defineElements();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // Surface accessibility issues in the a11y panel without failing builds.
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default preview;
