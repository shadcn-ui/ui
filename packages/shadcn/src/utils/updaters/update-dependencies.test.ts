import os from "node:os"
import path from "node:path"
import fs from "fs-extra"
import { afterEach, describe, expect, it, vi } from "vitest"

import { updateDependencies } from "./update-dependencies"

const execaMock = vi.hoisted(() => vi.fn())

vi.mock("execa", () => ({
  execa: execaMock,
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn().mockResolvedValue("pnpm"),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
    stopAndPersist: vi.fn(),
  })),
}))

const tempDirs: string[] = []

afterEach(async () => {
  execaMock.mockClear()

  for (const dir of tempDirs.splice(0)) {
    await fs.remove(dir)
  }
})

describe("updateDependencies", () => {
  it("skips bare dependency requests already present in package.json", async () => {
    const cwd = await createTempProject({
      dependencies: {
        "@base-ui/react": "^1.4.1",
        "class-variance-authority": "^0.7.1",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4.2.1",
      },
    })

    await updateDependencies(
      [
        "@base-ui/react",
        "class-variance-authority",
        "react-is",
        "recharts@3.8.0",
      ],
      ["@tailwindcss/postcss"],
      createConfig(cwd),
      { silent: true }
    )

    expect(execaMock).toHaveBeenCalledTimes(1)
    expect(execaMock).toHaveBeenCalledWith(
      "pnpm",
      ["add", "react-is", "recharts@3.8.0"],
      { cwd }
    )
  })

  it("prefers explicit package specs over duplicate bare requests", async () => {
    const cwd = await createTempProject({
      dependencies: {},
      devDependencies: {},
    })

    await updateDependencies(
      ["recharts", "recharts@3.8.0", "@base-ui/react", "@base-ui/react@1.4.1"],
      [],
      createConfig(cwd),
      { silent: true }
    )

    expect(execaMock).toHaveBeenCalledTimes(1)
    expect(execaMock).toHaveBeenCalledWith(
      "pnpm",
      ["add", "recharts@3.8.0", "@base-ui/react@1.4.1"],
      { cwd }
    )
  })
})

async function createTempProject(packageJson: {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-deps-"))
  tempDirs.push(cwd)

  await fs.writeJson(path.join(cwd, "package.json"), packageJson)

  return cwd
}

function createConfig(cwd: string) {
  return {
    resolvedPaths: {
      cwd,
    },
  } as any
}
