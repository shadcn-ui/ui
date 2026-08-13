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

function getRegistries(directory: z.infer<typeof directorySchema>) {
  return directory.map(({ name, homepage, url, description }) => ({
    name,
    homepage,
    url,
    description,
  }))
}

async function main() {
  let hasErrors = false

  // 1. Validate directory.json.
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

  // 2. Validate the public registries payload served by /r/registries.json.
  if (directoryResult.success) {
    const registriesResult = registriesSchema.safeParse(
      getRegistries(directoryResult.data)
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
