import type { StorybookConfig } from "@storybook/react-vite"
import path from "path"

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Path alias: @/* -> apps/v4/*
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, ".."),
      // Mock next-themes for sonner component
      "next-themes": path.resolve(__dirname, "mocks/next-themes.ts"),
    }

    // Tailwind v4 PostCSS
    config.css = config.css || {}
    config.css.postcss = {
      plugins: [(await import("@tailwindcss/postcss")).default],
    }

    return config
  },
}

export default config
