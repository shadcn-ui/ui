import { promises as fs } from "fs"
import path from "path"

import {
  createPublicRegistryDirectory,
  publicRegistryDirectorySchema,
  registryDirectorySchema,
} from "../lib/registry-directory"

async function main() {
  let hasErrors = false

  // 1. Validate directory.json.
  const directoryFile = path.join(process.cwd(), "registry/directory.json")
  const directoryContent = await fs.readFile(directoryFile, "utf-8")
  const directoryData = JSON.parse(directoryContent)

  const directoryResult = registryDirectorySchema.safeParse(directoryData)
  if (!directoryResult.success) {
    console.error("❌ directory.json validation failed:")
    console.error(directoryResult.error.format())
    hasErrors = true
  } else {
    console.log("✅ directory.json is valid")
  }

  // 2. Validate the public registries payload served by /r/registries.json.
  if (directoryResult.success) {
    const registriesResult = publicRegistryDirectorySchema.safeParse(
      createPublicRegistryDirectory(directoryResult.data)
    )

    if (!registriesResult.success) {
      console.error("❌ /r/registries.json validation failed:")
      console.error(registriesResult.error.format())
      hasErrors = true
    } else {
      console.log("✅ /r/registries.json payload is valid")
      console.log("✅ /r/registries.json includes all directory entries")
    }
  }

  if (hasErrors) {
    process.exit(1)
  }

  console.log("\n✅ All registries passed validation.")
}

main().catch((error) => {
  console.error("❌ Error:", error instanceof Error ? error.message : error)
  process.exit(1)
})
