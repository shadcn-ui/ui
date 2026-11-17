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

// npm can take several minutes to serve a new version of a busy package.
const PUBLISH_TIMEOUT_MS = 15 * 60 * 1000
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
  // npm 12 wraps the result in an array.
  const parsed = JSON.parse(output || "null")
  return (Array.isArray(parsed) ? parsed : [parsed]).includes(version)
}

function hasTag(tag) {
  try {
    execFileSync(
      "git",
      ["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`],
      {
        stdio: "ignore",
      }
    )
    return true
  } catch {
    return false
  }
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

// Every registry release is tagged, so check against its tag that the version
// shadcn pins was released from the registry source in this tree. Snapshots
// are not tagged; a snapshot version that was not on npm before this run is
// unique to it, so this run published it from this tree.
const createsTags = !args.includes("--no-git-tag")
if (createsTags || registryPublishedBefore) {
  if (!hasTag(registryTag)) {
    fail(
      [
        `Could not find the git tag ${registryTag}, so it is not possible to check that the published ${REGISTRY} matches this tree.`,
        "If it was published from this repository, tag the commit it was published from and push the tag, then re-run:",
        `  git tag -a ${registryTag} -m ${registryTag} <commit> && git push origin refs/tags/${registryTag}`,
      ].join("\n")
    )
  }

  // Push the tag this run created now, so it is not lost if the job fails
  // before changesets/action pushes it. Later runs depend on it.
  if (createsTags && !registryPublishedBefore) {
    try {
      execFileSync("git", ["push", "origin", `refs/tags/${registryTag}`], {
        stdio: "inherit",
      })
    } catch {
      console.warn(
        `Could not push ${registryTag}. changesets/action pushes it after publishing.`
      )
    }
  }

  const changes = changedRegistrySource(registryTag)
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
