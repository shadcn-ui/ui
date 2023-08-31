const baseConfig = require("../../tailwind.config.cjs")

/** @type {import('tailwindcss/types/config').ResolvableTo<Record<string, string>>} */
const baseConfigThemeExtendSupports = (utils) =>
  typeof baseConfig.theme.extend.supports === "function"
    ? baseConfig.theme.extend.supports(utils)
    : baseConfig.theme.extend.supports

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    "content/**/*.mdx",
    "registry/**/*.{ts,tsx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      supports: {
        ...baseConfigThemeExtendSupports(),
        "backdrop-blur": "backdrop-filter: blur(var(--tw-backdrop-blur))",
      },
    }
  }
}
