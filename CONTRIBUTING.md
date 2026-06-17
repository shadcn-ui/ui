# Contributing to Force UI

Force UI is an internal brand kit built on top of [shadcn/ui](https://ui.shadcn.com). This document covers how to work with the fork safely — adding features without making future upstream merges painful.

## Repository structure

```
apps/
├── v4/                        # Docs & registry site (Next.js)
│   ├── app/                   # Next.js app
│   ├── content/docs/          # MDX documentation
│   ├── registry/
│   │   ├── bases/
│   │   │   ├── radix/         # ← upstream React (Radix UI) — track closely
│   │   │   └── base/          # ← upstream React (Base UI)  — track closely
│   │   ├── styles/
│   │   │   └── style-force-ui.css  # Force UI component styles
│   │   └── themes.ts          # Imports force-ui theme + upstream themes
│   └── scripts/
│       └── build-registry.mts # Registry build pipeline
├── preview-ember/             # Ember preview server
├── preview-vue/               # Vue preview server
└── preview-svelte/            # Svelte preview server

packages/
├── shadcn/                    # shadcn CLI (upstream, minimal changes)
├── theme-force-ui/            # Force UI brand tokens (OKLCH palette)
│   └── src/index.ts           # Edit here to change brand colors
├── registry-ember/            # Ember component registry
├── registry-vue/              # Vue component registry
└── registry-svelte/           # Svelte component registry
```

## Development

```bash
pnpm install
pnpm --filter=v4 dev        # docs site on :4000
pnpm --filter=v4 registry:build  # rebuild registry
```

## This is a fork — read this before making changes

Force UI forks [shadcn-ui/ui](https://github.com/shadcn-ui/ui). Upstream ships new components, fixes, and docs regularly. The goal is to make merges from `upstream/main` as painless as possible.

### The [FORCE-UI] marker system

Every file we modify that upstream also owns must have markers so we can find our changes instantly after a merge:

```bash
# After any upstream merge, run this to find every conflict hotspot:
grep -rn "\[FORCE-UI\]" apps/v4/
```

- **CSS/MDX**: `/* [FORCE-UI] */` or `{/* [FORCE-UI] */}` inline, or `/* [FORCE-UI-START] */ ... /* [FORCE-UI-END] */` for blocks
- **TypeScript**: `// [FORCE-UI]` inline or `// [FORCE-UI-START] / // [FORCE-UI-END]` for blocks

### What lives where

| Change type | Where it goes | Conflict risk |
|---|---|---|
| Brand color/token update | `packages/theme-force-ui/src/index.ts` | None |
| New variant style (CSS) | `apps/v4/registry/styles/style-force-ui.css` | None |
| New variant prop (`variant="warning"`) | One line in the component `.tsx` + `// [FORCE-UI]` | Very low |
| New component (no upstream equivalent) | `apps/v4/registry/bases/radix/ui/` **for now**, or create `packages/registry-force-ui/` | Low |
| Framework port changes (Ember/Vue/Svelte) | `packages/registry-{ember,vue,svelte}/` | None |
| Docs for Force UI-specific features | `apps/v4/content/docs/force-ui/` | None |
| Docs for existing components | `apps/v4/content/docs/components/{radix,base}/` + `// [FORCE-UI]` block | Low |

## Adding a custom variant to an existing component

Use the three-step pattern. Example: adding `warning` to Badge.

**Step 1 — Add the CSS** in `style-force-ui.css`:
```css
.cn-badge-variant-warning {
  @apply bg-warning/10 text-warning dark:bg-warning/20;
}
```

**Step 2 — Add one line** to the component's `cva` map:
```tsx
// apps/v4/registry/bases/radix/ui/badge.tsx
variants: {
  variant: {
    default: "cn-badge-variant-default",
    // ... upstream variants ...
    warning: "cn-badge-variant-warning",  // [FORCE-UI]
  }
}
```

**Step 3 — Update the docs** in the component's MDX files (both `radix/` and `base/`):
```mdx
| `variant` | `"default" \| ... \| "warning"` | `"default"` |
```

A PR that adds a variant without updating the docs table will be rejected.

## Adding a new component

If the component has no upstream equivalent (e.g. `Spinner`, `Field`, `Empty`):

1. Add the source to `apps/v4/registry/bases/radix/ui/` and `apps/v4/registry/bases/base/ui/`
2. Register it in `apps/v4/registry/bases/radix/ui/_registry.ts`
3. Add docs at `apps/v4/content/docs/components/radix/{name}.mdx`
4. Run `pnpm --filter=v4 registry:build`

## Updating the brand theme

Brand colors live in `packages/theme-force-ui/src/index.ts` as OKLCH values. Changing them here automatically propagates to the registry on the next build. Do **not** edit the `:root` vars in `globals.css` directly — that block is generated from the theme package and marked `[FORCE-UI-START]`.

## Syncing from upstream shadcn

```bash
git fetch upstream
git merge upstream/main
# Then:
grep -rn "\[FORCE-UI\]" apps/v4/   # find every block that may need attention
```

The files most likely to have conflicts after a merge are:
- `apps/v4/app/globals.css` — look for `[FORCE-UI]` blocks
- `apps/v4/registry/themes.ts` — we add `forceUITheme` import at the top
- `apps/v4/registry/styles.tsx` — we add the `force-ui` style entry
- `apps/v4/registry/bases.ts` — we add ember/vue/svelte base entries

Framework ports (`packages/registry-{ember,vue,svelte}/`) and the theme package (`packages/theme-force-ui/`) are never touched by upstream merges.

## Documentation rules

- Component docs in `content/docs/components/radix/` and `content/docs/components/base/` are **100% ours** — don't auto-sync with upstream prose. Cherry-pick relevant upstream doc improvements manually.
- When upstream adds a new component prop or example, review their docs and update ours if relevant.
- Force UI-specific docs (theming, custom components, framework guides) go in `content/docs/force-ui/`.
- The `styleName` prop in `<ComponentPreview>` must always be `radix-force-ui` or `base-force-ui`. Never reference a removed style.

## Commit convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(components): add warning variant to badge
fix(docs): update badge API table with warning variant
refactor(registry): move ember port to packages/registry-ember
```

Categories: `feat`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore`

## Keeping `sync/upstream-main` current

`sync/upstream-main` is a local branch that mirrors `upstream/main` exactly — it never receives our commits. It exists so you can run `git log sync/upstream-main` or `git diff main...sync/upstream-main` without needing the upstream remote configured.

The sync script updates it automatically. To update it manually:

```bash
git fetch upstream
git checkout sync/upstream-main
git reset --hard upstream/main
git checkout main
```

Never commit directly to `sync/upstream-main`. If you find it ahead of `upstream/main`, reset it.

## Running tests

```bash
pnpm test
```
