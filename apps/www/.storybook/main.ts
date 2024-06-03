import type { StorybookConfig } from "@storybook/nextjs"

const config = {
  stories: [
    "../registry/stories/**/*.mdx",
    "../registry/stories/**/*.stories.@(js|jsx|ts|tsx)",
    "./tokens/**/*.stories.@(js|jsx|ts|tsx)",
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
    autodocs: "tag",
  },
} satisfies StorybookConfig

export default config
