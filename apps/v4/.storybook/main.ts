import { dirname } from "path"
import { fileURLToPath } from "url"
import reactDocgenTypescript from "@joshwooding/vite-plugin-react-docgen-typescript"
import type { StorybookConfig } from "@storybook/nextjs-vite"

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
  ],
  framework: getAbsolutePath("@storybook/nextjs-vite"),
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.plugins ??= []
    config.plugins.push(
      reactDocgenTypescript({
        shouldExtractLiteralValuesFromEnum: true,
        include: ["registry/new-york-v4/ui/**/*.tsx"],
        propFilter: (prop) => prop.name !== "key" && prop.name !== "ref",
      })
    )
    return config
  },
}
export default config
