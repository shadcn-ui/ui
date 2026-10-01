// Publish the packages with Changesets without ever publishing a shadcn whose
// @shadcn/registry dependency is broken.
//
// `changeset publish` publishes every package in parallel. shadcn pins an
// exact @shadcn/registry version, so in a single pass a failed registry
// publish could leave a shadcn on npm that cannot be installed. Instead:
//
// 1. Publish everything except the packages that depend on @shadcn/registry.
// 2. Check that the @shadcn/registry version they pin is on npm, and that it
//    was published from the registry source in this tree. A registry change
//    released without an @shadcn/registry changeset would otherwise ship a
//    shadcn pinned to an older registry than the one it was tested with.
// 3. Publish the remaining packages.
//
// Arguments are passed through to `changeset publish`, for example
// `node .github/changeset-publish.js --tag beta --no-git-tag`.
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { changedRegistrySource, REGISTRY } from "./registry-source.js"

const PUBLISH_TIMEOUT_MS = 5 * 60 * 1000
const POLL_INTERVAL_MS = 10 * 1000

const args = process.argv.slice(2)
const packagesDir = join(process.cwd(), "packages")

const packages = readdirSync(packagesDir)
  .map((dir) => join(packagesDir, dir, "package.json"))
  .filter((file) => existsSync(file))
  .map((file) => {
    const source = readFileSync(file, "utf8")
    return { file, source, json: JSON.parse(source) }
  })

const registry = packages.find((pkg) => pkg.json.name === REGISTRY)
if (!registry) {
  throw new Error(`Could not find the ${REGISTRY} package.`)
}

const dependents = packages.filter(
  (pkg) =>
    !pkg.json.private &&
    REGISTRY in
      {
        ...pkg.json.dependencies,
        ...pkg.json.optionalDependencies,
        ...pkg.json.peerDependencies,
      }
)

function publish() {
  execFileSync("pnpm", ["exec", "changeset", "publish", ...args], {
    stdio: "inherit",
  })
}

// Only a 404 from npm means "not published". Any other error throws, so a
// flaky lookup stops the release instead of skipping a check.
function isPublished(name, version) {
  let output
  try {
    output = execFileSync(
      "npm",
      ["view", `${name}@${version}`, "version", "--json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    )
  } catch (error) {
    output = error.stdout
    if (JSON.parse(output || "{}").error?.code === "E404") {
      return false
    }
    throw new Error(
      `Could not check whether ${name}@${version} is on npm.\n${error.stderr || output}`
    )
  }
  return JSON.parse(output || "null") === version
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function fail(message) {
  console.error(
    `\n${message}\n\n${pending.map((pkg) => pkg.json.name).join(", ")} was not published.`
  )
  process.exit(1)
}

const pending = dependents.filter(
  (pkg) => !isPublished(pkg.json.name, pkg.json.version)
)

if (pending.length === 0) {
  publish()
  process.exit(0)
}

const { version } = registry.json
const registryTag = `${REGISTRY}@${version}`
const registryPublishedBefore = isPublished(REGISTRY, version)

// 1. Hold back the packages that depend on the registry.
for (const pkg of pending) {
  writeFileSync(
    pkg.file,
    `${JSON.stringify({ ...pkg.json, private: true }, null, 2)}\n`
  )
}
try {
  publish()
} finally {
  for (const pkg of pending) {
    writeFileSync(pkg.file, pkg.source)
  }
}

// 2. Make sure the registry version they pin is on npm and matches this tree.
const deadline = Date.now() + PUBLISH_TIMEOUT_MS
for (;;) {
  let published = false
  try {
    published = isPublished(REGISTRY, version)
  } catch (error) {
    console.log(error.message)
  }
  if (published) {
    break
  }
  if (Date.now() > deadline) {
    fail(`${registryTag} is not on npm.`)
  }
  console.log(`Waiting for ${registryTag} to be available on npm...`)
  sleep(POLL_INTERVAL_MS)
}

// A registry published by this run was built from this tree. An existing one
// must come from the same registry source, which its release tag records.
if (registryPublishedBefore) {
  let changes
  try {
    execFileSync(
      "git",
      ["rev-parse", "--verify", "--quiet", `refs/tags/${registryTag}`],
      {
        stdio: "ignore",
      }
    )
    changes = changedRegistrySource(registryTag)
  } catch {
    fail(
      `Could not find the git tag ${registryTag}, so it is not possible to check that the published ${REGISTRY} matches this tree.`
    )
  }
  if (changes.length > 0) {
    fail(
      [
        `packages/registry changed since ${registryTag} was published, but its version was not bumped.`,
        `Add an ${REGISTRY} changeset for these changes:`,
        "",
        ...changes.map((file) => `  ${file}`),
      ].join("\n")
    )
  }
}

// 3. Publish the packages that depend on the registry.
publish()
