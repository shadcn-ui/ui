// ORIGINALLY FROM CLOUDFLARE WRANGLER:
// https://github.com/cloudflare/wrangler2/blob/main/.github/version-script.js

import { exec } from "child_process"
import fs from "fs"

const pkgJsonPath = "packages/shadcn/package.json"
try {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath))
  exec("git rev-parse --short HEAD", (err, stdout) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    pkg.version = "0.0.0-beta." + stdout.trim()
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, "\t") + "\n")
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}
