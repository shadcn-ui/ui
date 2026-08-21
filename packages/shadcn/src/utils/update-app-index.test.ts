import os from "os"
import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { Config } from "@/src/utils/get-config"
import fs from "fs-extra"
import { afterEach, describe, expect, it, vi } from "vitest"

import { updateAppIndex } from "./update-app-index"

vi.mock("@/src/registry/api", () => ({
  getRegistryItems: vi.fn(),
}))

const tempDirs: string[] = []

async function createTempCwd() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-app-index-"))
  tempDirs.push(dir)

  return dir
}

function createConfig(cwd: string) {
  return { resolvedPaths: { cwd } } as Config
}

afterEach(async () => {
  vi.clearAllMocks()
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

describe("updateAppIndex", () => {
  it("should not throw when app/page.tsx does not exist", async () => {
    const cwd = await createTempCwd()

    await expect(
      updateAppIndex("component", createConfig(cwd))
    ).resolves.toBeUndefined()
    expect(getRegistryItems).not.toHaveBeenCalled()
  })

  it("should not throw when app/page.tsx is a directory", async () => {
    const cwd = await createTempCwd()
    await fs.ensureDir(path.join(cwd, "app/page.tsx"))

    await expect(
      updateAppIndex("component", createConfig(cwd))
    ).resolves.toBeUndefined()
    expect(getRegistryItems).not.toHaveBeenCalled()
  })

  it("should overwrite app/page.tsx with the component import", async () => {
    const cwd = await createTempCwd()
    const indexPath = path.join(cwd, "app/page.tsx")
    await fs.outputFile(indexPath, "export default function Page() {}\n")

    vi.mocked(getRegistryItems).mockResolvedValue([
      {
        name: "component",
        type: "registry:component",
        meta: {
          importSpecifier: "ComponentExample",
          moduleSpecifier: "@/components/component-example",
        },
      },
    ] as Awaited<ReturnType<typeof getRegistryItems>>)

    await updateAppIndex("component", createConfig(cwd))

    expect(await fs.readFile(indexPath, "utf8")).toBe(
      'import { ComponentExample } from "@/components/component-example"\n\nexport default function Page() {\n  return <ComponentExample />\n}'
    )
  })

  it("should leave app/page.tsx untouched when the item has no meta", async () => {
    const cwd = await createTempCwd()
    const indexPath = path.join(cwd, "app/page.tsx")
    await fs.outputFile(indexPath, "export default function Page() {}\n")

    vi.mocked(getRegistryItems).mockResolvedValue([
      { name: "component", type: "registry:component" },
    ] as Awaited<ReturnType<typeof getRegistryItems>>)

    await updateAppIndex("component", createConfig(cwd))

    expect(await fs.readFile(indexPath, "utf8")).toBe(
      "export default function Page() {}\n"
    )
  })
})
