# Aria Base Review Checklist

This checklist tracks the findings from the review of `shadcn/aria` against
`main`.

## Registry and CLI

- [x] A01 Add Aria documentation links to registry metadata so
      `shadcn docs --base aria` returns useful links.
- [x] A02 Make Calendar import the Aria Select source and declare all registry
      dependencies it installs.
- [x] A03 Declare `input-group` as a Select registry dependency.
- [x] A04 Remove stale unsupported Aria registry artifacts from generated public
      output.
- [x] A05 Align the Aria Chart Recharts dependency with its implementation.

## Component behavior

- [x] A06 Forward `SelectContent` class and positioning props to
      `SelectPopover`.
- [x] A07 Preserve primitive composition props and render-function children in
      Breadcrumb, Checkbox, Radio Group, and Switch.
- [x] A08 Make Dialog dismiss on outside interaction by default.
- [x] A09 Make `AlertDialogAction` close its dialog.
- [x] A10 Give Spinner a consistent root slot and component prop contract.

## Docs, previews, and blocks

- [x] A11 Redirect the Aria Form documentation route to `/docs/forms`.
- [x] A12 Pass the selected preview language to React Aria's `I18nProvider`.
- [x] A13 Remove the Base UI Button import from the Aria weekly fitness block.
- [x] A17 Return component-specific API references from
      `shadcn docs --base aria`.
- [x] A18 Keep links between component docs within the Aria base.
- [x] A19 Repair stale external links in the Aria docs.
- [x] A20 Align the Spinner docs with its dependency-free SVG contract.

## Convention audit follow-up

- [x] A21 Remove the obsolete source-string assertions in `aria.test.ts`.
- [ ] A22 Sync the Vaul Drawer layout and animation classes with the Radix
      base after shared Drawer styles were removed.
- [ ] A23 Give Context Menu its own slots, class hooks, classable trigger, and
      complete `onOpenChange` behavior.
- [ ] A24 Expose the Badge variant through `data-variant` in both render paths.
- [ ] A25 Sync Message Scroller's stable-gutter autoscroll treatment with the
      other bases.
- [ ] A26 Add an accessible name to Combobox Clear and repair the missing
      Combobox Content and Chip List slots and class forwarding.
- [ ] A27 Replace Aria-only direct Lucide usage with `IconPlaceholder`.
- [ ] A28 Add the missing Popover Description slot and audit Aria trigger slots.
- [ ] A29 Rename `BASE_STYLE` to `ARIA_STYLE`, align the example registry
      ordering, and consolidate the split UI export blocks.
- [ ] A30 Remove or relocate this review artifact after the checklist is
      complete so the base directories retain structural parity.

## Repository standards

- [x] A14 Replace invalid CSS-variable Tailwind syntax in Aria source and
      examples.
- [x] A15 Bring the Aria direction utilities in line with UI file conventions.
- [x] A16 Centralize preset base/style parsing to avoid identity drift.

## Previously verified

- [x] Aria is defined as a preset base.
- [x] Preset code versioning does not need a bump because the base is not
      encoded in preset codes.
- [x] CLI `--base aria` parsing, inference, init, apply, and preset tests pass.
- [x] Aria Input styling is present in source and generated styles.
- [x] Aria docs use the updated section heading hierarchy.

## Final verification

- [x] V01 Add or update focused tests for every behavior changed above.
- [x] V02 Run the focused CLI and component checks.
- [x] V03 Rebuild the registry and verify generated Aria output.
- [x] V04 Run `pnpm format:write`.
- [x] V05 Run relevant typechecks and lint checks.
- [ ] V06 Visually verify affected examples at desktop and mobile breakpoints.
      Complete this against the private PR preview because the local Turbopack
      server did not return a response after rebuilding its cache.
