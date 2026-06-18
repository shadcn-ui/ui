---
name: review-force-ui-variants
description: Review Force UI components for the recurring "variant axis added but never wired up" class of bug — variant/size/color props that render identically because their CSS is missing, plus cross-framework drift, preview theme drift, and example/doc wiring gaps. Use when reviewing a component, after adding a variant, or when "all variants look the same".
---

# Review: Force UI variant & wiring mistakes

A recurring failure mode in this fork: a variant axis (`variant`, `color`, `size`, status
colors, solid colors…) is added to a component's `cva` map **and** documented, but the
actual styling is never implemented — so every value renders identically and the build
still passes. This skill audits for that and the related wiring gaps.

> Source of truth for what a variant should *look like*: the Angular port at
> **`/opt/dev/pd-p4one/app/src/app/ui/<comp>/<comp>.variants.ts`**. It carries the full
> token-only utility strings inline. An **empty** value there (e.g. `sm: ''`) means that
> value is the default and intentionally has no extra classes — NOT a bug.

## How styling is wired here (so you know what "missing" means)

- React components live in `apps/v4/registry/bases/{radix,base}/ui/<comp>.tsx`; framework
  ports in `packages/registry-{vue,svelte,ember}/ui/<comp>/`.
- Their `cva` maps reference **marker classes** like `cn-<comp>-variant-<name>`,
  `cn-spinner-color-primary`, `cn-input-group-button-size-sm`.
- The real utilities for those markers live in
  **`apps/v4/registry/styles/style-force-ui.css`** as `.cn-… { @apply … }`. This file is
  shared by all five frameworks. If a referenced marker class has **no rule** there (and
  isn't an intentional empty default), the variant is a silent no-op.
- Some marker classes are deliberately styleless **slot hooks** (`cn-pagination-link`,
  `cn-alert-dialog-action`, `cn-combobox-clear`, `cn-sidebar-trigger`, `cn-breadcrumb`) —
  their appearance comes from a composed component (e.g. a Button). Those are fine.

## Check 1 — referenced variant class with no CSS (the main bug)

```bash
CSS=apps/v4/registry/styles/style-force-ui.css
grep -oE '\.cn-[a-zA-Z0-9-]+' "$CSS" | sed 's/^\.//' | sort -u > /tmp/cn-defined.txt
grep -rhoE '"cn-[a-zA-Z0-9-]+"' apps/v4/registry/bases/{radix,base}/ui/ | tr -d '"' | sort -u > /tmp/cn-ref.txt
comm -23 /tmp/cn-ref.txt /tmp/cn-defined.txt   # referenced but undefined
```

For each result, decide:
- **Real bug** if it's a `-variant-*`, `-color-*`, `-size-*` axis whose siblings render
  differently (e.g. `cn-spinner-color-primary` with no rule → all spinners one colour).
  Confirm by checking the cva: if two sibling values map to bare classes with no CSS, they
  look identical.
- **Intentional** if pd-p4one's `.variants.ts` has that value as `''` (a default), or it's
  a styleless slot hook (see list above).

Fix a real bug by adding the rule to `style-force-ui.css`, **placed after the base
`.cn-<comp>` block** (so it wins on the cascade), porting pd-p4one's utilities verbatim:

```css
.cn-input-variant-filled {
  @apply border-border bg-muted hover:border-input dark:bg-muted;
}
```

Note: if the base `.cn-<comp>` already bakes in `border-input` / `dark:bg-input/30`, a
variant that wants a different border/bg must re-declare it (and its `dark:` form) so it
overrides — equal specificity, later source wins.

## Check 2 — cross-framework variant drift

The variant *set* must match across React (radix+base) and the ports. Two failure shapes:

```bash
# Same variant axis, different value sets between frameworks:
for fw in radix base; do echo "== $fw =="; grep -oE 'cn-badge-variant-[a-z-]+' apps/v4/registry/bases/$fw/ui/badge.tsx | sort -u; done
for fw in vue svelte ember; do echo "== $fw =="; grep -rhoE 'cn-badge-variant-[a-z-]+' packages/registry-$fw/ui/badge/ | sort -u; done
```

- A value present in React but missing from a port (or vice versa) is drift — add it.
- **Inline-vs-class drift**: some ports inline the utilities on the marker
  (`outline: "cn-input-group-variant-outline border-input rounded-md border …"`) while
  React uses the bare class. Normalise to the bare class so everyone shares the
  `style-force-ui.css` rule; otherwise they render differently (and one is unmaintained).

## Check 3 — CSS uses a colour the preview apps don't know

A status/semantic colour utility (`bg-success`, `text-info`, `bg-*-subtle`, `*-solid`,
`on-*`) must be mapped in the `@theme inline` block of **both** `apps/v4/app/globals.css`
**and** each `apps/preview-{vue,svelte,ember}/src/styles.css`. If a preview lacks it, that
preview's Vite build dies with `Cannot apply unknown utility class bg-success`.

```bash
for fw in vue svelte ember; do echo "== $fw =="; grep -c 'color-success:' apps/preview-$fw/src/styles.css; done
```

Fix by running the theme sync (it mirrors globals' whole `@theme inline` block into the
previews and re-emits the `:root`/`.dark` palette):

```bash
cd apps/v4 && npx tsx --tsconfig ./tsconfig.scripts.json ./scripts/sync-theme-css.mts
```

## Check 4 — example/doc wiring (see also /write-component-example)

- A React doc must point at a bare demo in `apps/v4/examples/`, **never** a gallery
  `*-example` name (that silently renders `Example`/`ExampleWrapper` chrome via the
  registry fallback). Grep: `grep -rn 'name="[a-z-]*-example"' apps/v4/content/docs/components/{radix,base}/`.
- A framework `ComponentPreview` resolves to a hand-maintained preview file
  `apps/preview-{fw}/src/{fw}/<name>.{vue,svelte,gts}` — the registry example file alone
  is not enough. Confirm each `name=` has a preview file.
- Coverage must not diverge: a demo in React should exist for vue/svelte/ember too.

## Check 5 — build the only way that actually validates

```bash
pnpm --filter=v4 build
```

This runs the registry build, the three preview Vite builds (catches unknown-utility CSS
and broken preview files), and the Next build (compiles every MDX doc). `registry:build`
alone does **not** catch preview/CSS errors.

## Report format

For each finding: `component` · `class/variant` · `frameworks affected` · **bug** vs
**intentional** (with the pd-p4one evidence) · proposed fix. Lead with confirmed bugs.
