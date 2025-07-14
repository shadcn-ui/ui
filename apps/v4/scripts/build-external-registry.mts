import { promises as fs } from "fs"
import path from "path"
import { create, insertMultiple, save } from "@orama/orama"
import { z } from "zod"

// Schema for registries.json - just an array of URLs
const RegistriesConfigSchema = z.array(z.string().url())

// Schema for registry items (matching the public schema)
const RegistryItemSchema = z.object({
  name: z.string(),
  type: z.enum([
    "registry:lib",
    "registry:block",
    "registry:component",
    "registry:ui",
    "registry:hook",
    "registry:theme",
    "registry:page",
    "registry:file",
    "registry:style",
    "registry:item",
  ]),
  description: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.any()).optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional(),
})

const RegistrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(RegistryItemSchema),
})

type Registry = z.infer<typeof RegistrySchema>
type RegistryItem = z.infer<typeof RegistryItemSchema>

interface ProcessedRegistry {
  url: string
  data: Registry
  items: RegistryItem[]
  fetchedAt: string
  error?: string
}

async function fetchRegistry(url: string): Promise<ProcessedRegistry> {
  console.log(`📥 Fetching registry from ${url}`)
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const validated = RegistrySchema.parse(data)
    
    // Items are already in the correct format
    const items = validated.items
    
    console.log(`✅ Successfully fetched ${validated.items.length} items from ${validated.name}`)
    
    return {
      url,
      data: validated,
      items: items,
      fetchedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`❌ Failed to fetch ${url}:`, error)
    return {
      url,
      data: { name: "Unknown", homepage: url, items: [] },
      items: [],
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function buildExternalRegistry() {
  console.log("🔨 Building external registry index...")
  
  // Read registries config
  const configPath = path.join(process.cwd(), "registry", "registry-external.json")
  const configContent = await fs.readFile(configPath, "utf-8")
  const config = RegistriesConfigSchema.parse(JSON.parse(configContent))
  
  // Output will go to content directory
  
  // Fetch all registries
  const results = await Promise.all(
    config.map(url => fetchRegistry(url))
  )
  
  // Combine all items from all registries, adding registry name to each item
  const allItems = results.flatMap(r => 
    r.items.map(item => ({
      ...item,
      meta: {
        ...item.meta,
        registryName: r.data.name,
        registryHomepage: r.data.homepage,
      }
    }))
  )
  
  // Create a registry following the standard schema
  const registry = {
    name: "External Registries",
    homepage: "https://ui.shadcn.com/docs/components",
    items: allItems,
  }
  
  // Create data directory
  const dataDir = path.join(process.cwd(), ".data")
  await fs.mkdir(dataDir, { recursive: true })
  
  // Write registry to data directory
  const outputPath = path.join(dataDir, "external-registries.json")
  await fs.writeFile(outputPath, JSON.stringify(registry, null, 2))
  
  // Create search index
  console.log("🔍 Building search index...")
  const searchDb = await create({
    schema: {
      name: 'string',
      description: 'string',
      type: 'string',
      author: 'string',
      url: 'string',
      registryName: 'string',
    },
    components: {
      tokenizer: {
        stemming: false, // Disable stemming for faster indexing
        stopWords: false, // Disable stop words for component names
      },
    },
  })
  
  // Prepare items for indexing
  const searchItems = allItems.map(item => ({
    name: item.name,
    description: item.description || '',
    type: item.type,
    author: item.author || '',
    url: item.meta?.url || '',
    registryName: item.meta?.registryName || '',
  }))
  
  await insertMultiple(searchDb, searchItems)
  
  // Save search index
  const indexPath = path.join(dataDir, "external-registries-index.json")
  const index = await save(searchDb)
  await fs.writeFile(indexPath, JSON.stringify(index))
  
  console.log(`✨ External registry built successfully!`)
  console.log(`📊 Total registries: ${results.length}`)
  console.log(`📦 Total items: ${allItems.length}`)
  console.log(`📍 Registry saved to: ${outputPath}`)
  console.log(`🔍 Search index saved to: ${indexPath}`)
}

buildExternalRegistry().catch(console.error)