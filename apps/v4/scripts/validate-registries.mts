import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

const registryEntrySchema = z.object({
  name: z.string().regex(/^@[a-zA-Z0-9][a-zA-Z0-9-_]*$/),
  homepage: z.string().url(),
  url: z.string().refine((url) => url.includes("{name}"), {
    message: "URL must include {name} placeholder",
  }),
  description: z.string(),
})

const registriesSchema = z.array(registryEntrySchema)

const directoryEntrySchema = registryEntrySchema.extend({
  logo: z.string(),
})

const directorySchema = z.array(directoryEntrySchema)

async function main() {
  let hasErrors = false

  // 1. Validate registries.json.
  const registriesFile = path.join(process.cwd(), "public/r/registries.json")
  const registriesContent = await fs.readFile(registriesFile, "utf-8")
  const registriesData = JSON.parse(registriesContent)

  const registriesResult = registriesSchema.safeParse(registriesData)
  if (!registriesResult.success) {
    console.error("❌ registries.json validation failed:")
    console.error(registriesResult.error.format())
    hasErrors = true
  } else {
    console.log("✅ registries.json is valid")
  }

  // 2. Validate directory.json.
  const directoryFile = path.join(process.cwd(), "registry/directory.json")
  const directoryContent = await fs.readFile(directoryFile, "utf-8")
  const directoryData = JSON.parse(directoryContent)

  const directoryResult = directorySchema.safeParse(directoryData)
  if (!directoryResult.success) {
    console.error("❌ directory.json validation failed:")
    console.error(directoryResult.error.format())
    hasErrors = true
  } else {
    console.log("✅ directory.json is valid")
  }

  // 3. Check that all directory.json entries are in registries.json.
  if (registriesResult.success && directoryResult.success) {
    const registryNames = new Set(
      registriesResult.data.map((entry) => entry.name)
    )
    const directoryNames = new Set(
      directoryResult.data.map((entry) => entry.name)
    )

    const missingInRegistries = Array.from(directoryNames).filter(
      (name) => !registryNames.has(name)
    )

    if (missingInRegistries.length > 0) {
      console.error(
        "\n❌ The following registries are in directory.json but missing from registries.json:"
      )
      missingInRegistries.forEach((name) => console.error(`   ${name}`))
      hasErrors = true
    } else {
      console.log("✅ All directory entries are present in registries.json")
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
