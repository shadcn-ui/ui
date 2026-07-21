# Force UI

Force UI is an **internal brand kit** built on top of [shadcn/ui](https://ui.shadcn.com), forked to apply our own brand tokens, component variants, and framework ports on top of the upstream component sources.

![hero](apps/v4/public/opengraph-image.png)

## Repository layout

This is a pnpm/Turborepo monorepo:

- `apps/v4` — the docs & component registry site (Next.js). Run it locally with `pnpm --filter=v4 dev` (serves on `:4000`). This is also where the component registry (`/r/*.json`) is built and served from — there is no separate Storybook.
- `apps/preview-{vue,svelte,ember}` — framework preview servers embedded in the docs site for cross-framework component parity checks.
- `packages/theme-force-ui` — Force UI brand tokens (OKLCH palette). Edit here for color changes.
- `packages/registry-{ember,vue,svelte}` — framework ports of the component registry.
- `packages/shadcn` — the shadcn CLI (upstream, minimal changes).

See [CONTRIBUTING.md](/CONTRIBUTING.md) for the full contributor guide, including the `[FORCE-UI]` marker convention used to track our customizations against upstream `shadcn/ui` files, and the workflow for merging upstream changes.

## Getting started

```bash
pnpm install
pnpm --filter=v4 dev             # docs site on :4000
pnpm --filter=v4 registry:build  # rebuild the component registry
```

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## License

Licensed under the [MIT license](./LICENSE.md).
