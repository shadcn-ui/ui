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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "button"])
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add multiple items to project", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "login-03"])
    expect(
      await fs.pathExists(path.join(fixturePath, "app/login/page.tsx"))
    ).toBe(true)
  })

  it("should add item with registryDependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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

  it("should add item with target to src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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

  it("should add item with target to root when src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
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

  it("should add NOT update existing envVars", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])

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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])

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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, [
      "add",
      "button",
      "--path=custom/my-button.tsx",
    ])

    expect(
      await fs.pathExists(path.join(fixturePath, "custom/my-button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(false)
  })

  it("should add component to custom directory", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "button", "--path=custom/components"])

    expect(
      await fs.pathExists(
        path.join(fixturePath, "custom/components/button.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(false)
  })

  it("should add multiple files to custom directory", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "button", "card", "--path=custom/ui"])

    expect(
      await fs.pathExists(path.join(fixturePath, "custom/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "custom/ui/card.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
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
