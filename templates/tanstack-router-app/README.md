# Force UI — TanStack Router starter

A designer-ready starter: [TanStack Router](https://tanstack.com/router) (file
based) + Vite + React + Tailwind v4, with the full **Force UI** component
library and the `dashboard-01` block wired up as the home page.

## Get this template

Grab just this folder as a fresh, standalone project (no monorepo history):

```bash
npx degit Perforce-Shared-Services/shadcn-force-ui/templates/tanstack-router-app my-app
cd my-app
git init && git add -A && git commit -m "init from tanstack-router template"
```

`degit` downloads the files only — it doesn't need git installed. The `git init`
line starts your project's own repo.

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 — the dashboard is the index route (`src/routes/index.tsx`).

## What's included

- Every Force UI component in `src/components/ui/`.
- The `dashboard-01` block (sidebar, charts, data table) in `src/components/`,
  rendered by the `/` route.
- Force UI theme + Noto Sans font in `src/styles.css`. Light/dark toggle via the
  `ThemeProvider` (press `d` to toggle).

## Add or update components

This project is wired to the hosted Force UI registry. Add more (or refresh
existing) component source with:

```bash
REGISTRY_URL="https://shadcn-force-ui.vercel.app/r-react" \
npx shadcn@latest add @force-ui/button
```

### Update everything (components + CSS)

Re-apply the Force UI preset. With no `--only`, `apply` reinstalls every
component already in the project **and** overwrites fonts and CSS variables
(design tokens) — so components pick up new tokens in the same pass:

```bash
REGISTRY_URL="https://shadcn-force-ui.vercel.app/r-react" \
npx shadcn@latest apply \
  --preset "https://shadcn-force-ui.vercel.app/init?base=radix&style=force-ui&baseColor=force-ui&theme=force-ui&chartColor=force-ui&iconLibrary=lucide&font=noto-sans&rtl=false&menuAccent=subtle&menuColor=default&radius=default" \
  -y
```

This overwrites local component edits — commit or stash first. To update only
the theme and font without touching components, append `--only theme,font`.

## Routing

Routes live in `src/routes/`. The router plugin regenerates
`src/routeTree.gen.ts` on `pnpm dev` / `pnpm build`. Add a file under
`src/routes/` to add a page.
