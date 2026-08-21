// Collect the packages that a snapshot prerelease just published, so the
// prerelease comment workflow can render an install line per package.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const [, , prNumber, channel] = process.argv

const packagesDir = join(process.cwd(), "packages")
const published = []

for (const dir of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, dir, "package.json")
  if (!existsSync(pkgPath)) {
    continue
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))

  // Snapshot versions are stamped `0.0.0-<channel>-<timestamp>`, so the channel
  // marker is how we tell which packages this run actually versioned.
  if (
    !pkg.private &&
    typeof pkg.version === "string" &&
    pkg.version.includes(`-${channel}`)
  ) {
    published.push({ name: pkg.name, version: pkg.version })
  }
}

writeFileSync(
  "prerelease-info.json",
  JSON.stringify({ pr: prNumber, channel, packages: published }, null, 2)
)

console.log(`Collected ${published.length} prerelease package(s).`)
