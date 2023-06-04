import path from "path"
import { Config } from "@/src/utils/get-config"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import * as z from "zod"

const baseUrl = process.env.COMPONENTS_BASE_URL ?? "https://ui.shadcn.com"
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

// TODO: Extract this to a shared package.
const registryItemSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  type: z.enum(["components:ui", "components:component", "components:example"]),
})

const registryIndexSchema = z.array(registryItemSchema)

export type RegistryIndex = z.infer<typeof registryIndexSchema>

const registryItemWithContentSchema = registryItemSchema.extend({
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    })
  ),
})

const registryWithContentSchema = z.array(registryItemWithContentSchema)

const stylesSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  })
)

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index"])

    return registryIndexSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch components from registry.`)
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles"])

    return stylesSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch styles from registry.`)
  }
}

export async function resolveTree(index: RegistryIndex, names: string[]) {
  const tree: RegistryIndex = []

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name)

    if (!entry) {
      continue
    }

    tree.push(entry)

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies)
      tree.push(...dependencies)
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  )
}

export async function fetchTree(style: string, tree: RegistryIndex) {
  try {
    const paths = tree.map((item) => `${style}/${item.name}`)
    const result = await fetchRegistry(paths)

    return registryWithContentSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch tree from registry.`)
  }
}

export async function getItemTargetPath(
  config: Config,
  item: z.infer<typeof registryItemWithContentSchema>,
  override?: string
) {
  // Allow overrides for all items but ui.
  if (override && item.type !== "components:ui") {
    return override
  }

  const [parent, type] = item.type.split(":")
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type
  )
}

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}.json`, {
          agent,
        })
        return await response.json()
      })
    )

    return results
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to fetch registry from ${baseUrl}.`)
  }
}
