// The source of a published @shadcn/registry. A change to it must ship in a
// new @shadcn/registry version before a shadcn that uses it.
import { execFileSync } from "node:child_process"

export const REGISTRY = "@shadcn/registry"

const PACKAGE_JSON = "packages/registry/package.json"

const SOURCE_FILES = [
  "packages/registry/src",
  "packages/registry/tsconfig.json",
  "packages/registry/tsup.config.ts",
  ":(exclude)packages/registry/src/**/*.test.ts",
  ":(exclude)packages/registry/src/**/__snapshots__",
  ":(exclude)packages/registry/src/test-helpers",
]

// The package.json fields that change what the published package does.
// Others, like scripts and devDependencies, do not need a release.
const PUBLISHED_FIELDS = [
  "bin",
  "bundleDependencies",
  "dependencies",
  "engines",
  "exports",
  "files",
  "main",
  "module",
  "optionalDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "sideEffects",
  "type",
  "types",
  "typesVersions",
]

function readPackageJson(revision) {
  try {
    return JSON.parse(
      execFileSync("git", ["show", `${revision}:${PACKAGE_JSON}`], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
    )
  } catch {
    return null
  }
}

// Lists the registry source that changed between two git revisions.
export function changedRegistrySource(from, to = "HEAD") {
  const changes = execFileSync(
    "git",
    ["diff", "--name-only", from, to, "--", ...SOURCE_FILES],
    { encoding: "utf8" }
  )
    .split("\n")
    .filter(Boolean)

  const before = readPackageJson(from)
  const after = readPackageJson(to)
  const fields = PUBLISHED_FIELDS.filter(
    (field) =>
      JSON.stringify(before?.[field]) !== JSON.stringify(after?.[field])
  )
  if (!before || !after || fields.length > 0) {
    changes.push(
      `${PACKAGE_JSON}${fields.length > 0 ? ` (${fields.join(", ")})` : ""}`
    )
  }

  return changes
}
