# Contributing

Thanks for contributing to the Lead Design System.

## Repository

This is a pnpm and Turborepo monorepo. The Lead-owned surface lives in:

- `packages/lead-design-tokens-cli/` - the token pipeline for import, normalize, lint, build, and decision checks.
- `docs/figma-to-code-sync.md` - the Figma-to-code release process.
- `figma.config.json` and `.github/workflows/figma-code-connect.yml` - Figma Code Connect publishing.

Other workspaces in this repo are inherited from the upstream component-library scaffold and are under review. Please coordinate with the Design Systems team before changing them.

## Development

Install root workspace dependencies and the isolated token CLI dependencies:

```bash
pnpm install
npm ci --prefix packages/lead-design-tokens-cli --workspaces=false
```

Run the Lead token checks:

```bash
pnpm lead:tokens:test
pnpm lead:tokens:lint-schemas
pnpm lead:tokens:check-decisions
```

## Commit Convention

Use Conventional Commits: `type(scope): description`.

Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, and `ci`.

Example: `feat(tokens): add semantic surface color decisions`.

## Pull Requests

- Keep PRs focused on one logical change.
- Run `pnpm check` and the Lead token checks before requesting review.
- Reference related design decisions (`[D##]`) in the PR description when changing tokens or token governance.
