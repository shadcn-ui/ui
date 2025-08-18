import pluginReactRefresh from "eslint-plugin-react-refresh";

import { config as reactConfig } from "./react-internal.js";

/**
 * A custom ESLint configuration for libraries that use Vite.
 *
 * @type {import("eslint").Linter.Config} */
export const viteConfig = [
  ...reactConfig,
  {
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
];
