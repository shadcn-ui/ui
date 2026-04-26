# Lead Paper Token Library

This folder is the paper-authored source of truth for the token system.

The Markdown files in `sections/` explain intent, review decisions, and give humans a comfortable place to work. The canonical machine-readable source is `tokens.paper.json`; the CLI validates and snapshots that file during `design-tokens import`.

## Edit Order

1. Update the relevant Markdown section in `sections/`.
2. Update `tokens.paper.json` with the matching structured token value.
3. Run `design-tokens import --source tokens/source/paper --force`.
4. Commit the updated source and raw snapshot together.

## Sections

- `01-primitives.md` — raw color and number vocabulary.
- `02-semantic.md` — foundation, feedback, and interactive meaning.
- `03-spacing-radius.md` — gap, padding, and radius scales.
- `04-typography.md` — roles, sizes, line heights, and current drifts.
- `05-accessibility.md` — approved foreground/background pair policy.
- `06-components-domain.md` — deferred component and domain namespaces.
