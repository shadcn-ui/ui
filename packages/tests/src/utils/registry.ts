import { createServer } from "http"
import path from "path"
import fs from "fs-extra"

// Neutral theme CSS vars used by the mock /init handler.
const NEUTRAL_THEME_LIGHT: Record<string, string> = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  destructive: "oklch(0.58 0.22 27)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  "chart-1": "oklch(0.809 0.105 251.813)",
  "chart-2": "oklch(0.623 0.214 259.815)",
  "chart-3": "oklch(0.546 0.245 262.881)",
  "chart-4": "oklch(0.488 0.243 264.376)",
  "chart-5": "oklch(0.424 0.199 265.638)",
  radius: "0.625rem",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(0.205 0 0)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.97 0 0)",
  "sidebar-accent-foreground": "oklch(0.205 0 0)",
  "sidebar-border": "oklch(0.922 0 0)",
  "sidebar-ring": "oklch(0.708 0 0)",
}

const NEUTRAL_THEME_DARK: Record<string, string> = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.87 0.00 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.708 0 0)",
  accent: "oklch(0.371 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.556 0 0)",
  "chart-1": "oklch(0.809 0.105 251.813)",
  "chart-2": "oklch(0.623 0.214 259.815)",
  "chart-3": "oklch(0.546 0.245 262.881)",
  "chart-4": "oklch(0.488 0.243 264.376)",
  "chart-5": "oklch(0.424 0.199 265.638)",
  sidebar: "oklch(0.205 0 0)",
  "sidebar-foreground": "oklch(0.985 0 0)",
  "sidebar-primary": "oklch(0.488 0.243 264.376)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.269 0 0)",
  "sidebar-accent-foreground": "oklch(0.985 0 0)",
  "sidebar-border": "oklch(1 0 0 / 10%)",
  "sidebar-ring": "oklch(0.556 0 0)",
}

// Base dependencies by base name.
const BASE_DEPENDENCIES: Record<string, string[]> = {
  radix: ["radix-ui"],
  base: ["@base-ui/react"],
}

// Build a mock /init response matching buildRegistryBase() output.
function buildMockInitResponse(params: URLSearchParams) {
  const base = params.get("base") ?? "base"
  const style = params.get("style") ?? "nova"
  const iconLibrary = params.get("iconLibrary") ?? "lucide"
  const baseColor = params.get("baseColor") ?? "neutral"
  const font = params.get("font") ?? "geist"
  const rtl = params.get("rtl") === "true"
  const menuAccent = params.get("menuAccent") ?? "subtle"
  const menuColor = params.get("menuColor") ?? "default"
  const template = params.get("template") ?? undefined

  const dependencies = [
    "shadcn@latest",
    "class-variance-authority",
    "tw-animate-css",
    ...(BASE_DEPENDENCIES[base] ?? []),
    "lucide-react",
  ]

  const registryDependencies = ["utils"]
  if (font) {
    registryDependencies.push(`font-${font}`)
  }

  return {
    name: `${base}-${style}`,
    extends: "none",
    type: "registry:base",
    config: {
      style: `${base}-${style}`,
      iconLibrary,
      rtl,
      menuColor,
      menuAccent,
      tailwind: {
        baseColor,
      },
    },
    dependencies,
    registryDependencies,
    cssVars: {
      light: { ...NEUTRAL_THEME_LIGHT },
      dark: { ...NEUTRAL_THEME_DARK },
    },
    css: {
      '@import "tw-animate-css"': {},
      '@import "shadcn/tailwind.css"': {},
      "@layer base": {
        "*": { "@apply border-border outline-ring/50": {} },
        body: { "@apply bg-background text-foreground": {} },
      },
    },
    ...(rtl && {
      docs: `To learn how to set up the RTL provider and fonts for your app, see https://ui.shadcn.com/docs/rtl/${
        template === "next-monorepo" ? "next" : template ?? "next"
      }`,
    }),
  }
}

export async function createRegistryServer(
  items: Array<{ name: string; type: string } & Record<string, unknown>>,
  {
    port = 4444,
    path: basePath = "/r",
    publicDir,
  }: {
    port?: number
    path?: string
    publicDir?: string
  }
) {
  const server = createServer((request, response) => {
    const urlRaw = request.url?.split("?")[0]

    // Handle /init endpoint.
    if (request.url?.startsWith("/init")) {
      const params = new URLSearchParams(request.url.split("?")[1] ?? "")
      const initResponse = buildMockInitResponse(params)
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(JSON.stringify(initResponse))
      return
    }

    // When publicDir is set, try serving static JSON files first.
    if (publicDir && urlRaw?.startsWith(basePath + "/")) {
      const relativePath = urlRaw.slice(basePath.length + 1)
      const filePath = path.join(publicDir, relativePath)
      if (fs.pathExistsSync(filePath)) {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(fs.readFileSync(filePath, "utf-8"))
        return
      }
    }

    // Handle registries.json endpoint (don't strip .json for this one).
    if (urlRaw?.endsWith("/registries.json")) {
      response.writeHead(200, { "Content-Type": "application/json" })
      // Return empty registry array for tests - we want to test manual configuration.
      response.end(JSON.stringify([]))
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

    // Match /styles/{style}/index for the registry style index (e.g., /styles/new-york-v4/index).
    if (urlWithoutQuery?.match(/\/styles\/[^/]+\/index$/)) {
      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(
        JSON.stringify({
          name: "index",
          type: "registry:style",
          registryDependencies: ["utils"],
          cssVars: {},
          files: [],
        })
      )
      return
    }

    // Match /r/index for the registry index (but NOT paths like /styles/foo/index).
    if (urlWithoutQuery?.match(/\/r\/index$/)) {
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
      new RegExp(`^${basePath}/(?:.*/)?([^/]+)$`)
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
