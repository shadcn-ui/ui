import { z } from "zod"

export const registryEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  type: z.enum([
    "components:ui",
    "components:component",
    "components:example",
    "components:block",
  ]),
})

export const registrySchema = z.array(registryEntrySchema)

export type RegistryEntry = z.infer<typeof registryEntrySchema>

export type Registry = z.infer<typeof registrySchema>

export const indexEntrySchema = registryEntrySchema.extend({
  component: z.any(),
  container: z
    .object({
      height: z.string().optional(),
      className: z.string().optional(),
    })
    .optional(),
  code: z.string().optional(),
})
