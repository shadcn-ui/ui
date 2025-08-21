# Monorepo Template: Vite, React, shadcn/ui, and Turborepo

This is a monorepo template designed for building modern web applications with Vite and React. It comes pre-configured with `shadcn/ui`, shared ESLint and TypeScript configurations, and is powered by Turborepo for high-performance builds.

## What's Inside?

This monorepo includes the following apps and packages:

-   **`apps/web`**: A Vite-powered React application, ready for development.
-   **`packages/ui`**: A shared React component library using `shadcn/ui`.
-   **`packages/eslint-config`**: Shared ESLint configurations for consistent code quality.
-   **`packages/typescript-config`**: Shared `tsconfig.json` files for consistent TypeScript settings.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (version 20 or higher)
-   [pnpm](https://pnpm.io/installation) (version 10 or higher)

### 1. Installation

Install all project dependencies from the root directory:

```bash
pnpm install
```

### 2. Development

To start the development server for the `web` app, run the following command from the root directory:

```bash
pnpm dev
```

This uses Turborepo to run the `dev` script in the `web` package.

### 3. Build

To build all apps and packages for production, run the following command from the root directory:

```bash
pnpm build
```

## Key Features & Usage

### Working with shadcn/ui

The `ui` package is configured for `shadcn/ui`.

#### Adding New Components

To add new `shadcn/ui` components, run the `pnpm dlx shadcn-ui@latest add` command from the root of the monorepo. The components will be added to the `packages/ui/src` directory.

For example, to add the `input` component:

```bash
# Make sure to run this from the monorepo root
pnpm dlx shadcn-ui@latest add input
```

> **Note:** The CLI will prompt you to confirm the path for your components. Ensure it is set to `packages/ui/src/components`.

#### Using Components

Import components in your `web` application from the `@workspace/ui` package:

```tsx
// In apps/web/src/App.tsx
import { Button } from '@workspace/ui/components/button';

function MyApp() {
  return <Button>Click Me</Button>;
}
```

### Code Quality (Linting & Formatting)

-   **Linting**: To check for code quality issues across the entire monorepo, run:
    ```bash
    pnpm lint
    ```
-   **Formatting**: To automatically format all code with Prettier, run:
    ```bash
    pnpm format
    ```

### Shared Configurations

-   **ESLint**: The configuration is managed in `packages/eslint-config`. All other packages in the monorepo extend these rules to ensure consistency.
-   **TypeScript**: The base configurations (`tsconfig.json`) are managed in `packages/typescript-config`. This allows for centralized control over TypeScript settings like path aliases and compiler options.

## Turborepo

This monorepo uses [Turborepo](https://turbo.build/repo) as its build system. It speeds up development by caching build outputs and running tasks in parallel.

### Remote Caching

To share build caches with your team and CI/CD pipelines, you can enable [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) with Vercel.

1.  **Login to your Vercel account:**
    ```bash
    pnpm exec turbo login
    ```
2.  **Link the project:**
    ```bash
    pnpm exec turbo link
    ```

Learn more about Turborepo from the [official documentation](https://turbo.build/repo/docs).