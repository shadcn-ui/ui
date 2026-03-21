import { createServer } from "http"
import path from "path"
import fs from "fs-extra"

export async function createRegistryServer(
  items: Array<{ name: string; type: string } & Record<string, unknown>>,
  {
    port = 4444,
    path = "/r",
  }: {
    port?: number
    path?: string
  }
) {
  const server = createServer((request, response) => {
    const urlRaw = request.url?.split("?")[0]

    // Handle registries.json endpoint (don't strip .json for this one)
    if (urlRaw?.endsWith("/registries.json")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      // Return empty registry index for tests - we want to test manual configuration.
      response.end(JSON.stringify({}))
      return
    }

    // For other endpoints, strip .json extension
    const urlWithoutQuery = urlRaw?.replace(/\.json$/, "")

    if (urlWithoutQuery?.includes("icons/index")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify({
          AlertCircle: {
            lucide: "AlertCircle",
            radix: "ExclamationTriangleIcon",
          },
          ArrowLeft: {
            lucide: "ArrowLeft",
            radix: "ArrowLeftIcon",
          },
        })
      )
      return
    }

    if (urlWithoutQuery?.includes("colors/neutral")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify({
          inlineColors: {
            light: {
              background: "white",
              foreground: "neutral-950",
            },
            dark: {
              background: "neutral-950",
              foreground: "neutral-50",
            },
          },
          cssVars: {
            light: {
              background: "0 0% 100%",
              foreground: "0 0% 3.9%",
            },
            dark: {
              background: "0 0% 3.9%",
              foreground: "0 0% 98%",
            },
          },
          cssVarsV4: {
            light: {
              background: "oklch(1 0 0)",
              foreground: "oklch(0.145 0 0)",
            },
            dark: {
              background: "oklch(0.145 0 0)",
              foreground: "oklch(0.985 0 0)",
            },
          },
          inlineColorsTemplate:
            "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n  ",
          cssVarsTemplate:
            "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer ",
        })
      )
      return
    }

    if (urlWithoutQuery?.includes("styles/index")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify([
          {
            name: "new-york",
            label: "New York",
          },
          {
            name: "default",
            label: "Default",
          },
        ])
      )
      return
    }

    if (urlWithoutQuery?.includes("index")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify([
          {
            name: "alert-dialog",
            type: "registry:ui",
            files: [
              {
                path: "components/ui/alert-dialog.tsx",
                type: "registry:ui",
                content:
                  "export function AlertDialog() { return <div>AlertDialog Component from Registry Shadcn</div> }",
              },
            ],
          },
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "components/ui/button.tsx",
                type: "registry:ui",
                content:
                  "export function Button() { return <div>Button Component from Registry Shadcn</div> }",
              },
            ],
          },
        ])
      )
      return
    }

    // Check if this is a registry.json request
    if (urlWithoutQuery?.endsWith("/registry")) {
      // Check if this requires bearer authentication
      if (request.url?.includes("/bearer/")) {
        // Validate bearer token
        const token = request.headers.authorization?.split(" ")[1]
        if (token !== "EXAMPLE_BEARER_TOKEN") {
          response.writeHead(401, { "Content-Type": "application/json" })
          response.end(JSON.stringify({ error: "Unauthorized" }))
          return
        }
      }

      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify({
          name: "Test Registry",
          homepage: "https://example.com",
          items: items,
        })
      )
      return
    }

    const match = urlWithoutQuery?.match(
      new RegExp(`^${path}/(?:.*/)?([^/]+)$`)
    )
    const itemName = match?.[1]
    const item = itemName
      ? items.find((item) => item.name === itemName)
      : undefined

    if (!item) {
      response.writeHead(404, { "Content-Type": "application/json" })
      response.end(JSON.stringify({ error: "Item not found" }))
      return
    }

    if (request.url?.includes("/bearer/")) {
      // Validate bearer token
      const token = request.headers.authorization?.split(" ")[1]
      if (token !== "EXAMPLE_BEARER_TOKEN") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/api-key/")) {
      // Validate api key
      const apiKey = request.headers["x-api-key"]
      if (apiKey !== "EXAMPLE_API_KEY") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/client-secret/")) {
      // Validate client secret
      const clientSecret = request.headers["x-client-secret"]
      const clientId = request.headers["x-client-id"]
      if (
        clientSecret !== "EXAMPLE_CLIENT_SECRET" ||
        clientId !== "EXAMPLE_CLIENT_ID"
      ) {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/params/")) {
      const token = request.url.split("?")[1]?.split("=")[1]
      if (token !== "EXAMPLE_REGISTRY_TOKEN") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(item))
  })

  return {
    start: async () => {
      await new Promise<void>((resolve) => {
        server.listen(port, () => {
          resolve()
        })
      })
    },
    stop: async () => {
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve()
        })
      })
    },
  }
}

export async function configureRegistries(
  fixturePath: string,
  payload: Record<string, any>
) {
  if (!fs.pathExistsSync(path.join(fixturePath, "components.json"))) {
    await fs.writeJSON(path.join(fixturePath, "components.json"), {
      registries: payload,
    })
  }

  const componentsJson = await fs.readJSON(
    path.join(fixturePath, "components.json")
  )
  componentsJson.registries = payload
  await fs.writeJSON(path.join(fixturePath, "components.json"), componentsJson)
}
