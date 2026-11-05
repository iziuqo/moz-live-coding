import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Storybook is the living documentation for this project.
 * It picks up every `*.mdx` doc and `*.stories.tsx` file under `src/`,
 * so documenting a component is as simple as adding a story next to it.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs", // Autodocs + MDX pages
    "@storybook/addon-a11y", // Accessibility checks on every story
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};

export default config;
