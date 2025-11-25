import { promises as fs } from "fs"
import path from "path"
import { registrySchema } from "shadcn/schema"
import { z } from "zod"

const registriesIndexSchema = z.record(
  z.string().regex(/^@[a-zA-Z0-9][a-zA-Z0-9-_]*$/),
  z.string().refine((url) => url.includes("{name}"))
)

const directoryEntrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  url: z.string(),
  description: z.string(),
  logo: z.string(),
})

const directorySchema = z.array(directoryEntrySchema)

async function main() {
  // 1. Validate the registries.json file.
  const registriesFile = path.join(process.cwd(), "public/r/registries.json")
  const content = await fs.readFile(registriesFile, "utf-8")
  const data = JSON.parse(content)
  const registries = registriesIndexSchema.parse(data)

  // 2. Check that all directory.json entries are in registries.json.
  const directoryFile = path.join(process.cwd(), "registry/directory.json")
  const directoryContent = await fs.readFile(directoryFile, "utf-8")
  const directoryData = JSON.parse(directoryContent)
  const directory = directorySchema.parse(directoryData)

  const directoryNames = new Set(directory.map((entry) => entry.name))
  const registryNames = new Set(Object.keys(registries))

  const missingInRegistries = Array.from(directoryNames).filter(
    (name) => !registryNames.has(name)
  )

  if (missingInRegistries.length > 0) {
    console.error(
      "\n❌ The following registries are in directory.json but missing from registries.json:"
    )
    missingInRegistries.forEach((name) => console.error(`   ${name}`))
    process.exit(1)
  }

  console.log("✅ All directory entries are present in registries.json\n")

  // 3. Validate each registry endpoint.
  const errors: string[] = []
  for (const [name, url] of Object.entries(registries)) {
    try {
      const testUrl = url.replace("{name}", "registry")
      const response = await fetch(testUrl)

      if (!response.ok) {
        errors.push(`${name}: HTTP ${response.status}`)
        continue
      }

      const json = await response.json()
      registrySchema.parse(json)
      console.log(`✅ ${name}`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`${name}: ${error.message}`)
        continue
      }

      errors.push(
        `${name}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  if (errors.length > 0) {
    console.error("\n❌ Validation failed:")
    errors.forEach((err) => console.error(`   ${err}`))
    process.exit(1)
  }

  console.log("\n✅ All registries passed validation.")
  process.exit(0)
}

main().catch((error) => {
  console.error("❌ Error:", error instanceof Error ? error.message : error)
  process.exit(1)
})
