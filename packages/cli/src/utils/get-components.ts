import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import * as z from "zod"

const baseUrl = process.env.COMPONENTS_BASE_URL ?? "https://ui.shadcn.com"
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

const componentSchema = z.object({
  component: z.string(),
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
    const response = await fetch(`${baseUrl}/api/components`, { agent })
    const components = await response.json()

    return componentsSchema.parse(components)
  } catch (error) {
    throw new Error(
      `Failed to fetch components from ${baseUrl}/api/components.`
    )
  }
}
