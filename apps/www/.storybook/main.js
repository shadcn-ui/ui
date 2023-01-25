const path = require("path")
const { mergeConfig } = require("vite")
module.exports = {
  features: {
    storyStoreV7: true,
  },
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    /**
     * Enable TailwindCSS JIT mode
     * NOTE: fix Storybook issue with PostCSS@8
     * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
     */
    {
      name: "@storybook/addon-postcss",
      options: {
        // Note: Settings are picked up from postcss.config.cjs
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../"),
          "next/image": path.resolve(__dirname, "./stubs/NextImage.tsx"),
        },
      },
    })
  },
  docs: {
    autodocs: true,
  },
}
