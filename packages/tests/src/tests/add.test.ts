import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  createRemoteRegistryItemFromPayload,
  cssHasProperties,
  fileExists,
  npxShadcn,
} from "../utils/helpers"

describe("shadcn add", () => {
  it("should add item to project", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "button"])
    expect(
      await fileExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add multiple items to project", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "button", "card"])
    expect(
      await fileExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fileExists(path.join(fixturePath, "components/ui/card.tsx"))
    ).toBe(true)
  })

  it("should add item with registryDependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])
    await npxShadcn(fixturePath, ["add", "alert-dialog"])
    expect(
      await fileExists(path.join(fixturePath, "components/ui/alert-dialog.tsx"))
    ).toBe(true)
    expect(
      await fileExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add item from url", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])

    const server = await createRemoteRegistryItemFromPayload({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "login-01",
      type: "registry:block",
      description: "A simple login form.",
      registryDependencies: ["button", "card", "input", "label"],
      files: [
        {
          path: "registry/new-york-v4/blocks/login-01/page.tsx",
          content:
            'import { LoginForm } from "@/registry/new-york-v4/blocks/login-01/components/login-form"\n\nexport default function Page() {\n  return (\n    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">\n      <div className="w-full max-w-sm">\n        <LoginForm />\n      </div>\n    </div>\n  )\n}\n',
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          path: "registry/new-york-v4/blocks/login-01/components/login-form.tsx",
          content:
            "export function LoginForm() { return <div>Login Form</div> }",
          type: "registry:component",
        },
      ],
      categories: ["authentication", "login"],
    })

    try {
      await npxShadcn(fixturePath, ["add", server.url])

      expect(
        await fileExists(path.join(fixturePath, "components/ui/button.tsx"))
      ).toBe(true)
      expect(
        await fileExists(path.join(fixturePath, "components/ui/card.tsx"))
      ).toBe(true)
      expect(
        await fileExists(path.join(fixturePath, "components/ui/input.tsx"))
      ).toBe(true)
      expect(
        await fileExists(path.join(fixturePath, "components/ui/label.tsx"))
      ).toBe(true)

      // Check that the example file was created
      expect(
        await fileExists(path.join(fixturePath, "app/login/page.tsx"))
      ).toBe(true)
    } finally {
      await server.close()
    }
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
    expect(await fileExists(path.join(fixturePath, "app/login/page.tsx"))).toBe(
      true
    )
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
    expect(await fileExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
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
      await fileExists(path.join(fixturePath, "src/path/to/foo.txt"))
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
    expect(await fileExists(path.join(fixturePath, "config.json"))).toBe(true)
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
    expect(await fileExists(path.join(fixturePath, "config.json"))).toBe(true)
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
    expect(await fileExists(path.join(fixturePath, ".env.local"))).toBe(true)
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

    expect(await fileExists(path.join(fixturePath, ".env.local"))).toBe(true)
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

    expect(await fileExists(path.join(fixturePath, ".env.local"))).toBe(false)
    expect(await fs.readFile(path.join(fixturePath, ".env"), "utf-8"))
      .toMatchInlineSnapshot(`
      "APP_URL=https://foo.com

      EMPTY_VAR=
      MULTILINE_VAR=line1
      "
    `)
  })
})
