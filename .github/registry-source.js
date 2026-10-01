// The files that make up a published @shadcn/registry. A change to any of them
// must ship in a new @shadcn/registry version before a shadcn that uses it.
import { execFileSync } from "node:child_process"

export const REGISTRY = "@shadcn/registry"

export const REGISTRY_SOURCE = [
  "packages/registry/src",
  "packages/registry/package.json",
  "packages/registry/tsconfig.json",
  "packages/registry/tsup.config.ts",
  ":(exclude)packages/registry/src/**/*.test.ts",
  ":(exclude)packages/registry/src/**/__snapshots__",
  ":(exclude)packages/registry/src/test-helpers",
]

// Lists the registry source files that changed between two git revisions.
export function changedRegistrySource(from, to = "HEAD") {
  return execFileSync(
    "git",
    ["diff", "--name-only", from, to, "--", ...REGISTRY_SOURCE],
    { encoding: "utf8" }
  )
    .split("\n")
    .filter(Boolean)
}
