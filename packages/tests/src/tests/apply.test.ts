import os from "os"
import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  getRegistryUrl,
  npxShadcn,
} from "../utils/helpers"

async function createInitializedProject() {
  const fixturePath = await createFixtureTestDirectory("next-app")
  await npxShadcn(fixturePath, ["init", "--defaults"])
  await npxShadcn(fixturePath, ["add", "button"])
  return fixturePath
}

async function createInitializedRtlProject() {
  const fixturePath = await createFixtureTestDirectory("next-app")
  await npxShadcn(fixturePath, ["init", "--defaults", "--rtl"])
  await npxShadcn(fixturePath, ["add", "button"])
  return fixturePath
}

async function createInitializedViteRtlProject() {
  const fixturePath = await createFixtureTestDirectory("vite-app")
  await npxShadcn(fixturePath, ["init", "--defaults", "--rtl"])
  await npxShadcn(
    fixturePath,
    ["add", "breadcrumb", "pagination", "sidebar", "-y"],
    {
      timeout: 120000,
    }
  )
  return fixturePath
}

async function createInitializedMonorepoProject() {
  const rootDir = path.join(
    os.tmpdir(),
    `shadcn-apply-monorepo-${process.pid}-${Date.now()}`
  )
  const projectName = `test-apply-monorepo-${process.pid}`
  await fs.ensureDir(rootDir)
  const result = await npxShadcn(
    rootDir,
    [
      "init",
      "--name",
      projectName,
      "-t",
      "vite",
      "--monorepo",
      "--preset",
      "nova",
      "--base",
      "radix",
    ],
    {
      timeout: 300000,
    }
  )

  expect(result.exitCode).toBe(0)

  return {
    projectPath: path.join(rootDir, projectName),
    rootDir,
  }
}

async function createInitializedRadixProject() {
  const fixturePath = await createFixtureTestDirectory("next-app")
  await npxShadcn(fixturePath, ["init", "--preset", "a0", "--base", "radix"])
  await npxShadcn(fixturePath, ["add", "button"])
  return fixturePath
}

function getMonorepoPresetConfig(config: {
  style: string
  tailwind: {
    baseColor: string
    cssVariables: boolean
  }
  iconLibrary?: string
  rtl?: boolean
  menuColor?: string
  menuAccent?: string
}) {
  return {
    style: config.style,
    baseColor: config.tailwind.baseColor,
    cssVariables: config.tailwind.cssVariables,
    iconLibrary: config.iconLibrary,
    rtl: config.rtl ?? false,
    menuColor: config.menuColor ?? "default",
    menuAccent: config.menuAccent ?? "subtle",
  }
}

describe("shadcn apply", () => {
  const itIfNotCi = process.env.CI ? it.skip : it

  it("should apply a preset with --preset <code>", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "a0",
      "-y",
    ])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Preset applied successfully")
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should apply a preset with positional <code>", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, ["apply", "a0", "-y"])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Preset applied successfully")
  })

  it("should allow the same positional and flag preset values", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "a0",
      "--preset",
      "a0",
      "-y",
    ])

    expect(result.exitCode).toBe(0)
  })

  it("should reject different positional and flag preset values", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "a0",
      "--preset",
      "b0",
      "-y",
    ])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("Received two different preset values")
  })

  it("should offer the preset builder when no preset is provided", async () => {
    const fixturePath = await createInitializedProject()
    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    const createUrl = new URL(
      `${getRegistryUrl().replace(/\/r\/?$/, "")}/create`
    )
    createUrl.searchParams.set("command", "init")
    createUrl.searchParams.set("template", "next")
    createUrl.searchParams.set(
      "base",
      componentsJson.style.startsWith("base-") ? "base" : "radix"
    )
    const result = await npxShadcn(fixturePath, ["apply"], {
      input: "n\n",
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Build your custom preset on")
    expect(result.stdout).toContain(createUrl.toString())
    expect(result.stdout).toContain("shadcn apply --preset <preset>")
  })

  it("should print the preset builder url without prompting when no preset is provided with -y", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, ["apply", "-y"])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Build your custom preset on")
    expect(result.stdout).not.toContain("Open in browser?")
  })

  it("should warn before applying and list detected components", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, ["apply", "--preset", "a0"], {
      input: "y\n",
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain(
      "Applying a new preset will overwrite existing UI components, fonts, and CSS variables."
    )
    expect(result.stdout).toContain(
      "Commit or stash your changes before continuing so you can easily go back."
    )
    expect(result.stdout).toContain(
      "The following components will be re-installed:"
    )
    expect(result.stdout).toContain("button")
  })

  it("should skip confirmation with -y", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "a0",
      "-y",
    ])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).not.toContain("Would you like to continue?")
  })

  it("should suggest init when components.json is missing", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["apply", "--preset", "a0"])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("components.json")
    expect(result.stdout).toContain("shadcn init --preset a0")
  })

  it("should not show undefined in init guidance when components.json is missing and no preset is provided", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["apply"])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("components.json")
    expect(result.stdout).toContain("shadcn init")
    expect(result.stdout).not.toContain("undefined")
  })

  it("should fail on invalid components.json", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await fs.writeFile(path.join(fixturePath, "components.json"), "{", "utf8")

    const result = await npxShadcn(fixturePath, ["apply", "--preset", "a0"])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("An invalid components.json file was found")
  })

  it("should restore components.json when applying a preset fails", async () => {
    const fixturePath = await createInitializedProject()
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const original = await fs.readFile(componentsJsonPath, "utf8")

    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      `${getRegistryUrl()}/does-not-exist.json`,
      "-y",
    ])

    expect(result.exitCode).toBe(1)
    expect(await fs.readFile(componentsJsonPath, "utf8")).toBe(original)
    expect(await fs.pathExists(`${componentsJsonPath}.bak`)).toBe(false)
  })

  it("should abort before applying when components.json cannot be backed up", async () => {
    const fixturePath = await createInitializedProject()
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const buttonPath = path.join(fixturePath, "components/ui/button.tsx")
    const originalConfig = await fs.readFile(componentsJsonPath, "utf8")
    const originalButton = await fs.readFile(buttonPath, "utf8")

    await fs.ensureDir(`${componentsJsonPath}.bak`)

    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "lyra",
      "-y",
    ])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("Could not back up components.json")
    expect(await fs.readFile(componentsJsonPath, "utf8")).toBe(originalConfig)
    expect(await fs.readFile(buttonPath, "utf8")).toBe(originalButton)
    expect((await fs.stat(`${componentsJsonPath}.bak`)).isDirectory()).toBe(
      true
    )
  })

  it("should guide the user to a workspace when run from a monorepo root", async () => {
    const rootDir = path.join(
      os.tmpdir(),
      `shadcn-apply-monorepo-${process.pid}-${Date.now()}`
    )

    await fs.ensureDir(path.join(rootDir, "apps/web"))
    await fs.writeJson(path.join(rootDir, "package.json"), {
      private: true,
      workspaces: ["apps/*"],
    })
    await fs.writeFile(
      path.join(rootDir, "pnpm-workspace.yaml"),
      'packages:\n  - "apps/*"\n',
      "utf8"
    )
    await fs.writeJson(path.join(rootDir, "apps/web/package.json"), {
      name: "web",
      version: "0.0.0",
    })
    await fs.writeFile(
      path.join(rootDir, "apps/web/next.config.ts"),
      "",
      "utf8"
    )

    const result = await npxShadcn(rootDir, ["apply", "--preset", "a0"])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("monorepo root")
    expect(result.stdout).toContain(
      "shadcn apply --preset <preset> -c apps/web"
    )
    expect(result.stdout).not.toContain(
      "shadcn apply --preset <preset> -c packages/ui"
    )

    await fs.remove(rootDir)
  })

  it("should update the project config and reinstall detected components", async () => {
    const fixturePath = await createInitializedProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "lyra",
      "-y",
    ])

    expect(result.exitCode).toBe(0)

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("base-lyra")
    expect(componentsJson.iconLibrary).toBe("phosphor")
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should preserve rtl when applying a named preset", async () => {
    const fixturePath = await createInitializedRtlProject()
    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "lyra",
      "-y",
    ])

    expect(result.exitCode).toBe(0)

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.rtl).toBe(true)
  })

  it("should preserve the current base for raw preset urls", async () => {
    const fixturePath = await createInitializedRadixProject()
    const presetUrl = `${getRegistryUrl().replace(/\/r\/?$/, "")}/init?base=base&style=lyra&baseColor=neutral&theme=neutral&iconLibrary=phosphor&font=manrope&rtl=false&menuAccent=subtle&menuColor=default&radius=default`

    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      presetUrl,
      "-y",
    ])

    expect(result.exitCode).toBe(0)

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("radix-lyra")
  })

  it("should preserve rtl for raw preset urls", async () => {
    const fixturePath = await createInitializedRtlProject()
    const presetUrl = `${getRegistryUrl().replace(/\/r\/?$/, "")}/init?base=base&style=lyra&baseColor=neutral&theme=neutral&iconLibrary=phosphor&font=manrope&rtl=false&menuAccent=subtle&menuColor=default&radius=default`

    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      presetUrl,
      "-y",
    ])

    expect(result.exitCode).toBe(0)

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.rtl).toBe(true)
    expect(componentsJson.style).toBe("base-lyra")
  })

  it("should preserve non-preset config when applying a preset", async () => {
    const fixturePath = await createInitializedProject()
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const componentsJson = await fs.readJson(componentsJsonPath)

    componentsJson.tailwind.prefix = "tw-"
    await fs.writeJson(componentsJsonPath, componentsJson, { spaces: 2 })

    const result = await npxShadcn(fixturePath, [
      "apply",
      "--preset",
      "lyra",
      "-y",
    ])

    expect(result.exitCode).toBe(0)

    const updatedConfig = await fs.readJson(componentsJsonPath)
    expect(updatedConfig.tailwind.prefix).toBe("tw-")
    expect(updatedConfig.style).toBe("base-lyra")
    expect(updatedConfig.iconLibrary).toBe("phosphor")
  })

  it("should keep vite component output rtl-aware when applying a new preset", async () => {
    const fixturePath = await createInitializedViteRtlProject()
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const breadcrumbPath = path.join(
      fixturePath,
      "src/components/ui/breadcrumb.tsx"
    )
    const paginationPath = path.join(
      fixturePath,
      "src/components/ui/pagination.tsx"
    )
    const sidebarPath = path.join(fixturePath, "src/components/ui/sidebar.tsx")

    const initialConfig = await fs.readJson(componentsJsonPath)
    const initialBreadcrumb = await fs.readFile(breadcrumbPath, "utf8")
    const initialPagination = await fs.readFile(paginationPath, "utf8")
    const initialSidebar = await fs.readFile(sidebarPath, "utf8")

    expect(initialConfig.style).toBe("base-nova")
    expect(initialConfig.iconLibrary).toBe("lucide")
    expect(initialConfig.rtl).toBe(true)
    expect(initialBreadcrumb).toContain("rtl:rotate-180")
    expect(initialPagination).toContain("ps-1.5!")
    expect(initialPagination).toContain("pe-1.5!")
    expect(initialPagination).toContain("rtl:rotate-180")
    expect(initialSidebar).toContain("start-")
    expect(initialSidebar).toContain("end-")
    expect(initialSidebar).toContain("ms-")
    expect(initialSidebar).toContain("pe-")
    expect(initialSidebar).toContain("rtl:")

    const result = await npxShadcn(
      fixturePath,
      ["apply", "--preset", "lyra", "-y"],
      {
        timeout: 120000,
      }
    )

    expect(result.exitCode).toBe(0)

    const updatedConfig = await fs.readJson(componentsJsonPath)
    const updatedBreadcrumb = await fs.readFile(breadcrumbPath, "utf8")
    const updatedPagination = await fs.readFile(paginationPath, "utf8")
    const updatedSidebar = await fs.readFile(sidebarPath, "utf8")

    expect(updatedConfig.style).toBe("base-lyra")
    expect(updatedConfig.iconLibrary).toBe("phosphor")
    expect(updatedConfig.rtl).toBe(true)
    expect(updatedBreadcrumb).toContain("rtl:rotate-180")
    expect(updatedPagination).toContain("ps-1.5!")
    expect(updatedPagination).toContain("pe-1.5!")
    expect(updatedPagination).toContain("rtl:rotate-180")
    expect(updatedSidebar).toContain("start-")
    expect(updatedSidebar).toContain("end-")
    expect(updatedSidebar).toContain("ms-")
    expect(updatedSidebar).toContain("pe-")
    expect(updatedSidebar).toContain("rtl:")
    expect(updatedBreadcrumb).not.toBe(initialBreadcrumb)
    expect(updatedPagination).not.toBe(initialPagination)
    expect(updatedSidebar).not.toBe(initialSidebar)
  })

  itIfNotCi(
    "should keep the app config updated when linked workspace sync fails",
    async () => {
      const { projectPath, rootDir } = await createInitializedMonorepoProject()
      const presetUrl = `${getRegistryUrl().replace(/\/r\/?$/, "")}/init?base=base&style=lyra&baseColor=neutral&theme=neutral&iconLibrary=phosphor&font=manrope&rtl=true&menuAccent=bold&menuColor=inverted&radius=default`
      const appConfigPath = path.join(projectPath, "apps/web/components.json")
      const uiConfigPath = path.join(projectPath, "packages/ui/components.json")
      const buttonPath = path.join(
        projectPath,
        "packages/ui/src/components/button.tsx"
      )
      const originalButton = await fs.readFile(buttonPath, "utf8")

      await fs.ensureDir(`${uiConfigPath}.bak`)

      try {
        const result = await npxShadcn(
          projectPath,
          ["apply", "--preset", presetUrl, "-y", "-c", "apps/web"],
          {
            timeout: 300000,
          }
        )

        expect(result.exitCode).toBe(1)
        expect(result.stdout).toContain(
          "Failed to sync linked workspace configs"
        )

        const appConfig = await fs.readJson(appConfigPath)
        const uiConfig = await fs.readJson(uiConfigPath)
        expect(appConfig.style).toBe("radix-lyra")
        expect(appConfig.iconLibrary).toBe("phosphor")
        expect(appConfig.menuColor).toBe("inverted")
        expect(appConfig.menuAccent).toBe("bold")
        expect(appConfig.rtl).toBe(false)

        expect(uiConfig.style).toBe("radix-nova")
        expect(uiConfig.tailwind.baseColor).toBe("neutral")
        expect(uiConfig.tailwind.cssVariables).toBe(true)
        expect(uiConfig.iconLibrary).toBe("phosphor")
        expect(uiConfig.menuColor).toBe("inverted")
        expect(uiConfig.menuAccent).toBe("bold")
        expect(uiConfig.rtl).toBe(false)
        expect(await fs.readFile(buttonPath, "utf8")).not.toBe(originalButton)
      } finally {
        await fs.remove(rootDir)
      }
    },
    300000
  )

  itIfNotCi(
    "should sync linked workspace configs when applying from apps/web",
    async () => {
      const { projectPath, rootDir } = await createInitializedMonorepoProject()
      const presetUrl = `${getRegistryUrl().replace(/\/r\/?$/, "")}/init?base=base&style=lyra&baseColor=neutral&theme=neutral&iconLibrary=phosphor&font=manrope&rtl=true&menuAccent=bold&menuColor=inverted&radius=default`

      try {
        const result = await npxShadcn(
          projectPath,
          ["apply", "--preset", presetUrl, "-y", "-c", "apps/web"],
          {
            timeout: 300000,
          }
        )

        expect(result.exitCode).toBe(0)

        const appConfig = await fs.readJson(
          path.join(projectPath, "apps/web/components.json")
        )
        const uiConfig = await fs.readJson(
          path.join(projectPath, "packages/ui/components.json")
        )

        expect(getMonorepoPresetConfig(appConfig)).toEqual(
          getMonorepoPresetConfig(uiConfig)
        )
        expect(appConfig.style).toBe("radix-lyra")
        expect(appConfig.iconLibrary).toBe("phosphor")
        expect(appConfig.menuColor).toBe("inverted")
        expect(appConfig.menuAccent).toBe("bold")
        expect(appConfig.rtl).toBe(false)
        expect(appConfig.tailwind.css).toBe(
          "../../packages/ui/src/styles/globals.css"
        )
        expect(uiConfig.tailwind.css).toBe("src/styles/globals.css")
      } finally {
        await fs.remove(rootDir)
      }
    },
    300000
  )

  itIfNotCi(
    "should require an app workspace when applying from a monorepo",
    async () => {
      const { projectPath, rootDir } = await createInitializedMonorepoProject()
      const presetUrl = `${getRegistryUrl().replace(/\/r\/?$/, "")}/init?base=base&style=lyra&baseColor=neutral&theme=neutral&iconLibrary=phosphor&font=manrope&rtl=true&menuAccent=bold&menuColor=inverted&radius=default`

      try {
        const result = await npxShadcn(
          projectPath,
          ["apply", "--preset", presetUrl, "-y", "-c", "packages/ui"],
          {
            timeout: 300000,
          }
        )

        expect(result.exitCode).toBe(1)
        expect(result.stdout).toContain(
          "We could not detect a supported framework"
        )
        expect(result.stdout).toContain("packages/ui")
      } finally {
        await fs.remove(rootDir)
      }
    },
    300000
  )
})
