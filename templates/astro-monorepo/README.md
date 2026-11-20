# Astro + React + TypeScript + shadcn/ui (Monorepo)

This is a monorepo template for Astro with React, TypeScript, and shadcn/ui.

## Structure

- `apps/web` - Astro application
- `packages/ui` - Shared UI components (shadcn/ui)

## Adding components

To add components, run the following command from the root:

```bash
npx shadcn@latest add button -c apps/web
```

## Using components

To use the components in your app, import them in an `.astro` file:

```astro
---
import { Button } from "@workspace/ui/components/button"
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro App</title>
  </head>
  <body>
    <div class="grid h-screen place-items-center content-center">
      <Button>Button</Button>
    </div>
  </body>
</html>
```
