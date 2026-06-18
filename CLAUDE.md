# Force UI — AI assistant context

Force UI is an **internal brand kit** forked from [shadcn/ui](https://github.com/shadcn-ui/ui). Read `CONTRIBUTING.md` for the full contributor guide. Key rules summarised here for quick reference.

## Monorepo layout

- `apps/v4/registry/bases/radix/` and `apps/v4/registry/bases/base/` — upstream React component sources. Edit minimally.
- `apps/v4/registry/styles/style-force-ui.css` — Force UI component styles. Safe to edit freely.
- `packages/theme-force-ui/src/index.ts` — brand tokens (OKLCH). Edit here for color changes.
- `packages/registry-{ember,vue,svelte}/` — framework ports. Upstream never touches these.

## [FORCE-UI] marker system

Every custom addition to an upstream-owned file must be tagged:

```ts
warning: "cn-badge-variant-warning",  // [FORCE-UI]
```

```css
/* [FORCE-UI-START] */
--font-sans: 'Noto Sans', sans-serif;
/* [FORCE-UI-END] */
```

After any upstream merge: `grep -rn "\[FORCE-UI\]" apps/v4/`

## Adding a variant

1. CSS in `style-force-ui.css` → `.cn-{component}-variant-{name} { @apply ... }`
2. One line in the component `.tsx` cva map → `name: "cn-{component}-variant-{name}",  // [FORCE-UI]`
3. Update both `radix/` and `base/` MDX API tables

## Style names & the allowlist

The only valid style in the v4 app/registry is `force-ui`. In MDX: `styleName="radix-force-ui"` or `styleName="base-force-ui"`. Never reference upstream demo styles (vega, nova, lyra, maia, mira, luma, sera, rhea).

Upstream keeps adding demo styles. We enforce a single-style allowlist with `scripts/strip-styles.mjs` (idempotent): it removes every non-`force-ui` style from the v4 app — generated trees (`styles/*`, `public/r/styles/*`), per-style CSS, `(styles)/*` showcase routes, `config.ts` PRESETS, `globals.css` `@custom-variant`s, the `style-registry.css` aggregator — and rewrites stray `@/styles/<base>-<demo>` imports to `force-ui`. Run it after every upstream merge (the sync script does this automatically); `node scripts/strip-styles.mjs --check` is a CI guard.

**Exception:** the shadcn CLI package (`packages/shadcn/src/preset/preset.ts`) keeps the full `PRESET_STYLES` list — preset codes are bit-packed and reordering/removing styles breaks backward-compatible decoding. Those styles are inert there and never leak into our registry output.

## Do not

- Edit `:root` vars in `globals.css` directly — update `packages/theme-force-ui/src/index.ts` instead
- Add framework port files to `apps/v4/registry/bases/` — use `packages/registry-{framework}/`
- Modify upstream component files beyond the minimum needed — use `style-force-ui.css` for styling
