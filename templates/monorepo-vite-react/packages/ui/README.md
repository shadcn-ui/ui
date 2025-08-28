# UI Components (`@workspace/ui`)

This package contains a shared React component library for the monorepo, built using **shadcn/ui** and styled with **Tailwind CSS**.

## Adding New Components

To add a new component from the `shadcn/ui` library, run the following command from the **root of the monorepo**:

```bash
# Example: Add the 'dialog' component
pnpm dlx shadcn-ui@latest add dialog
```

The `shadcn/ui` CLI is pre-configured to place new components directly into this package at `packages/ui/src/components`.

## Using Components

Components from this package can be imported and used in any application within the monorepo.

For example, to use the `Button` in the `web` app:

```tsx
// In apps/web/src/App.tsx
import { Button } from '@workspace/ui/components/button';

function MyApp() {
  return <Button>Click Me</Button>;
}
```

## Styling

Component styling is managed by Tailwind CSS. The necessary configurations are already set up in the root `tailwind.config.js` and `apps/web/src/index.css` files, which process styles from this package.