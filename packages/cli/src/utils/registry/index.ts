import path from "path"
import { Config } from "@/src/utils/get-config"
import {
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemWithContentSchema,
  registryWithContentSchema,
  stylesSchema,
} from "@/src/utils/registry/schema"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import * as z from "zod"

const baseUrl = process.env.COMPONENTS_REGISTRY_URL ?? "https://ui.shadcn.com"
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"])

    return registryIndexSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch components from registry.`)
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"])

    return stylesSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch styles from registry.`)
  }
}

export async function getRegistryBaseColors() {
  return [
    {
      name: "slate",
      label: "Slate",
    },
    {
      name: "gray",
      label: "Gray",
    },
    {
      name: "zinc",
      label: "Zinc",
    },
    {
      name: "neutral",
      label: "Neutral",
    },
    {
      name: "stone",
      label: "Stone",
    },
  ]
}

export async function getRegistryBaseColor(baseColor: string) {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`])

    return registryBaseColorSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch base color from registry.`)
  }
}

export const splitDependencies = (registryName: string[], dependencies: string[]) => {
  let addons: string[] = []
  let shadcn: string[] = []

  dependencies.forEach(e => {
    registryName.includes(e) ? shadcn.push(e) : addons.push(e)
  })
  return { addons, shadcn }
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[]
) {
  const tree: z.infer<typeof registryIndexSchema> = []

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name)

    if (!entry) {
      console.log(name)
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

export async function fetchTreeMarketplace(
  names: string[]
) {
  try {
    if (!names.length) return []

    const result = await fetchMarketplace(names)

    return registryWithContentSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch tree from marketplace registry.`)
  }
}

async function fetchMarketplace(paths: string[]) {
  try {
    const results = await fetch(`${baseUrl}/api/marketplace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names: paths })
    })

    return results.json()
  } catch (error) {
    return []
    // even if the marketplace is down, we should still be able to add components
    // throw new Error(`Failed to fetch marketplace from ${baseUrl}.`)
  }
}

export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const paths = tree.map((item) => `styles/${style}/${item.name}.json`)
    const result = await fetchRegistry(paths)

    return registryWithContentSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch tree from registry.`)
  }
}

export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof registryItemWithContentSchema>, "type" | "name">,
  override?: string
) {
  // Allow overrides for all items but ui & addons
  if (override && (item.type !== "components:ui" && item.type !== "components:addons")) {
    return override
  }

  const [parent, type] = item.type.split(":")
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type,
    type === "addons" ? item.name : ""
  )
}

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}`, {
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
