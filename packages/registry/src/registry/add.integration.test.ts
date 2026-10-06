import { promises as fs } from "fs"
import { createServer } from "http"
import { tmpdir } from "os"
import path from "path"
import { createConfig } from "@/src/utils/get-config"
import { afterEach, describe, expect, it } from "vitest"

import { addRegistryItems } from "./add"
import { getRegistriesConfig } from "./api"
import { RegistryNotConfiguredError } from "./errors"

describe("addRegistryItems package.json registries", () => {
  let tempDir: string | undefined

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true })
      tempDir = undefined
    }
  })

  it("installs a universal item with a registries-only config", async () => {
    const registryItem = {
      name: "agent",
      type: "registry:file",
      files: [
        {
          path: "agent.ts",
          type: "registry:file",
          target: "generated/agent.ts",
          content: "export const agent = true\n",
        },
      ],
    }
    const server = createServer((request, response) => {
      if (request.url === "/agent.json") {
        if (request.headers.authorization !== "Bearer project-token") {
          response.writeHead(401)
          response.end()
          return
        }

        response.writeHead(200, { "content-type": "application/json" })
        response.end(JSON.stringify(registryItem))
        return
      }

      response.writeHead(404)
      response.end()
    })

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve)
    })

    try {
      const address = server.address()
      if (!address || typeof address === "string") {
        throw new Error("Failed to start test registry server.")
      }

      tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-add-registry-"))
      await fs.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify({
          name: "registry-consumer",
          private: true,
          registries: {
            "@acme": {
              url: `http://127.0.0.1:${address.port}/{name}.json`,
              headers: {
                Authorization: "Bearer ${REGISTRY_TOKEN}",
              },
            },
          },
        })
      )
      await fs.writeFile(
        path.join(tempDir, ".env"),
        "REGISTRY_TOKEN=project-token\n"
      )

      const config = await getRegistriesConfig(tempDir)

      await addRegistryItems(["@acme/agent"], {
        cwd: tempDir,
        config,
        silent: true,
      })

      await expect(
        fs.readFile(path.join(tempDir, "generated/agent.ts"), "utf8")
      ).resolves.toBe("export const agent = true\n")
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
    }
  })

  it("installs a non-universal item with a full project config", async () => {
    const registryItem = {
      name: "button",
      type: "registry:ui",
      files: [
        {
          path: "button.tsx",
          type: "registry:ui",
          content: "export function Button() {}\n",
        },
      ],
    }
    const server = createServer((request, response) => {
      if (request.url === "/button.json") {
        response.writeHead(200, { "content-type": "application/json" })
        response.end(JSON.stringify(registryItem))
        return
      }

      response.writeHead(404)
      response.end()
    })

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve)
    })

    try {
      const address = server.address()
      if (!address || typeof address === "string") {
        throw new Error("Failed to start test registry server.")
      }

      tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-add-registry-"))
      await fs.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify({
          name: "registry-consumer",
          private: true,
        })
      )

      const config = createConfig({
        registries: {
          "@acme": `http://127.0.0.1:${address.port}/{name}.json`,
        },
        resolvedPaths: {
          cwd: tempDir,
          components: path.join(tempDir, "components"),
          hooks: path.join(tempDir, "hooks"),
          lib: path.join(tempDir, "lib"),
          ui: path.join(tempDir, "components/ui"),
          utils: path.join(tempDir, "lib/utils"),
        },
      })

      await addRegistryItems(["@acme/button"], {
        cwd: tempDir,
        config,
        silent: true,
        skipFonts: true,
      })

      await expect(
        fs.readFile(path.join(tempDir, "components/ui/button.tsx"), "utf8")
      ).resolves.toBe("export function Button() {}\n")
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
    }
  })

  it("requires custom registry namespaces to be configured", async () => {
    tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-add-registry-"))

    await expect(
      addRegistryItems(["@missing/agent"], {
        cwd: tempDir,
        config: {
          registries: {},
        },
        silent: true,
      })
    ).rejects.toBeInstanceOf(RegistryNotConfiguredError)
  })
})
