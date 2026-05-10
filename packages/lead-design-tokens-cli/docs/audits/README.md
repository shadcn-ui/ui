# Spec audits

Read-only Lane 3 (advisory) audit reports comparing Lead React component APIs
to their Figma source surface. See
[`docs/figma-to-code-automation-roadmap.md`](../../../../docs/figma-to-code-automation-roadmap.md)
for the lane definition.

## Scope

This directory currently contains a **Button-only** prototype (JES-77):

- Generator: [`scripts/audit-button-spec.mjs`](../../scripts/audit-button-spec.mjs)
- Report: [`button-spec-audit.md`](./button-spec-audit.md)
- Command: `npm run audit:button-spec --prefix packages/lead-design-tokens-cli --workspaces=false`

The prototype is intentionally narrow:

- Reads two local files only — `Button.tsx` and `Button.figma.tsx`. No Figma API calls.
- Hard-coded paths. Adding another component is a deliberate follow-up ticket,
  not a flag or glob change here.
- Read-only. Never edits production code, never opens automated code-change PRs.
- Exact-name comparison only — no fuzzy matching, no suggestions.

## Adding more components

Don't generalize this script speculatively. When the next component is in scope,
file a new ticket and either (a) duplicate the script for that component or
(b) refactor into a shared module — whichever the next concrete use case
actually demands. Per the repo's "no premature abstraction" rule, two
components is the earliest point where shared structure is worth extracting.
