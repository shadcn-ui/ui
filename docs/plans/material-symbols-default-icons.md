# Plan: Material Symbols as the default Force UI icon library

## Goal
Make `material-symbols` (sourced from `@material-symbols/svg-400`, **rounded, unfilled**,
weight 400) the **default** icon library for the Force UI registry across **all
frameworks** (React radix+base, Vue, Svelte, Ember). Lucide and the other four
libraries stay selectable. SVGs are wrapped into components via SVGR (React) /
each framework's iconify equivalent.

## Decisions locked (from grilling)
1. **Wrapper, not a component package** — wrap raw svg-400 SVGs into components (SVGR for React).
2. **Per-call-site props** — inject `materialSymbols="..."` into all 1808 `<IconPlaceholder>` sites (codemod), matching the existing per-library pattern.
3. **Variant** — rounded, unfilled.
4. **Additive** — add as the 6th library, flip defaults; do not remove lucide.
5. **Scope** — all frameworks.
6. **Name map** — script-assisted draft validated against the svg-400 `rounded/` file list; hand-fix misses; one committed source-of-truth map.

## Current architecture (facts)
- `packages/shadcn/src/icons/libraries.ts` — 5 libraries; each `{ name, title, packages, import, usage, export }`. All are React named-export packages.
- `apps/v4/registry/bases/{radix,base}` — components use `<IconPlaceholder lucide="X" tabler="Y" .../>`. **1808 usages, 172 distinct lucide names.**
- `apps/v4/scripts/build-icons.ts` — scans `IconPlaceholder` usages, generates `apps/v4/registry/icons/__{lib}__.ts` barrels (`export { X } from "<export>"`).
- `apps/v4/registry/icons/{icon-{lib}.tsx, create-icon-loader.tsx}` — preview renderers (lazy-load barrels).
- `packages/shadcn/src/utils/transformers/transform-icons.ts` — at registry-build/CLI-install, rewrites `<IconPlaceholder .../>` to real `<Icon/>` + import using the selected library's `import`/`usage` patterns.
- `apps/v4/registry/config.ts` — `DEFAULT_CONFIG.iconLibrary = "lucide"`; both `force-ui` presets pin lucide.
- `apps/v4/app/(app)/create/components/{icon-placeholder.tsx, icon-library-picker.tsx}` — preview component + picker (per-library SVG logos).
- Ports: Vue preview `IconPlaceholder.vue` resolves `lucide-vue-next` only; Svelte `icon-placeholder.svelte` is a `SquareIcon` stub; Ember `.gts` import lucide directly via `~icons/lucide/*` (unplugin-icons / iconify).

## Consumer distribution model (decided)
**Push SVGR setup onto consumers.** `transform-icons` emits
`import X from "@material-symbols/svg-400/rounded/x.svg?react"` (+ `<X />` usage);
the `?react` query is the SVGR convention (vite-plugin-svgr) that yields a React
component. The consumer's bundler must have SVGR configured to honor `?react`. `@material-symbols/svg-400` is a
real runtime dependency listed in the registry item. Simplest for us; consumers
without SVGR get a build error (documented).

→ Implication: registry-base docs / `init` instructions must tell consumers to
install + configure SVGR (vite-plugin-svgr / @svgr/webpack / Next config).

---

## Phases

### Phase 0 — Name map (accuracy gate, do first)
- Add `@material-symbols/svg-400` as a dev dependency.
- Write `apps/v4/scripts/build-material-symbols-map.ts`:
  - Read 172 distinct `lucide="..."` names from `registry/bases`.
  - Generate candidates: strip `Icon` suffix → kebab/snake heuristics + a small alias table for known divergences (BadgeCheck→verified, ShieldAlert→gpp_maybe, etc.).
  - Validate each candidate against actual filenames in `@material-symbols/svg-400/rounded/`.
  - Emit a report: confident matches vs misses.
- Hand-curate misses. Commit `apps/v4/registry/icons/material-symbols-map.json` (`lucide name → ms name`) as the single source of truth.
- **Check:** assert every value in the map exists as a file in `rounded/`; assert all 172 lucide names are covered. Runnable `--check` mode for CI.

### Phase 1 — Register the library
- Add `materialSymbols` entry to `packages/shadcn/src/icons/libraries.ts`: `name`, `title: "Material Symbols"`, `packages: ["@material-symbols/svg-400"]`, `export: "@material-symbols/svg-400/rounded"`, `import: "import ICON from '@material-symbols/svg-400/rounded/NAME.svg?react'"`, `usage: "<ICON />"`. The import is **default**, path-based, with the `?react` SVGR query — not a named export. `transform-icons`/`build-icons` handle this shape specially (see Phase 3).
- Update tests: `packages/shadcn/test/...`, `apps/v4/registry/config.test.ts`.

### Phase 2 — Inject props (codemod)
- Codemod over `registry/bases/**/*.tsx`: for each `<IconPlaceholder>`, add `materialSymbols="<mapped>"` using the Phase 0 map. Idempotent; report any call site whose lucide name is missing from the map.
- **Check:** re-run finds 0 `IconPlaceholder` without a `materialSymbols` prop.

### Phase 3 — React rendering + transform
- **Preview app needs SVGR too** — configure SVGR in `apps/v4` (next.config / turbopack) so the create app can render `.svg` imports.
- Icon loader: add `icon-material-symbols.tsx` + extend `create-icon-loader.tsx` to render the default-imported SVG components. Extend `build-icons.ts` to generate `__materialSymbols__.ts` re-exporting per-icon default SVG imports (`export { default as <key> } from "@material-symbols/svg-400/rounded/<name>.svg"`).
- Wire `IconPlaceholder` (`apps/v4/app/(app)/create/components/icon-placeholder.tsx`): add lazy renderer + `iconLibrary === "materialSymbols"` branch.
- Extend `transform-icons.ts`: the existing `import`/`usage` parsing assumes a named import from a single module. The path-based default `.svg` import is a new shape — add handling so it emits one `import Name from "@material-symbols/svg-400/rounded/<name>.svg"` per icon. Add transformer tests.
- **Check:** snapshot test — a known `<IconPlaceholder>` transforms to valid, compiling output.

### Phase 4 — Make it the default
- `apps/v4/registry/config.ts`: `DEFAULT_CONFIG.iconLibrary = "materialSymbols"`; both `force-ui` presets → `materialSymbols`; update `description` strings ("… / Material Symbols / …").
- Tag every touched upstream-owned line/block with `[FORCE-UI]` markers per CLAUDE.md.

### Phase 5 — Picker UI
- `icon-library-picker.tsx`: add Material Symbols entry + logo SVG.

### Phase 6 — Framework ports

**Status:** DONE — all ports unified on @material-symbols/svg-400, each builds clean.
- Ember (6a'): unplugin-icons FileSystemIconLoader -> `~icons/ms/<base>` (reworked off iconify).
- Vue (6b): vite-svg-loader `?component`; placeholder via inline registry.
- Svelte (6c): unplugin-icons FileSystemIconLoader -> `~icons/ms/<base>`; placeholder via inline registry.
Each uses a validated lucide->svg-400 basename map + a `check` guard, and forces
`fill="currentColor"` (svg-400 ships no fill).

Iconify variant convention (validated): rounded-unfilled = `<name>-outline-rounded`;
icons with no fill variant only have `<name>-rounded` (unfilled-equivalent); a few
icons ship only plain `<name>` (outlined). Preference order: `-outline-rounded` →
`-rounded` → plain. Names differ from svg-400 basenames, so each port validates
against `@iconify-json/material-symbols`.

Vue/Svelte each have TWO mechanisms to convert:
- `<IconPlaceholder>` files (Vue 91, Svelte 66): inject `materialSymbols="..."`
  (mirror React Phase 2) + make the placeholder resolve MS at runtime via
  `@iconify/vue` / iconify-svelte (dynamic name).
- direct framework-lucide imports (Vue 162 `lucide-vue-next`, Svelte 187
  `@lucide/svelte/icons/*`): add unplugin-icons + `@iconify-json/material-symbols`,
  codemod imports → `~icons/material-symbols/<name>` (identifier kept, markup
  unchanged). Needs a lucide-export-name → iconify map (handle both `Search` and
  `SearchIcon` forms).
- **Vue** (`apps/preview-vue` + `packages/registry-vue`): add MS resolution to `IconPlaceholder.vue` (iconify `@iconify-json/material-symbols` / `~icons/material-symbols/*`), default to MS. Map lucide→MS via Phase 0 map (rounded variant ⇒ `*-rounded` iconify names).
- **Svelte** (`apps/preview-svelte` + `packages/registry-svelte`): replace the stub to actually resolve names; add MS via iconify; default to MS.
- **Ember** (`packages/registry-ember`): swap `~icons/lucide/*` imports to `~icons/material-symbols/*-rounded` in `.gts`; add the iconify json dep; verify unplugin-icons resolves them.
- Note: ports use **iconify's** material-symbols set, not `@material-symbols/svg-400` (svg-400 is the React/SVGR source). Same icon names, framework-native delivery.
- **Check:** each preview app builds; spot-check rendered icons.

### Phase 7 — Build, regen, verify
- `pnpm --filter=v4 registry:build`; rebuild icons.
- `grep -rn "\[FORCE-UI\]" apps/v4/` sanity.
- `pnpm --filter=v4 typecheck && pnpm --filter=v4 lint && pnpm test`.
- Visual spot-check the create app with Material Symbols selected (now default).

## Risks
- **Distribution model** (open decision) gates Phase 3 — resolve first.
- **Mapping gaps:** some lucide icons have no clean MS equivalent; misses need human judgement (Phase 0 surfaces them).
- **svg-400 vs iconify drift:** React uses svg-400 files; ports use iconify — names mostly align but verify the rounded suffix convention per ecosystem.
- **Upstream merge surface:** `libraries.ts`, `config.ts`, `transform-icons.ts`, `IconPlaceholder` are upstream-owned → mark with `[FORCE-UI]`, expect future merge conflicts.
</content>
</invoke>
