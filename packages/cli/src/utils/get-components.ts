import fetch from "node-fetch"
import * as z from "zod"

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://ui.shadcn.com"
    : "http://localhost:3000"

const componentSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      dir: z.string(),
      content: z.string(),
    })
  ),
})

export type Component = z.infer<typeof componentSchema>

const componentsSchema = z.array(componentSchema)

export async function getAvailableComponents() {
  try {
    const response = await fetch(`${baseUrl}/api/components`)
    const components = await response.json()

    return componentsSchema.parse(components)
  } catch (error) {
    throw new Error("Failed to fetch components")
  }
}
