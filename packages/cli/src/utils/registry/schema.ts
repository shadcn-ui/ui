import { z } from "zod"

export const registryCssVarsSchema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

// TODO: Extract this to a shared package.
export const registryItemSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  type: z
    .enum(["components:ui", "components:component", "components:example"])
    .optional(),
  tailwind: z
    .object({
      config: z.object({
        content: z.array(z.string()).optional(),
        theme: z.record(z.string(), z.any()).optional(),
        plugins: z.array(z.string()).optional(),
      }),
    })
    .optional(),
  cssVars: registryCssVarsSchema.optional(),
})

export const registryIndexSchema = z.array(registryItemSchema)

export const registryItemWithContentSchema = registryItemSchema.extend({
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
      type: z.enum([
        "components:ui",
        "components:component",
        "components:example",
      ]),
    })
  ),
})

export const registryWithContentSchema = z.array(registryItemWithContentSchema)

export const stylesSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  })
)

export const registryBaseColorSchema = z.object({
  inlineColors: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  inlineColorsTemplate: z.string(),
  cssVarsTemplate: z.string(),
})
