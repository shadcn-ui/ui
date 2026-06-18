import nextVitals from "eslint-config-next/core-web-vitals"
import tseslint from "typescript-eslint"

const eslintConfig = tseslint.config(
  // Remove the @typescript-eslint plugin from next/typescript to prevent
  // duplicate registration with tseslint.configs.recommended.
  ...nextVitals.map((config) =>
    config.name === "next/typescript"
      ? { ...config, plugins: {} }
      : config
  ),
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".source/**",
      "**/__index__.tsx",
      "**/__components__.tsx",
      // [FORCE-UI] build outputs + non-React framework ports (linted by their own toolchains)
      "public/preview/**",
      "preview-server/dist/**",
      "styles/vue-force-ui/**",
      "styles/svelte-force-ui/**",
      "styles/ember-force-ui/**",
    ],
  },
  {
    rules: {
      "react-hooks/incompatible-library": "off",
      "react-hooks/purity": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
    },
  },
)

export default eslintConfig
