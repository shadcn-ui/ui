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
import { registryItemSchema } from "@/src/schema"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import { z } from "zod"

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

        // Store the promise in the cache before awaiting if caching is enabled.
        const fetchPromise = (async () => {
          // Get headers from context for this URL.
          const headers = getRegistryHeadersFromContext(url)

          const response = await fetch(url, {
            agent,
            headers: {
              ...headers,
            },
          })

          if (!response.ok) {
            let messageFromServer = undefined

            if (
              response.headers.get("content-type")?.includes("application/json")
            ) {
              const json = await response.json()
              const parsed = z
                .object({
                  // RFC 7807.
                  detail: z.string().optional(),
                  title: z.string().optional(),
                  // Standard error response.
                  message: z.string().optional(),
                  error: z.string().optional(),
                })
                .safeParse(json)

              if (parsed.success) {
                // Prefer RFC 7807 detail field, then message field.
                messageFromServer = parsed.data.detail || parsed.data.message

                if (parsed.data.error) {
                  messageFromServer = `[${parsed.data.error}] ${messageFromServer}`
                }
              }
            }

            if (response.status === 401) {
              throw new RegistryUnauthorizedError(url, messageFromServer)
            }

            if (response.status === 404) {
              throw new RegistryNotFoundError(url, messageFromServer)
            }

            if (response.status === 403) {
              throw new RegistryForbiddenError(url, messageFromServer)
            }

            throw new RegistryFetchError(
              url,
              response.status,
              messageFromServer
            )
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
