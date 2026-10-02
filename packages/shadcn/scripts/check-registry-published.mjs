// Fails when the @shadcn/registry version that shadcn pins is not on npm.
//
// `pnpm publish` replaces shadcn's "workspace:*" dependency on
// @shadcn/registry with the local version, so publishing shadcn before that
// version exists on npm would ship a CLI that cannot be installed.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const { name, version } = JSON.parse(
  fs.readFileSync(path.join(root, "../registry/package.json"), "utf8")
)

let published = ""
try {
  published = execFileSync("npm", ["view", `${name}@${version}`, "version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim()
} catch {
  // npm view exits with an error when the package does not exist at all.
}

if (published !== version) {
  console.error(
    `${name}@${version} is not published on npm. Publish it before publishing shadcn, or release both with changesets.`
  )
  process.exit(1)
}

console.log(`${name}@${version} is published.`)
