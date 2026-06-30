---
name: sync-upstream
description: Merge upstream shadcn-ui/ui into Force UI. Creates a dated branch with separate reviewable commits — merge, strip styles, port new components, rebuild.
---

# Sync Upstream shadcn-ui/ui

Merge `upstream/main` into a new branch. Produce separate commits so each stage can be reviewed independently.

## Commit strategy

| # | Commit message | What goes in it |
|---|---|---|
| 1 | `chore: merge upstream shadcn-ui/ui <hash>` | The `--no-ff` merge commit with all resolved conflicts |
| 2 | `chore: strip upstream demo styles` | Output of `node scripts/strip-styles.mjs` |
| 3 | `feat: add force-ui styles for new components` | `style-force-ui.css` additions + any new `styles/*/ui/*.tsx` files |
| 4 | `chore: rebuild registry + fix post-merge type errors` | Registry JSON output, lockfile, any typecheck fixes |

---

## Step 1 — Branch and merge

```bash
git fetch upstream --no-tags
git config merge.ours.driver true
git checkout -b chore/sync-upstream-$(date +%Y-%m-%d) main
git merge --no-ff -m "chore: merge upstream shadcn-ui/ui $(git rev-parse --short upstream/main)

Upstream commits merged: $(git rev-list --count main..upstream/main)
Upstream ref: $(git rev-parse upstream/main)
Merge date: $(date -u +%Y-%m-%dT%H:%M:%SZ)" upstream/main
```

If the merge exits non-zero, resolve conflicts then `git merge --continue`.

---

## Conflict resolution

Conflicts fall into three buckets — handle each mechanically before touching source files.

### Bucket A — demo style modify/delete (upstream modified, we deleted)

```bash
git diff --name-only --diff-filter=U \
  | grep -E "/(base-luma|base-lyra|base-maia|base-mira|base-nova|base-rhea|base-sera|base-vega|radix-luma|radix-lyra|radix-maia|radix-mira|radix-nova|radix-rhea|radix-sera|radix-vega)/" \
  | xargs git rm -f --ignore-unmatch

git diff --name-only --diff-filter=U \
  | grep "registry/styles/style-" \
  | xargs git rm -f
```

### Bucket B — new generated JSON landing in force-ui dirs (implicit dir rename)

```bash
git diff --name-only --diff-filter=U \
  | grep -E "(base-force-ui|radix-force-ui|ember-force-ui|svelte-force-ui)" \
  | xargs -I{} git checkout --theirs {}

git diff --name-only --diff-filter=U \
  | grep -E "(base-force-ui|radix-force-ui|ember-force-ui|svelte-force-ui)" \
  | xargs git add
```

### Bucket C — lockfile

```bash
git checkout --theirs pnpm-lock.yaml && git add pnpm-lock.yaml
```

### Bucket D — source file conflicts (manual)

Check remaining conflicts with `git diff --name-only --diff-filter=U`.

| File | Rule |
|---|---|
| `globals.css` | Keep upstream blocks. Re-insert `[FORCE-UI]` lines: `style-force-ui.css` import, `@custom-variant style-force-ui`, font block, token mappings |
| `package.json` | Keep upstream script changes. Merge our `icons:material-map` scripts into `registry:build`. Take upstream `@tailwindcss/postcss` / `tailwindcss` version ranges |
| `apps/v4/components/components-list.tsx` | Keep upstream `variant` prop + `ComponentLink` refactor. Preserve our `[FORCE-UI-START]` framework-awareness block (`useFramework`, "Soon" badges) |
| `apps/v4/mdx-components.tsx` | Keep upstream `getComponentsFolder()` refactor. Keep our `[FORCE-UI]` wrapper that doesn't pass `currentBase` |
| `apps/v4/app/(app)/(root)/cards/index.tsx` | Keep our `style-force-ui theme-default` className |
| `apps/v4/scripts/build-registry.mts` | Keep upstream changes. See known bug below |
| `apps/v4/registry/__components__.tsx` | Auto-generated — take ours: `git checkout --ours apps/v4/registry/__components__.tsx && git add apps/v4/registry/__components__.tsx` |
| `.gitignore` | Merge both sides |

After all files are clean: `git merge --continue`

---

## Known bugs introduced by upstream (fix in commit 4)

### `buildBlocksIndex` uses a hardcoded path that breaks framework ports

`apps/v4/scripts/build-registry.mts` — `buildBlocksIndex` uses a template literal `../registry/bases/${base.name}/registry.ts` which fails for `vue`, `svelte`, `ember` (they live in `packages/registry-{name}`). Fix:

```ts
// Before (upstream):
const { registry: baseRegistry } = await import(
  `../registry/bases/${base.name}/registry.ts`
)

// After:
const { registry: baseRegistry } = await import(
  path.join(getBaseSrcDir(base.name), "registry.ts") // [FORCE-UI] use getBaseSrcDir for framework ports
)
```

### `IconPlaceholder` requires all icon library keys

`apps/v4/app/(app)/create/components/icon-placeholder.tsx` — upstream examples don't pass `materialSymbols`. The runtime already guards with `if (!iconName) return null`. Make the type partial:

```ts
// Before:
  [K in IconLibraryName]: string

// After:
  [K in IconLibraryName]?: string // [FORCE-UI] partial: upstream examples only pass known icon libraries
```

### `force-ui` missing from `PRESET_STYLES`

`packages/shadcn/src/preset/preset.ts` — `encodePreset` type rejects `"force-ui"`. Append it (bit-packed by index — never reorder):

```ts
export const PRESET_STYLES = [
  "nova", "vega", "maia", "lyra", "mira", "luma", "sera", "rhea",
  "force-ui", // [FORCE-UI] appended (bit-packed by index — never reorder/remove)
] as const
```

After editing `packages/shadcn/src/preset/preset.ts`, rebuild before typechecking: `pnpm --filter=shadcn build`

---

## Step 2 — Strip demo styles

```bash
node scripts/strip-styles.mjs
git add -A
git commit -m "chore: strip upstream demo styles (luma/lyra/maia/mira/nova/rhea/sera/vega)"
```

---

## Step 3 — Port new components to force-ui style

When upstream adds new components, you need to:

1. **Add `cn-*` classes to `style-force-ui.css`** — copy the relevant section verbatim from `style-nova.css` (nova is our closest upstream style, ~393 diff lines vs ~651 for vega).

   ```bash
   # Confirm nova is still closest:
   for style in nova vega maia lyra mira luma sera rhea; do
     diff <(git show upstream/main:apps/v4/registry/styles/style-$style.css \
       | sed "s/\.style-$style/.style-force-ui/g") \
       apps/v4/registry/styles/style-force-ui.css \
       | grep "^[<>]" | wc -l | xargs echo "$style:"
   done
   ```

   Drop the section from nova into `style-force-ui.css` inside the `[FORCE-UI-START] / [FORCE-UI-END]` block for new components.

   **Critical:** style CSS only carries the visual delta. Do NOT `@apply` structural utilities like `scrollbar-thin`, `overflow-y-auto`, `flex`, etc. — those are applied as direct class names in the base TSX and are not defined as `@utility`. `@apply` will fail for any utility not explicitly declared. Keep `@apply` to colors, spacing overrides, and variant-specific properties only.

2. **Create styled TSX files** for the preview app — copy from the nova style in upstream git history:

   ```bash
   # For each new component <name>:
   git show upstream/main:apps/v4/styles/radix-nova/ui/<name>.tsx \
     | sed 's|@/styles/radix-nova/ui/|@/styles/radix-force-ui/ui/|g' \
     > apps/v4/styles/radix-force-ui/ui/<name>.tsx

   git show upstream/main:apps/v4/styles/base-nova/ui/<name>.tsx \
     | sed 's|@/styles/base-nova/ui/|@/styles/base-force-ui/ui/|g' \
     > apps/v4/styles/base-force-ui/ui/<name>.tsx

   # RTL variants:
   git show upstream/main:apps/v4/styles/radix-nova/ui-rtl/<name>.tsx \
     | sed 's|@/styles/radix-nova/ui/|@/styles/radix-force-ui/ui/|g' \
     > apps/v4/styles/radix-force-ui/ui-rtl/<name>.tsx

   git show upstream/main:apps/v4/styles/base-nova/ui-rtl/<name>.tsx \
     | sed 's|@/styles/base-nova/ui/|@/styles/base-force-ui/ui/|g' \
     > apps/v4/styles/base-force-ui/ui-rtl/<name>.tsx
   ```

3. **Commit**:

   ```bash
   git add apps/v4/registry/styles/style-force-ui.css \
           apps/v4/styles/radix-force-ui/ui/ \
           apps/v4/styles/base-force-ui/ui/ \
           apps/v4/styles/radix-force-ui/ui-rtl/ \
           apps/v4/styles/base-force-ui/ui-rtl/
   git commit -m "feat: add force-ui styles for <components>"
   ```

---

## Step 3b — Fix MDX docs for new components

Upstream docs reference demo styles (`radix-rhea`, `base-rhea`, `radix-nova`, etc.) that we strip. Replace all of them:

```bash
grep -rln 'styleName="radix-rhea"\|styleName="base-rhea"\|styleName="radix-nova"\|styleName="base-nova"' apps/v4/content/docs/
```

For each file found, replace with `radix-force-ui` / `base-force-ui`. Then verify nothing remains:

```bash
grep -rn 'styleName=' apps/v4/content/docs/ | grep -v 'force-ui\|new-york-v4'
# must return nothing
```

---

## Step 4 — Rebuild and verify

```bash
pnpm install
node scripts/strip-styles.mjs --check   # must print "check passed"
pnpm --filter=shadcn build              # required before typecheck if preset.ts changed
pnpm --filter=v4 registry:build
pnpm --filter=v4 typecheck
pnpm --filter=preview-ember preview:build  # smoke-test the shared CSS

git add -A
git commit -m "chore: rebuild registry + fix post-merge type errors"
```

**Registry rebuild is NOT needed for CSS-only changes** (`style-force-ui.css`). The registry JSON embeds TSX source, not CSS.

---

## Step 5 — Push and PR

```bash
git push origin chore/sync-upstream-$(date +%Y-%m-%d)
```

Open PR to `main`. Description should list: upstream commits merged, new components, fixes applied.

---

## Key facts for future syncs

- **Closest upstream style:** `style-nova.css` (verify each sync with the diff-count loop above)
- **`style-force-ui.css` = `style-nova.css` + `[FORCE-UI]` additions** — colors, hover tokens (`primary-subtle`, `primary-hover`), extra variants (alert/badge/input/kbd/spinner), `cn-menu-translucent`
- **New components → copy nova section verbatim**, then add `[FORCE-UI]` markers only when customizing
- **Never `@apply` structural utilities** in style CSS — only in `@utility` blocks or direct TSX class names
- **Demo style conflicts** are always resolved by deletion (we stripped them)
- **`pnpm-lock.yaml` conflicts** → always take upstream (`--theirs`)
- **`__components__.tsx` conflicts** → always take ours (`--ours`) — it's auto-generated from our style list
