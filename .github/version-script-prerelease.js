import fs from "fs"

const pkgJsonPath = "packages/shadcn/package.json"
const channel = process.argv[2]
const headSha = process.argv[3]

if (!["beta", "rc"].includes(channel)) {
  console.error(
    `Expected prerelease channel to be "beta" or "rc", got "${channel}".`
  )
  process.exit(1)
}

if (!headSha) {
  console.error("Expected pull request head SHA.")
  process.exit(1)
}

try {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"))
  const shortSha = headSha.trim().slice(0, 7)
  const baseVersion = channel === "beta" ? "0.0.0" : pkg.version

  if (channel === "rc" && baseVersion.includes("-")) {
    console.error(
      `Expected a stable planned version for rc, got "${baseVersion}".`
    )
    process.exit(1)
  }

  pkg.version = `${baseVersion}-${channel}.${shortSha}`
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, "\t") + "\n")
  console.log(`Prepared shadcn@${pkg.version}`)
} catch (error) {
  console.error(error)
  process.exit(1)
}
