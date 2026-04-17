import path from "path"
import fs from "fs-extra"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { preFlightInit } from "./preflight-init"

let tmpDir: string

beforeEach(async () => {
  tmpDir = path.join(
    await fs.realpath(require("os").tmpdir()),
    `shadcn-preflight-init-test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  )
  await fs.ensureDir(tmpDir)
})

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe("preFlightInit", () => {
  it("should not error on missing framework when existingConfig is provided", async () => {
    // Simulate a shadcn monorepo UI workspace: a package.json with
    // tailwind and an import alias but no framework config. This mirrors
    // `packages/ui` in a shadcn-generated monorepo where the UI library
    // is a sibling of the app workspace (e.g. `apps/web`).
    await fs.writeJson(path.join(tmpDir, "package.json"), {
      name: "@acme/ui",
      dependencies: {
        tailwindcss: "^4.0.0",
      },
    })
    await fs.writeFile(
      path.join(tmpDir, "styles.css"),
      `@import "tailwindcss";\n`
    )
    await fs.writeJson(path.join(tmpDir, "tsconfig.json"), {
      compilerOptions: {
        paths: {
          "@acme/ui/*": ["./src/*"],
        },
      },
    })

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    const result = await preFlightInit({
      cwd: tmpDir,
      yes: true,
      defaults: false,
      // Force bypasses the components.json-exists check — apply uses
      // a backup file to side-step that, but for the test this is equivalent.
      force: true,
      silent: true,
      isNewProject: false,
      cssVariables: true,
      installStyleIndex: true,
      existingConfig: {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "new-york",
        tailwind: {
          config: "",
          css: "styles.css",
          baseColor: "neutral",
          cssVariables: true,
          prefix: "",
        },
        aliases: {
          components: "@acme/ui/components",
          ui: "@acme/ui/components/ui",
          hooks: "@acme/ui/hooks",
          lib: "@acme/ui/lib",
          utils: "@acme/ui/lib/utils",
        },
      },
    })

    expect(exitSpy).not.toHaveBeenCalled()
    expect(result.errors).toEqual({})
    expect(result.projectInfo).toBeTruthy()

    exitSpy.mockRestore()
  })

  it("should error on missing framework when no existingConfig is provided", async () => {
    await fs.writeJson(path.join(tmpDir, "package.json"), {
      name: "@acme/ui",
      dependencies: {
        tailwindcss: "^4.0.0",
      },
    })
    await fs.writeFile(
      path.join(tmpDir, "styles.css"),
      `@import "tailwindcss";\n`
    )
    await fs.writeJson(path.join(tmpDir, "tsconfig.json"), {
      compilerOptions: {
        paths: {
          "@acme/ui/*": ["./src/*"],
        },
      },
    })

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await preFlightInit({
      cwd: tmpDir,
      yes: true,
      defaults: false,
      force: true,
      silent: true,
      isNewProject: false,
      cssVariables: true,
      installStyleIndex: true,
    })

    expect(exitSpy).toHaveBeenCalledWith(1)

    exitSpy.mockRestore()
  })
})
