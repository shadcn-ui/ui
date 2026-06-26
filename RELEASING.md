# Releasing

This monorepo publishes two packages independently with [Changesets](https://github.com/changesets/changesets):

- **`shadcn`** — the CLI and tooling.
- **`@shadcn/react`** — headless React primitives.

They version on their own lines. A change to one never bumps the other unless a changeset says so.

## 1. Add a changeset

Every change that should publish needs a changeset. Run:

```sh
pnpm changeset
```

Select the affected package(s) and bump level. One PR can carry separate changesets for `shadcn` and `@shadcn/react` at different levels. A PR with no changeset publishes nothing.

## 2. Stable release

Stable releases are automated by `.github/workflows/release.yml` (the `release` job, on push to `main`):

1. Merged changesets accumulate on `main`.
2. The Changesets action opens/updates a **"Version Packages"** PR that bumps versions and writes changelogs.
3. Merging that PR triggers `changeset publish`, which builds all packages (`pnpm build:packages`) and publishes any whose version is ahead of npm — each to the `latest` tag.

`pnpm build:packages` (`turbo run build --filter=./packages/*`) builds `shadcn` and `@shadcn/react` but never `apps/v4`.

## 3. Prereleases (per-PR snapshots)

Add the **`release: beta`** or **`release: rc`** label to a PR. The `prerelease` job in `release.yml`:

1. Verifies the branch has changesets (a label on the version PR is a no-op, since it consumed them).
2. Runs `changeset version --snapshot <channel>` — stamps a unique `0.0.0-<channel>-<timestamp>` on each changeset'd package.
3. Builds and runs `changeset publish --tag <channel> --no-git-tag`.
4. Uploads the published package list; `prerelease-comment.yml` posts a `pnpm dlx` install line per package and removes the label.

The label selects the **dist-tag/channel**; the **changesets on the branch** select which packages publish. Snapshots are timestamped, so they never touch `latest` and never collide.

```sh
# Install a snapshot from the PR comment, e.g.:
pnpm dlx @shadcn/react@0.0.0-beta-20260624120000
```

## 4. Prerelease trains (sustained `-beta.N` / `-rc.N`)

For a baking release line (e.g. `1.0.0-rc.0`, `-rc.1`, …) rather than throwaway snapshots, use Changesets pre mode:

```sh
pnpm changeset pre enter rc   # writes .changeset/pre.json
# ...normal changeset + Version PR cycle now produces -rc.N versions on the rc tag...
pnpm changeset pre exit       # back to stable; next Version PR ships X.Y.Z on latest
```

## Notes

- `pnpm-workspace.yaml` sets `minimumReleaseAge: 2880` (48h), so freshly published stable/beta versions take time to resolve in normal installs. Use `pnpm dlx <pkg>@<exact-snapshot-version>` to test immediately.
- Publishing uses npm OIDC/provenance (`id-token: write` + `npm@latest`); no `NPM_TOKEN` secret is needed.
