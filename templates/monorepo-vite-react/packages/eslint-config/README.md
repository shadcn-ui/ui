# ESLint Configuration (`@workspace/eslint-config`)

This package contains the shared ESLint "flat config" for the entire monorepo. It ensures consistent code style and quality across all applications and packages.

## How It Works

The primary configuration file, `eslint.config.js`, aggregates several specialized configurations. This modular approach makes the ruleset easier to manage and understand.

Other projects in this monorepo (like `apps/web`) are already set up to use this configuration via their `package.json` files.

## Included Configurations

-   `eslint-vite-config.js`: Core rules for Vite, TypeScript, and React projects. Includes `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
-   `eslint-turbo-config.js`: Rules specific to a Turborepo environment, including integration with Prettier and warnings for development workflows (`eslint-plugin-only-warn`).
-   `eslint-tanstack-query-config.js`: Recommended rules for TanStack Query (`@tanstack/eslint-plugin-query`).
-   `eslint-ui-config.js`: Override rules for the UI library (`@workspace/ui`), allowing for more flexible component and utility exports.
-   `eslint-import-sort-config.js`: **(Optional)** Rules for automatically sorting import statements via `eslint-plugin-simple-import-sort`. See below for activation instructions.

## Optional: Enable Auto-Sorting of Imports

To automatically sort your imports on save in VS Code, follow these two steps:

**1. Activate the ESLint Configuration**

Modify `packages/eslint-config/eslint.config.js` to include the import sorting rules:

```javascript
import tanstackQueryConfig from './eslint-tanstack-query-config.js';
import turboConfig from './eslint-turbo-config.js';
import uiConfig from './eslint-ui-config.js';
import viteConfig from './eslint-vite-config.js';
import importSortConfig from './eslint-import-sort-config.js'; // 1. Add this line

/** @type {import("eslint").Linter.Config} */
export default [
  ...turboConfig,
  ...viteConfig,
  ...tanstackQueryConfig,
  ...uiConfig,
  ...importSortConfig, // 2. Add this line
];
```

**2. Configure VS Code Settings**

Add or update the `.vscode/settings.json` file at the project root:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true
}
```