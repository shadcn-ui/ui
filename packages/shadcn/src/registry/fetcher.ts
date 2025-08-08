import { promises as fs } from "fs"
import { homedir } from "os"
import path from "path"
import { resolveRegistryUrl } from "@/src/registry/builder"
import { getRegistryHeadersFromContext } from "@/src/registry/context"
import {
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryLocalFileError,
  RegistryNotFoundError,
  RegistryParseError,
  RegistryUnauthorizedError,
} from "@/src/registry/errors"
import { registryItemSchema } from "@/src/registry/schema"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

const registryCache = new Map<string, Promise<any>>()

export function clearRegistryCache() {
  registryCache.clear()
}

export async function fetchRegistry(
  paths: string[],
  options: { useCache?: boolean } = {}
) {
  options = {
    useCache: true,
    ...options,
  }

  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = resolveRegistryUrl(path)

        // Check cache first if caching is enabled
        if (options.useCache && registryCache.has(url)) {
          return registryCache.get(url)
        }

        // Store the promise in the cache before awaiting if caching is enabled
        const fetchPromise = (async () => {
          // Get headers from context for this URL
          const headers = getRegistryHeadersFromContext(url)

          const response = await fetch(url, {
            agent,
            headers: {
              ...headers,
            },
          })

          if (!response.ok) {
            let errorDetails: any
            try {
              errorDetails = await response.json()
            } catch {
              // If we can't parse JSON, that's okay
            }

            if (response.status === 401) {
              throw new RegistryUnauthorizedError(url, errorDetails)
            }

            if (response.status === 404) {
              throw new RegistryNotFoundError(url, errorDetails)
            }

            if (response.status === 403) {
              throw new RegistryForbiddenError(url, errorDetails)
            }

            throw new RegistryFetchError(url, response.status, errorDetails)
          }

          return response.json()
        })()

        if (options.useCache) {
          registryCache.set(url, fetchPromise)
        }
        return fetchPromise
      })
    )

    return results
  } catch (error) {
    throw error
  }
}

export async function fetchRegistryLocal(filePath: string) {
  try {
    // Handle tilde expansion for home directory
    let expandedPath = filePath
    if (filePath.startsWith("~/")) {
      expandedPath = path.join(homedir(), filePath.slice(2))
    }

    const resolvedPath = path.resolve(expandedPath)
    const content = await fs.readFile(resolvedPath, "utf8")
    const parsed = JSON.parse(content)

    try {
      return registryItemSchema.parse(parsed)
    } catch (error) {
      throw new RegistryParseError(filePath, error)
    }
  } catch (error) {
    // Check if this is a file not found error
    if (
      error instanceof Error &&
      (error.message.includes("ENOENT") ||
        error.message.includes("no such file"))
    ) {
      throw new RegistryLocalFileError(filePath, error)
    }
    // Re-throw parse errors as-is
    if (error instanceof RegistryParseError) {
      throw error
    }
    // For other errors (like JSON parse errors), throw as local file error
    throw new RegistryLocalFileError(filePath, error)
  }
}
