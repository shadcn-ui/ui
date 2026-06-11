import path from "path"
import { execa } from "execa"
import prompts from "prompts"
import { afterEach, describe, expect, test, vi } from "vitest"

import { updateDependencies } from "../../../src/utils/updaters/update-dependencies"

vi.mock("execa")
vi.mock("prompts")

describe("updateDependencies", () => {
  const mockExecaSuccess = {
    stdout: "",
    stderr: "",
    exitCode: 0,
    signal: undefined,
    signalDescription: undefined,
    command: "",
    escapedCommand: "",
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false,
  }

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

  test("pnpm installation continues with --ignore-scripts when build scripts are denied", async () => {
    const deniedBuildScriptsError = new Error("Command failed with exit code 1")
    Object.assign(deniedBuildScriptsError, {
      stderr:
        "ERR_PNPM_IGNORED_BUILDS\nIgnored build scripts: msw@2.14.6",
    })
    const cwd = path.resolve(__dirname, "../../fixtures/project-pnpm")

    vi.mocked(execa)
      .mockRejectedValueOnce(deniedBuildScriptsError)
      .mockResolvedValueOnce(mockExecaSuccess)
      .mockResolvedValueOnce(mockExecaSuccess)

    vi.mocked(prompts).mockResolvedValue({ ignoreScripts: true })

    await updateDependencies(
      ["first", "second", "third"],
      ["fourth"],
      {
        resolvedPaths: {
          cwd,
        },
      },
      {}
    )

    expect(execa).toHaveBeenNthCalledWith(1, "pnpm", ["add", "first", "second", "third"], {
      cwd,
    })
    expect(execa).toHaveBeenNthCalledWith(
      2,
      "pnpm",
      ["add", "--ignore-scripts", "first", "second", "third"],
      { cwd }
    )
    expect(execa).toHaveBeenCalledWith("pnpm", ["add", "-D", "fourth"], { cwd })
    expect(prompts).toHaveBeenCalled()
  })

  test("pnpm installation fails when user declines to skip build scripts", async () => {
    const deniedBuildScriptsError = new Error("Command failed with exit code 1")
    Object.assign(deniedBuildScriptsError, {
      stderr:
        "ERR_PNPM_IGNORED_BUILDS\nIgnored build scripts: msw@2.14.6",
    })
    const cwd = path.resolve(__dirname, "../../fixtures/project-pnpm")

    vi.mocked(execa).mockRejectedValueOnce(deniedBuildScriptsError)
    vi.mocked(prompts).mockResolvedValue({ ignoreScripts: false })

    await expect(
      updateDependencies(
        ["first", "second", "third"],
        ["fourth"],
        {
          resolvedPaths: {
            cwd,
          },
        },
        {}
      )
    ).rejects.toThrow("Command failed with exit code 1")

    expect(prompts).toHaveBeenCalled()
    expect(execa).toHaveBeenCalledTimes(1)
  })

  test("pnpm installation auto-retries with --ignore-scripts in silent mode", async () => {
    const deniedBuildScriptsError = new Error("Command failed with exit code 1")
    Object.assign(deniedBuildScriptsError, {
      stderr:
        "ERR_PNPM_IGNORED_BUILDS\nIgnored build scripts: msw@2.14.6",
    })
    const cwd = path.resolve(__dirname, "../../fixtures/project-pnpm")

    vi.mocked(execa)
      .mockRejectedValueOnce(deniedBuildScriptsError)
      .mockResolvedValueOnce(mockExecaSuccess)
      .mockResolvedValueOnce(mockExecaSuccess)

    await updateDependencies(
      ["first", "second", "third"],
      ["fourth"],
      {
        resolvedPaths: {
          cwd,
        },
      },
      { silent: true }
    )

    expect(execa).toHaveBeenNthCalledWith(
      2,
      "pnpm",
      ["add", "--ignore-scripts", "first", "second", "third"],
      { cwd }
    )
    expect(prompts).not.toHaveBeenCalled()
  })
})
