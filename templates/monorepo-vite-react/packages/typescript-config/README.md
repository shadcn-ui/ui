# TypeScript Configuration (`@workspace/typescript-config`)

This package provides shared `tsconfig.json` files for the monorepo. Using these base configurations ensures that all projects adhere to the same TypeScript settings.

## How It Works

Projects within this monorepo (e.g., `apps/web`, `packages/ui`) extend the configurations from this package in their own `tsconfig.json` files. This is typically done using the `extends` property.

For example, the `apps/web/tsconfig.app.json` file inherits its settings like this:

```json
{
  "extends": "@workspace/typescript-config/tsconfig.app.json",
  // ... project-specific overrides
}
```

## Available Configurations

This package provides three base configurations:

### `tsconfig.app.json`

-   **Purpose**: For browser-based applications (like `apps/web`).
-   **Settings**:
    -   Targets modern browsers (`ES2022`) and includes `DOM` libraries.
    -   Enables the modern React `react-jsx` transform.
    -   Uses `"bundler"` module resolution, ideal for Vite.
    -   Enforces `strict` type-checking.
    -   `noEmit` is `true` because the bundler (Vite) handles file emission.

### `tsconfig.lib.json`

-   **Purpose**: For libraries (like `packages/ui`) that are consumed by other projects.
-   **Settings**:
    -   Similar to `tsconfig.app.json` but configured to generate type declaration files (`.d.ts`).
    -   `declaration` and `emitDeclarationOnly` are set to `true`. This is crucial for providing TypeScript support to consuming projects.

### `tsconfig.node.json`

-   **Purpose**: For files that run in a Node.js environment, such as build scripts or configuration files (e.g., `vite.config.ts`).
-   **Settings**:
    -   Targets a modern Node.js version (`ES2023`).
    -   Does **not** include `DOM` libraries.
    -   Enforces `strict` type-checking.
    -   `noEmit` is `true` as this is for type-checking only.