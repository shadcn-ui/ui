import { readFile } from "fs/promises"
import path from "path"

// Reads JSON config files the way our cosmiconfig setup did, without
// cosmiconfig's TypeScript loader, which bundlers pull in with it.

export type JsonConfigResult = { config: unknown; filepath: string } | null

// search() treats a file it cannot read as missing.
const UNREADABLE = new Set(["ENOENT", "EISDIR", "ENOTDIR", "EACCES"])

export function createJsonConfigExplorer(options: {
  filename: string
  // Return this key of the file instead of the whole file.
  property?: string
}) {
  // Caching promises means concurrent calls share a read, and a failed read
  // keeps failing until clearCaches().
  const searchCache = new Map<string, Promise<JsonConfigResult>>()
  const loadCache = new Map<string, Promise<JsonConfigResult>>()

  return {
    // Reads the file in `dir` only, not in parent directories. Returns null
    // when the file is missing, unreadable or empty.
    search(dir: string) {
      dir = path.resolve(dir)
      return cached(searchCache, dir, async () => {
        try {
          return await readJsonConfig(
            path.join(dir, options.filename),
            options.property
          )
        } catch (error) {
          if (UNREADABLE.has((error as NodeJS.ErrnoException).code ?? "")) {
            return null
          }
          throw error
        }
      })
    },
    load(filepath: string) {
      filepath = path.resolve(filepath)
      return cached(loadCache, filepath, () =>
        readJsonConfig(filepath, options.property)
      )
    },
    clearCaches() {
      searchCache.clear()
      loadCache.clear()
    },
  }
}

async function readJsonConfig(
  filepath: string,
  property?: string
): Promise<JsonConfigResult> {
  const contents = await readFile(filepath, "utf8")
  if (contents.trim() === "") {
    return null
  }

  let config: unknown
  try {
    config = JSON.parse(contents)
  } catch (error) {
    throw new SyntaxError(
      `JSON Error in ${filepath}:\n${(error as Error).message}`
    )
  }

  if (property) {
    config = (config as Record<string, unknown>)[property] ?? null
  }

  return config === null ? null : { config, filepath }
}

function cached<T>(
  cache: Map<string, Promise<T>>,
  key: string,
  read: () => Promise<T>
) {
  let result = cache.get(key)
  if (!result) {
    result = read()
    cache.set(key, result)
  }
  return result
}
