import path from "path"
import { resolveConfigPaths } from "@/src/utils/get-config"
import fs from "fs-extra"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

let tmpDir: string

beforeEach(async () => {
  tmpDir = path.join(
    await fs.realpath(require("os").tmpdir()),
    `shadcn-config-test-${Date.now()}`
  )
  await fs.ensureDir(tmpDir)
})

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe("resolveConfigPaths", () => {
  it("resolves aliases from tsconfig.app.json when tsconfig.json only contains references", async () => {
    await fs.writeJson(path.join(tmpDir, "tsconfig.json"), {
      files: [],
      references: [{ path: "./tsconfig.app.json" }],
    })
    await fs.writeJson(path.join(tmpDir, "tsconfig.app.json"), {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
        },
      },
    })

    const config = await resolveConfigPaths(tmpDir, {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york",
      rsc: false,
      tsx: true,
      tailwind: {
        config: "tailwind.config.ts",
        css: "src/index.css",
        baseColor: "neutral",
        cssVariables: true,
        prefix: "",
      },
      iconLibrary: "lucide",
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        utils: "@/lib/utils",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    })

    expect(config.resolvedPaths.components).toBe(
      path.resolve(tmpDir, "src/components")
    )
    expect(config.resolvedPaths.ui).toBe(
      path.resolve(tmpDir, "src/components/ui")
    )
    expect(config.resolvedPaths.utils).toBe(
      path.resolve(tmpDir, "src/lib/utils")
    )
  })
})
