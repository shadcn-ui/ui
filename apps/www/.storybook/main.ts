import type { StorybookConfig } from "@storybook/nextjs"

const config = {
  stories: [
    "../registry/stories/**/*.mdx",
    "../registry/stories/**/*.stories.@(js|jsx|ts|tsx)",
    "./theme/**/*.stories.@(js|jsx|ts|tsx)",
    "./theme/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: true,
  },
} satisfies StorybookConfig

export default config
