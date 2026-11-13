import { z } from "zod"

const registryNamespaceSchema = z.string().regex(/^@[a-zA-Z0-9][a-zA-Z0-9_-]*$/)

const registryDirectoryEntrySchema = z
  .object({
    name: registryNamespaceSchema,
    homepage: z.string().url(),
    url: z
      .string()
      .url()
      .refine((url) => url.includes("{name}"), {
        message: "URL must include {name} placeholder",
      }),
    description: z.string(),
    author: z.string().optional(),
    logo: z.string(),
  })
  .strict()

const registryDirectorySchema = z
  .array(registryDirectoryEntrySchema)
  .superRefine((entries, context) => {
    const names = new Set<string>()

    entries.forEach((entry, index) => {
      const name = entry.name.toLowerCase()
      if (names.has(name)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate registry namespace: ${entry.name}`,
          path: [index, "name"],
        })
      }
      names.add(name)
    })
  })

const publicRegistryDirectoryEntrySchema = registryDirectoryEntrySchema.pick({
  name: true,
  homepage: true,
  url: true,
  description: true,
})

const publicRegistryDirectorySchema = z.array(
  publicRegistryDirectoryEntrySchema
)

type RegistryDirectoryEntry = z.infer<typeof registryDirectoryEntrySchema>

function createPublicRegistryDirectory(
  entries: readonly RegistryDirectoryEntry[]
) {
  return entries.map(({ name, homepage, url, description }) => ({
    name,
    homepage,
    url,
    description,
  }))
}

function normalizeRegistryName(value: string) {
  return value.toLowerCase().replaceAll(" ", "").replace(/^@/, "")
}

export {
  createPublicRegistryDirectory,
  normalizeRegistryName,
  publicRegistryDirectoryEntrySchema,
  publicRegistryDirectorySchema,
  registryDirectoryEntrySchema,
  registryDirectorySchema,
  registryNamespaceSchema,
}
export type { RegistryDirectoryEntry }
