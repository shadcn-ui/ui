// Fail a pull request that changes the @shadcn/registry source without an
// @shadcn/registry changeset.
//
// shadcn pins an exact @shadcn/registry version, so an unreleased registry
// change would not reach shadcn users, and changeset-publish.js refuses to
// publish shadcn until the change is released.
//
// Usage: node .github/check-registry-changeset.js <base ref>
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

import { changedRegistrySource, REGISTRY } from "./registry-source.js"

const [base] = process.argv.slice(2)
if (!base) {
  throw new Error("Usage: node .github/check-registry-changeset.js <base ref>")
}

const mergeBase = execFileSync("git", ["merge-base", base, "HEAD"], {
  encoding: "utf8",
}).trim()

const changes = changedRegistrySource(mergeBase)
if (changes.length === 0) {
  console.log(`No ${REGISTRY} source changes.`)
  process.exit(0)
}

const changesets = execFileSync(
  "git",
  [
    "diff",
    "--name-only",
    "--diff-filter=AM",
    mergeBase,
    "HEAD",
    "--",
    ".changeset/*.md",
  ],
  { encoding: "utf8" }
)
  .split("\n")
  .filter(Boolean)

const releasesRegistry = changesets.some((file) => {
  const frontmatter = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)
  return frontmatter?.[1]
    .split("\n")
    .some((line) => line.replace(/["']/g, "").trim().startsWith(`${REGISTRY}:`))
})

if (!releasesRegistry) {
  console.error(
    [
      `This pull request changes ${REGISTRY} but has no ${REGISTRY} changeset.`,
      "shadcn depends on an exact version of it, so the change only reaches users once it is released.",
      `Run \`pnpm changeset\` and select ${REGISTRY}.`,
      "",
      ...changes.map((file) => `  ${file}`),
    ].join("\n")
  )
  process.exit(1)
}

console.log(`${REGISTRY} source changes are covered by a changeset.`)
