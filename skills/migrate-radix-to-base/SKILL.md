---
name: migrate-radix-to-base
description: Migrates React projects and components from Radix UI to Base UI. Use when asked to migrate from radix, move to base-ui, convert radix primitives, or switch a shadcn project's base library. Handles single components ("migrate accordion") and whole projects.
---

# Radix UI -> Base UI migration

You migrate shadcn wrappers, hand-rolled radix compositions, and their
consumers to `@base-ui/react`, keeping the project buildable at every step.
Be precise; never guess a mapping. When a prop or part is not in these
reference files, check `node_modules/@base-ui/react/**/*.d.ts` before
transforming, and record gaps in the report.

## Preflight (always)

1. `npx shadcn@latest info --json` (or the project's runner): gives the
   current base, STYLE (e.g. `radix-lyra`), tailwind version, aliases,
   installed components, and package manager. Trust it over inference.
2. Detect the package manager (packageManager field / lockfile:
   pnpm-lock.yaml, bun.lock, yarn.lock, package-lock.json) and use IT for
   every install. Never leave a stale lockfile.
3. Require a clean git tree; work on a branch; one commit per component.
4. Baseline check BEFORE touching dependencies: run the project's
   typecheck/build so pre-existing failures are never attributed to you.
5. Install `@base-ui/react` alongside radix. Radix packages are removed only
   after the LAST component is migrated (both coexist fine).

## Strategy: golden pair first, transformation engine second

- **Golden pair via the CLI (preferred).** If the project is shadcn with a
  known style (`radix-<style>`), the shadcn CLI itself is the golden-pair
  executor:
  1. Classify each ui wrapper FIRST: diff the user's file against its stock
     origin, using the components.json style VERBATIM in the URL
     (`https://ui.shadcn.com/r/styles/<style>/<component>.json`,
     files[0].content). This works for prefixed styles (radix-nova) AND
     legacy unprefixed ones (new-york, new-york-v4, default), which are all
     still served.
  2. WHOLE-PROJECT mode: flip `components.json` style `radix-<style>` ->
     `base-<style>` now. PROGRESSIVE mode: do NOT flip yet (the project is
     still mostly radix; the flip happens once, after the last component);
     fetch base variants directly by URL instead
     (`https://ui.shadcn.com/r/styles/base-<style>/<component>.json`).
  3. PRISTINE wrappers, whole-project mode: `shadcn add <component>
     --overwrite` delivers the base variant with the project's exact
     icon/font/preset resolution. Never bulk `--all --overwrite`; go
     component by component, or you drown in unrelated registry version
     drift. PROGRESSIVE mode: never use `--overwrite` (it destroys the
     original that consumers still import); write the fetched base variant
     content to `<component>-base.tsx` instead.
  4. CUSTOMIZED wrappers: fetch the base variant and replay the user's diff
     onto it (their customizations must SURVIVE; `--overwrite` would destroy
     them). Mechanical implementation that works at scale:
     `git merge-file user.tsx radix-golden.tsx base-golden.tsx` (three-way
     merge, radix golden as ancestor) auto-resolves most files; hand-resolve
     conflicts with the reference tables.
  5. MANDATORY leftover sweep on EVERY golden-pair file, including ones that
     merged "clean": `grep -n "radix-ui\|@radix-ui\|IconPlaceholder"` per
     file. The registry sometimes reorders functions between variants, which
     makes three-way merges report zero conflicts while leaving stale radix
     hunks in place. A clean merge is NOT proof of a clean file.
  This is more reliable than reconstructing transforms; use it whenever the
  pair exists. Consumer/app code has no CLI mechanism: always hand-migrate it
  against `consumer-props.md`.
- **Legacy styles (new-york, new-york-v4, default): classification only, no
  replay.** These have no base counterpart (there is no base-new-york), and
  retargeting onto a base-<style> variant would restyle the user's app. Use
  the radix golden ONLY to detect customizations, then run the transformation
  engine on the user's OWN file: rewire primitives, keep their exact classes,
  apply class-mapping renames. Their look stays theirs. At the end of a
  legacy whole-project migration, FLAG (do not fix): the style name still
  reads as radix to the CLI, so future `shadcn add` will deliver radix
  variants; the user decides whether to switch style or add manually.
- **Transformation engine (fallback).** Hand-rolled radix code, non-shadcn
  projects, unknown styles: transform using `universal-patterns.md` (imports
  in BOTH forms: `radix-ui` and `@radix-ui/react-*`; asChild->render with the
  worked example; Portal>Positioner>Popup; the positioner FORWARD rule; part
  renames), the per-family props tables (`overlays.md`, `menus.md`,
  `form-controls.md`, `disclosure.md`, `display-misc.md`), `class-mapping.md`
  for data-attribute/CSS-var rewrites, and `wrapper-shapes.md` for exact
  target shapes (tooltip arrow, SubContent defaults, select anatomy).

## Modes

**Progressive (default).** "Migrate accordion" = one component, strangler-fig:
1. Detect in-progress state first: an existing `<component>-base.tsx`,
   consumers split between old/new imports. The files ARE the state; resume,
   never restart.
2. If the component imports other ui wrappers still on radix (select ->
   button), STOP and recommend migrating those first, bottom-up.
3. Write the migrated version to `<component>-base.tsx` (original untouched;
   golden-pair content fetched by URL, or transformed by hand, per the
   strategy above); typecheck. Repoint consumers ONE AT A TIME (imports + the
   call-site props in `consumer-props.md`); typecheck each. When no consumer
   imports the original: delete it, rename `-base` -> original, flip imports
   back, final check, commit. When the LAST radix wrapper in the project is
   finalized, flip `components.json` to `base-<style>` and remove radix deps.

**Whole project** (only when explicitly asked): same per-component work in
dependency order (leaf/shared wrappers like button and label first). After
wrappers, sweep ALL app code against `consumer-props.md` — the call-site
break surface is much larger than asChild. Then remove radix deps, install,
full build.

## Hard rules

- NEVER touch non-radix libraries or their wrappers: cmdk (command), vaul
  (drawer), sonner, input-otp, react-day-picker (calendar), recharts (chart).
  Report them as intentionally untouched.
- No Base UI counterpart: AspectRatio -> CSS aspect-ratio div; Label ->
  native `<label>`; VisuallyHidden -> `sr-only`; Direction -> Direction
  Provider (`direction` prop, not `dir`). Popover Anchor and NavigationMenu
  Indicator have no equivalent: inert passthrough + flag.
- `button.tsx` migrates to the REAL `@base-ui/react/button` primitive, never
  a hand-rolled useRender wrapper.
- Behavior deltas are FLAGGED, never silently patched (tabs manual
  activation, menu items not closing on click, nav-menu 50ms delay). The
  target is idiomatic Base UI matching the shadcn base registry.
- Honest reporting: skipped/reverted files are listed as flagged, never as
  migrated. Pre-existing failures are named as pre-existing.

## Verify and report

Typecheck per file, build per batch, full build at the end vs the baseline.

Reports live in a `.migration/` directory at the project root, ONE FILE PER
COMPONENT: `.migration/<component>.md` (e.g. `.migration/accordion.md`).
Rules:
- Each run writes (or fully overwrites) the file for each component it
  migrated. Re-running a component replaces its report; never touch other
  components' files.
- A multi-component run ("migrate alert-dialog and dropdown-menu") writes one
  file per component, each self-contained; shared consumer-sweep notes are
  repeated in every affected file.
- Whole-project mode writes the per-component files plus
  `.migration/project.md` (dependency swap, app-code sweep summary, final
  build result).
- There is NO index file. Migration status is derived from disk, not
  maintained: scan the project's ui directory (the `ui` alias from shadcn
  info, e.g. components/ui or src/components/ui) for remaining radix imports
  when asked "what's left". End every run's summary with that derived count
  ("N wrappers remain on Radix").

Each `.migration/<component>.md` uses EXACTLY this structure (it is
documented publicly; reports must match it):

```md
# <component>

<date, strategy used (golden pair via CLI / merge / engine), one-line verdict>

## Changed

<every file touched, with what changed and why; include file:line for
anything notable. Confirm the leftover scan is clean:
grep -n "radix-ui\|@radix-ui" on this component's files>

## Left alone

<files that look related but were intentionally not touched, with the reason
(cmdk/vaul/sonner are not radix; unrelated drift; etc.)>

## Behavior changes

<differences that compile fine but act differently; flagged, never patched
(tabs activation, menu close-on-click, delays...). Empty section if none>

## Verify by hand

<short manual QA checklist for this primitive family: focus return on
dialogs, keyboard nav + typeahead on menus/select, tooltip delay feel,
slider commit events. Concrete steps, one minute of clicking>
```
