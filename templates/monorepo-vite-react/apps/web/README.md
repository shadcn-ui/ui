# Web Application (`web`)

This directory contains the main Vite and React application for the monorepo.

## Development

To start the development server for only this application, run the following command from the **root of the monorepo**:

```bash
pnpm dev --filter=web
```

## Using Shared Components

This application is designed to consume shared components from the `@workspace/ui` package. To use a component, import it directly:

```tsx
// src/App.tsx
import { Button } from '@workspace/ui/components/button';

function App() {
  return (
    <div>
      <h1>Web App</h1>
      <Button>Hello from the UI package!</Button>
    </div>
  );
}

export default App;
```

## Configuration

-   **ESLint & TypeScript**: The configurations for both are inherited from the shared `packages/eslint-config` and `packages/typescript-config` packages. You should not need to modify the local `eslint.config.js` or `tsconfig.json` files for general development.
-   **Vite**: The Vite configuration is managed in `vite.config.ts`.
-   **Tailwind CSS**: The `tailwind.config.js` and `postcss.config.js` files are set up to correctly resolve and process styles from the shared `packages/ui` library.