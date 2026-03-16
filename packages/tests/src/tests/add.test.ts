import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  cssHasProperties,
  getRegistryUrl,
  npxShadcn,
} from "../utils/helpers"

// Note: The tests here intentionally do not use a mocked registry.
// We test this against the real registry.

describe("shadcn add", () => {
  it("should add item to project", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add multiple items to project", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button", "card"])
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(true)
  })

  it("should add item from url", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    const registryUrl = getRegistryUrl()
    const url = `${registryUrl}/styles/new-york-v4/login-01.json`
    await npxShadcn(fixturePath, ["add", url])

    expect(
      await fs.pathExists(path.join(fixturePath, "app/login/page.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/input.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/label.tsx"))
    ).toBe(true)
  })

  it("should add component from local file", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-component.json",
    ])

    const helloWorldContent = await fs.readFile(
      path.join(fixturePath, "components/hello-world.tsx"),
      "utf-8"
    )
    expect(helloWorldContent).toBe("console.log('Hello, world!')")
  })

  it("should add registry:page to the correct path", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "login-03"])
    expect(
      await fs.pathExists(path.join(fixturePath, "app/login/page.tsx"))
    ).toBe(true)
  })

  it("should add item with registryDependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "alert-dialog"])
    expect(
      await fs.pathExists(
        path.join(fixturePath, "components/ui/alert-dialog.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add item with npm dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-style.json",
      "--yes",
    ])
    const packageJson = await fs.readJson(
      path.join(fixturePath, "package.json")
    )
    expect(packageJson.dependencies["@tabler/icons-react"]).toBeDefined()
  })

  it("should install cssVars", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-style.json",
      "--yes",
    ])

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )

    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@theme inline",
          properties: {
            "--font-sans": "Inter, sans-serif",
            "--color-brand": "var(--brand)",
            "--color-brand-foreground": "var(--brand-foreground)",
          },
        },
        {
          selector: ":root",
          properties: {
            "--brand": "oklch(20 14.3% 4.1%)",
            "--brand-foreground": "oklch(24 1.3% 10%)",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--brand": "oklch(24 1.3% 10%)",
          },
        },
      ])
    ).toBe(true)
  })

  it("should add item with target", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-item.json",
    ])
    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.readFile(path.join(fixturePath, "path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })

  it("should preview add changes without writing files", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    const result = await npxShadcn(fixturePath, ["add", "button", "--dry-run"])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("shadcn add button (dry run)")
    expect(result.stdout).toContain("components/ui/button.tsx")
    expect(result.stdout).toContain("Run without --dry-run to apply.")
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(false)
  })

  it("should show no changes for identical files with diff", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await npxShadcn(fixturePath, ["add", "button", "--yes"])

    const result = await npxShadcn(fixturePath, [
      "add",
      "button",
      "--diff",
      "button",
      "--yes",
    ])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("shadcn add button (dry run)")
    expect(result.stdout).toContain("components/ui/button.tsx (skip)")
    expect(result.stdout).toContain("No changes.")
  })

  it("should add item with target to src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-item.json",
    ])
    expect(
      await fs.pathExists(path.join(fixturePath, "src/path/to/foo.txt"))
    ).toBe(true)
    expect(
      await fs.readFile(path.join(fixturePath, "src/path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })

  it("should add item with target to root", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const result = await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-item-to-root.json",
    ])
    expect(result.exitCode).toBe(0)
    expect(await fs.pathExists(path.join(fixturePath, "config.json"))).toBe(
      true
    )
    expect(await fs.readJson(path.join(fixturePath, "config.json"))).toEqual({
      foo: "bar",
    })
  })

  it("should add item with target to root when src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-item-to-root.json",
    ])
    expect(await fs.pathExists(path.join(fixturePath, "config.json"))).toBe(
      true
    )
    expect(await fs.readJson(path.join(fixturePath, "config.json"))).toEqual({
      foo: "bar",
    })
  })

  it("should add item with envVars", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-env-vars.json",
    ])
    expect(await fs.pathExists(path.join(fixturePath, ".env.local"))).toBe(true)
    expect(await fs.readFile(path.join(fixturePath, ".env.local"), "utf-8"))
      .toMatchInlineSnapshot(`
      "APP_URL=https://example.com
      EMPTY_VAR=
      MULTILINE_VAR="line1
      line2
      line3"
      "
    `)
  })

  it("should add monorepo components and rewrite app-local imports with package imports", async () => {
    const fixturePath = await createFixtureTestDirectory(
      "vite-monorepo-imports"
    )

    const result = await npxShadcn(
      fixturePath,
      ["add", "login-03", "-c", "apps/web", "--yes"],
      { timeout: 300000 }
    )

    expect(result.exitCode).toBe(0)

    expect(
      await fs.pathExists(
        path.join(fixturePath, "apps/web/src/components/login-form.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(
        path.join(fixturePath, "packages/ui/src/components/button.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(
        path.join(fixturePath, "apps/web/src/components/ui/button.tsx")
      )
    ).toBe(false)

    const loginFormContent = await fs.readFile(
      path.join(fixturePath, "apps/web/src/components/login-form.tsx"),
      "utf-8"
    )
    expect(loginFormContent).toContain(
      'import { cn } from "@workspace/ui/lib/utils"'
    )
    expect(loginFormContent).toContain(
      'import { Button } from "@workspace/ui/components/button"'
    )

    const buttonContent = await fs.readFile(
      path.join(fixturePath, "packages/ui/src/components/button.tsx"),
      "utf-8"
    )
    expect(buttonContent).toContain('import { cn } from "#lib/utils.ts"')
  }, 300000)

  it("should preview monorepo adds without writing files", async () => {
    const fixturePath = await createFixtureTestDirectory(
      "vite-monorepo-imports"
    )

    const result = await npxShadcn(
      fixturePath,
      ["add", "login-03", "-c", "apps/web", "--dry-run", "--yes"],
      { timeout: 300000 }
    )

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("shadcn add login-03 (dry run)")
    expect(result.stdout).toContain(
      "../../packages/ui/src/components/button.tsx"
    )
    expect(result.stdout).toContain("src/components/login-form.tsx")
    expect(
      await fs.pathExists(
        path.join(fixturePath, "apps/web/src/components/login-form.tsx")
      )
    ).toBe(false)
    expect(
      await fs.pathExists(
        path.join(fixturePath, "packages/ui/src/components/button.tsx")
      )
    ).toBe(false)
  }, 300000)

  it("should show no changes for identical monorepo files with diff", async () => {
    const fixturePath = await createFixtureTestDirectory(
      "vite-monorepo-imports"
    )

    await npxShadcn(
      fixturePath,
      ["add", "login-03", "-c", "apps/web", "--yes"],
      { timeout: 300000 }
    )

    const result = await npxShadcn(
      fixturePath,
      ["add", "login-03", "-c", "apps/web", "--diff", "login-form", "--yes"],
      { timeout: 300000 }
    )

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("shadcn add login-03 (dry run)")
    expect(result.stdout).toContain("src/components/login-form.tsx (skip)")
    expect(result.stdout).toContain("No changes.")
  }, 300000)

  it("should add NOT update existing envVars", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    await fs.writeFile(
      path.join(fixturePath, ".env.local"),
      "APP_URL=https://foo.com"
    )

    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-env-vars.json",
    ])

    expect(await fs.pathExists(path.join(fixturePath, ".env.local"))).toBe(true)
    expect(await fs.readFile(path.join(fixturePath, ".env.local"), "utf-8"))
      .toMatchInlineSnapshot(`
      "APP_URL=https://foo.com

      EMPTY_VAR=
      MULTILINE_VAR=line1
      "
    `)
  })

  it("should use existing .env if it exists", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    await fs.writeFile(
      path.join(fixturePath, ".env"),
      "APP_URL=https://foo.com"
    )

    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-env-vars.json",
    ])

    expect(await fs.pathExists(path.join(fixturePath, ".env.local"))).toBe(
      false
    )
    expect(await fs.readFile(path.join(fixturePath, ".env"), "utf-8"))
      .toMatchInlineSnapshot(`
      "APP_URL=https://foo.com

      EMPTY_VAR=
      MULTILINE_VAR=line1
      "
    `)
  })

  it("should add registry:item with no framework", async () => {
    const fixturePath = await createFixtureTestDirectory("no-framework")
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-item.json",
    ])

    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.readFile(path.join(fixturePath, "path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })

  it("should add component to custom file path", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "card", "--path=custom/my-card.tsx"])

    expect(
      await fs.pathExists(path.join(fixturePath, "custom/my-card.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(false)
  })

  it("should add component to custom directory", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "card", "--path=custom/components"])

    expect(
      await fs.pathExists(path.join(fixturePath, "custom/components/card.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(false)
  })

  it("should add multiple files to custom directory", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "input", "card", "--path=custom/ui"])

    expect(
      await fs.pathExists(path.join(fixturePath, "custom/ui/input.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "custom/ui/card.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/input.tsx"))
    ).toBe(false)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(false)
  })

  it("should add at-property", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, [
      "add",
      "../../fixtures/registry/example-at-property.json",
      "--yes",
    ])

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )

    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@property --foo",
          properties: {
            syntax: "'<number>'",
            inherits: "false",
            "initial-value": "0",
          },
        },
      ])
    ).toBe(true)
  })
})

describe("shadcn registry add", () => {
  it("should add registry from index to components.json", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["registry", "add", "@magicui"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.registries).toBeDefined()
    expect(componentsJson.registries["@magicui"]).toBeDefined()
    expect(componentsJson.registries["@magicui"]).toContain("{name}")
  })

  it("should add custom registry with URL", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, [
      "registry",
      "add",
      "@mycompany=https://example.com/r/{name}.json",
    ])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.registries["@mycompany"]).toBe(
      "https://example.com/r/{name}.json"
    )
  })

  it("should add multiple registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["registry", "add", "@magicui", "@aceternity"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.registries["@magicui"]).toBeDefined()
    expect(componentsJson.registries["@aceternity"]).toBeDefined()
  })

  it("should skip already configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["registry", "add", "@magicui"])

    // Add again - should not error.
    await npxShadcn(fixturePath, ["registry", "add", "@magicui"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.registries["@magicui"]).toBeDefined()
  })

  it("should error for registry not in index without URL", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const result = await npxShadcn(fixturePath, [
      "registry",
      "add",
      "@nonexistent-registry-12345",
    ])
    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("not found")
  })

  it("should error for invalid URL missing {name}", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const result = await npxShadcn(fixturePath, [
      "registry",
      "add",
      "@foo=https://example.com/bad.json",
    ])
    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("{name}")
  })

  it("should require components.json for adding registries", async () => {
    const fixturePath = await createFixtureTestDirectory("no-framework")

    // No init, so no components.json.
    const result = await npxShadcn(fixturePath, ["registry", "add", "@magicui"])
    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("components.json")
  })
})
