import path from "path"
import { execa } from "execa"
import prompts from "prompts"
import { afterEach, describe, expect, test, vi } from "vitest"

import { updateDependencies } from "../../../src/utils/updaters/update-dependencies"

vi.mock("execa")
vi.mock("prompts")

describe("updateDependencies", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each([
    {
      description:
        "npm without react-day-picker v8 includes no additional flags",
      options: { silent: true },
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-npm"),
        },
      },
      expectedPackageManager: "npm",
      expectedArgs: ["install", "first", "second", "third"],
      expectedDevArgs: ["install", "-D", "fourth"],
    },
    {
      description:
        "npm with react-day-picker v8 applies force prompt when silent",
      options: { silent: true },
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19"),
        },
      },
      expectedPackageManager: "npm",
      expectedArgs: ["install", "--force", "first", "second", "third"],
      expectedDevArgs: ["install", "--force", "-D", "fourth"],
    },
    {
      description:
        "npm with react-day-picker v8 prompts for flag when not silent",
      flagPrompt: "legacy-peer-deps",
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19"),
        },
      },
      expectedPackageManager: "npm",
      expectedArgs: [
        "install",
        "--legacy-peer-deps",
        "first",
        "second",
        "third",
      ],
      expectedDevArgs: ["install", "--legacy-peer-deps", "-D", "fourth"],
    },
    {
      description: "deno uses npm: package prefix",
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-deno"),
        },
      },
      expectedPackageManager: "deno",
      expectedArgs: ["add", "npm:first", "npm:second", "npm:third"],
      expectedDevArgs: ["add", "-D", "npm:fourth"],
    },
    {
      description: "bun uses bun",
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-bun"),
        },
      },
      expectedPackageManager: "bun",
      expectedArgs: ["add", "first", "second", "third"],
      expectedDevArgs: ["add", "-D", "fourth"],
    },
    {
      description: "pnpm uses pnpm",
      dependencies: ["first", "second", "third"],
      devDependencies: ["fourth"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-pnpm"),
        },
      },
      expectedPackageManager: "pnpm",
      expectedArgs: ["add", "first", "second", "third"],
      expectedDevArgs: ["add", "-D", "fourth"],
    },
    {
      description: "deduplicates input dependencies",
      options: { silent: true },
      dependencies: ["first", "first"],
      devDependencies: ["second", "second"],
      config: {
        resolvedPaths: {
          cwd: path.resolve(__dirname, "../../fixtures/project-npm"),
        },
      },
      expectedPackageManager: "npm",
      expectedArgs: ["install", "first"],
      expectedDevArgs: ["install", "-D", "second"],
    },
  ])(
    "$description",
    async ({
      options,
      flagPrompt,
      config,
      dependencies,
      devDependencies,
      expectedPackageManager,
      expectedArgs,
      expectedDevArgs,
    }) => {
      vi.mocked(prompts).mockResolvedValue({ flag: flagPrompt })

      await updateDependencies(
        dependencies,
        devDependencies,
        config,
        options ?? {}
      )

      if (flagPrompt) {
        expect(prompts).toHaveBeenCalled()
      }

      expect(execa).toHaveBeenCalledWith(expectedPackageManager, expectedArgs, {
        cwd: config?.resolvedPaths.cwd,
      })

      expect(execa).toHaveBeenCalledWith(
        expectedPackageManager,
        expectedDevArgs,
        { cwd: config?.resolvedPaths.cwd }
      )
    }
  )

  test("skips bare dependencies already declared in package.json (#10525)", async () => {
    const cwd = path.resolve(
      __dirname,
      "../../fixtures/project-pnpm-existing-deps"
    )

    await updateDependencies(
      // @base-ui/react, class-variance-authority and recharts are already
      // declared in the fixture; only react-is and the explicit recharts@3.8.0
      // spec should reach the package manager.
      [
        "@base-ui/react",
        "class-variance-authority",
        "react-is",
        "recharts@3.8.0",
      ],
      ["@tailwindcss/postcss", "typescript"],
      { resolvedPaths: { cwd } } as any,
      { silent: true }
    )

    expect(execa).toHaveBeenCalledTimes(2)
    expect(execa).toHaveBeenCalledWith(
      "pnpm",
      ["add", "react-is", "recharts@3.8.0"],
      { cwd }
    )
    expect(execa).toHaveBeenCalledWith("pnpm", ["add", "-D", "typescript"], {
      cwd,
    })
  })

  test("prefers explicit specs over duplicate bare requests", async () => {
    const cwd = path.resolve(__dirname, "../../fixtures/project-pnpm")

    await updateDependencies(
      ["recharts", "recharts@3.8.0", "@base-ui/react", "@base-ui/react@1.4.1"],
      [],
      { resolvedPaths: { cwd } } as any,
      { silent: true }
    )

    expect(execa).toHaveBeenCalledTimes(1)
    expect(execa).toHaveBeenCalledWith(
      "pnpm",
      ["add", "recharts@3.8.0", "@base-ui/react@1.4.1"],
      { cwd }
    )
  })

  test("does not skip already declared deps for expo projects", async () => {
    const cwd = path.resolve(
      __dirname,
      "../../fixtures/project-expo-existing-deps"
    )

    // recharts is already declared, but `expo install` must still see it so it
    // can align the version with the installed SDK. Duplicates are still deduped.
    await updateDependencies(
      ["recharts", "recharts", "react-is"],
      [],
      { resolvedPaths: { cwd } } as any,
      { silent: true }
    )

    expect(execa).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "recharts", "react-is"],
      { cwd }
    )
  })
})
