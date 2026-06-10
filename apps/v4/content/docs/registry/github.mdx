---
title: GitHub Registries
description: Use a public GitHub repository as a registry.
---

You can now turn **any public GitHub repository into a registry.**

Add a `registry.json` file to the root of the repo, describe the files you want
to share, and users can install them with the `shadcn` CLI.

```bash
npx shadcn@latest add <username>/<repo>/<item>
```

You do not need to set up a registry server or publish generated JSON files. **The GitHub repository becomes the source registry.**

## Distribute Anything

Registry items are **not limited to components or React code.** They can include
any files from your repository: source files, configuration, docs, templates,
workflows, rules or project conventions.

<div className="not-prose my-6 overflow-hidden rounded-lg border text-sm">
  <div className="hidden grid-cols-[220px_1fr] border-b bg-muted/50 px-4 py-3 font-medium md:grid">
    <div>Use case</div>
    <div>Example files</div>
  </div>
  {[
    ["Components", "components/date-picker.tsx", "components/data-table.tsx"],
    [
      "Helpers and utilities",
      "lib/format-date.ts",
      "lib/cn.ts",
      "hooks/use-copy.ts",
    ],
    [
      "Design system packages",
      "tokens/colors.json",
      "styles/theme.css",
      "components/*",
    ],
    [
      "Feature kits",
      "app/(auth)/*",
      "lib/auth.ts",
      "components/login-form.tsx",
    ],
    ["Agent workflows", "AGENTS.md", ".cursor/rules/*", ".claude/commands/*"],
    [
      "Project conventions",
      ".editorconfig",
      "biome.json",
      "docs/conventions.md",
    ],
    [
      "Codemods and migration kits",
      "codemods/*",
      "scripts/migrate.ts",
      "docs/migration.md",
    ],
    ["Testing setup", "vitest.config.ts", "test/setup.ts", "docs/testing.md"],
    [
      "CI and release workflows",
      ".github/workflows/ci.yml",
      ".github/workflows/release.yml",
    ],
    [
      "Project automation",
      "scripts/release.ts",
      "scripts/checks.ts",
      "docs/automation.md",
    ],
    [
      "Issue and pull request templates",
      ".github/ISSUE_TEMPLATE/*",
      ".github/pull_request_template.md",
    ],
    ["MCP configuration", ".mcp.json", ".cursor/mcp.json"],
  ].map(([label, ...files]) => (
    <div
      className="grid gap-2 border-b px-4 py-3 last:border-b-0 md:grid-cols-[220px_1fr]"
      key={label}
    >
      <div className="font-medium">{label}</div>
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {files.map((file) => (
          <code key={file}>{file}</code>
        ))}
      </div>
    </div>
  ))}
</div>

## When to use GitHub

Use a GitHub registry when:

- You already have reusable code in a public GitHub repository.
- You want users to install directly from `owner/repo/item`.
- You want to distribute config files, rules, docs, templates, utilities or
  any other files from the same repository.
- You do not need private repo access or custom request authentication.

## Requirements

A GitHub registry must:

- Be a public `github.com` repository.
- Have a `registry.json` file at the repository root.
- Use valid `registry.json` and `registry-item.json` schemas.
- Reference source files that exist in the repository.

Private repositories and GitHub Enterprise hosts are not currently supported by
GitHub addresses. For private or authenticated registries, use a
[namespace](/docs/registry/namespace) with
[authentication](/docs/registry/authentication).

## Step 1: Add registry.json

Given an existing public repository:

```txt
.
├── ...
├── .editorconfig
├── AGENTS.md
└── docs
    └── conventions.md
```

Add `registry.json` at the root of the repository.

```txt
.
├── ...
├── registry.json
├── .editorconfig
├── AGENTS.md
└── docs
    └── conventions.md
```

Define the item you want to distribute.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "project-conventions",
      "type": "registry:item",
      "title": "Project Conventions",
      "description": "Shared project conventions, editor settings and agent instructions.",
      "files": [
        {
          "path": "AGENTS.md",
          "type": "registry:file",
          "target": "~/AGENTS.md"
        },
        {
          "path": ".editorconfig",
          "type": "registry:file",
          "target": "~/.editorconfig"
        },
        {
          "path": "docs/conventions.md",
          "type": "registry:file",
          "target": "~/docs/conventions.md"
        }
      ]
    }
  ]
}
```

Commit and push the file.

```bash
git add registry.json
```

```bash
git commit -m "add registry"
```

```bash
git push
```

Users can now install the item from GitHub.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

## Step 2: Distribute any file

A registry item can install one file or many files. Use the `files` array to
declare the files that belong together.

For example, a testing setup can install a Vitest config, a setup file and a
short team guide.

```txt
registry.json
config
└── vitest.config.ts
docs
└── testing.md
test
└── setup.ts
```

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "vitest-setup",
      "type": "registry:item",
      "title": "Vitest Setup",
      "description": "A Vitest setup with project defaults and docs.",
      "files": [
        {
          "path": "config/vitest.config.ts",
          "type": "registry:file",
          "target": "~/vitest.config.ts"
        },
        {
          "path": "test/setup.ts",
          "type": "registry:file",
          "target": "~/test/setup.ts"
        },
        {
          "path": "docs/testing.md",
          "type": "registry:file",
          "target": "~/docs/testing.md"
        }
      ]
    }
  ]
}
```

Users install it the same way.

```bash
npx shadcn@latest add acme/toolkit/vitest-setup
```

Use `target` when a file should be written to a specific destination in the
user's project.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "editorconfig",
      "type": "registry:file",
      "files": [
        {
          "path": "config/.editorconfig",
          "type": "registry:file",
          "target": "~/.editorconfig"
        }
      ]
    }
  ]
}
```

```bash
npx shadcn@latest add acme/toolkit/editorconfig
```

## Step 3: Validate the registry

Before sharing the registry, validate it from the CLI.

```bash
npx shadcn@latest registry validate acme/toolkit
```

The command reads the root `registry.json`, resolves includes, validates the
registry items, and checks that referenced files exist.

You can also validate a branch, tag or commit SHA.

```bash
npx shadcn@latest registry validate acme/toolkit#v1.0.0
```

## Step 4: List and search items

Use `list` to see every item in the repository registry.

```bash
npx shadcn@latest list acme/toolkit
```

Use `search` to filter the catalog.

```bash
npx shadcn@latest search acme/toolkit --query conventions
```

Use `view` to inspect one item payload.

```bash
npx shadcn@latest view acme/toolkit/project-conventions
```

## Organize with include

For larger repositories, keep item definitions close to the source files they
describe.

```txt
registry.json
config
├── prettier.config.mjs
└── registry.json
rules
├── agent.md
└── registry.json
```

The root `registry.json` can include the nested registry files.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "include": ["config/registry.json", "rules/registry.json"]
}
```

The included registry file declares items for that directory.

```json title="rules/registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "items": [
    {
      "name": "agent-rules",
      "type": "registry:file",
      "files": [
        {
          "path": "agent.md",
          "type": "registry:file",
          "target": "~/AGENTS.md"
        }
      ]
    }
  ]
}
```

When using `include`, file paths are relative to the `registry.json` file that
declares the item.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

## Registry dependencies

Use `registryDependencies` when one registry item depends on another registry
item.

### Same repository dependencies

For dependencies in the same GitHub repository, use the full GitHub item
address.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "project-setup",
      "type": "registry:item",
      "registryDependencies": [
        "acme/toolkit/agent-rules",
        "acme/toolkit/prettier-config",
        "acme/toolkit/tsconfig"
      ],
      "files": [
        {
          "path": "docs/project-setup.md",
          "type": "registry:file",
          "target": "~/docs/project-setup.md"
        }
      ]
    }
  ]
}
```

A docs item can depend on a template item from the same repository.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "contributing-guide",
      "type": "registry:item",
      "registryDependencies": ["acme/toolkit/readme-template"],
      "files": [
        {
          "path": "docs/contributing.md",
          "type": "registry:file",
          "target": "~/docs/contributing.md"
        }
      ]
    }
  ]
}
```

A CI setup can depend on the same formatting and testing defaults that users can
install separately.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "ci-setup",
      "type": "registry:item",
      "registryDependencies": [
        "acme/toolkit/prettier-config",
        "acme/toolkit/vitest-setup"
      ],
      "files": [
        {
          "path": ".github/workflows/ci.yml",
          "type": "registry:file",
          "target": "~/.github/workflows/ci.yml"
        }
      ]
    }
  ]
}
```

### External registry dependencies

Items can also depend on external registries. Use the full item address for the
registry that owns the dependency.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "workspace-setup",
      "type": "registry:item",
      "registryDependencies": [
        "@acme/tsconfig",
        "contoso/devtools/prettier-config"
      ],
      "files": [
        {
          "path": "docs/workspace.md",
          "type": "registry:file",
          "target": "~/docs/workspace.md"
        }
      ]
    }
  ]
}
```

### Dependency refs

Refs are not inherited across dependencies. If a dependency should be pinned,
include its own ref.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "items": [
    {
      "name": "project-setup",
      "type": "registry:item",
      "registryDependencies": [
        "acme/toolkit/agent-rules#v1.0.0",
        "acme/toolkit/tsconfig#c0ffee254729296a45d6691db565cf707a3fef5d"
      ],
      "files": [
        {
          "path": "docs/project-setup.md",
          "type": "registry:file",
          "target": "~/docs/project-setup.md"
        }
      ]
    }
  ]
}
```

## Useful commands

List every item in a GitHub registry.

```bash
npx shadcn@latest list acme/toolkit
```

Search a GitHub registry.

```bash
npx shadcn@latest search acme/toolkit -q conventions
```

Validate a GitHub registry.

```bash
npx shadcn@latest registry validate acme/toolkit
```

Install an item from a GitHub registry.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

View an item from a GitHub registry.

```bash
npx shadcn@latest view acme/toolkit/project-conventions
```

Install an item whose registry item name contains `/`.

```bash
npx shadcn@latest add acme/toolkit/rules/agent
```

<Callout>
  For GitHub item addresses, the first two path segments are the GitHub owner
  and repository. Any remaining segments are the registry item name, not a file
  path. An address ending in `.json` is treated as a file path.
</Callout>

Install from a tag.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#v1.0.0
```

Install from a full commit SHA.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#c0ffee254729296a45d6691db565cf707a3fef5d
```

## Refs

Use `#ref` to install from a branch, tag or commit SHA.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#main
```

Refs may contain slashes.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#feature/conventions
```

If no ref is provided, the CLI uses the repository default branch.

The CLI uses Git to resolve branches, tags and short refs into a commit SHA
before reading files. Full 40-character commit SHAs are used directly and do not
require Git.

## Review before installing

GitHub registry items install code and project files from public repositories.
Treat a GitHub item address like any other third-party code dependency.

Before installing from a source you do not control:

- Review the repository and the root `registry.json`.
- Review the item definition, especially `files`, `target`, `dependencies`,
  `devDependencies`, `registryDependencies` and `envVars`.
- Check any external registry dependencies. They can install files from other
  registries.
- Prefer pinned refs for published install commands. A full 40-character commit
  SHA is the most reproducible option.
- Use `shadcn view acme/toolkit/project-conventions` to inspect the resolved
  item payload before installing.
- Pipe `shadcn view` output to your agent or review tool if you want help
  checking the item.
- Use `shadcn add acme/toolkit/project-conventions --dry-run` to preview an
  install without writing files.
- Use `--diff` or `--view` with `shadcn add` to inspect file changes or file
  contents before applying them.
