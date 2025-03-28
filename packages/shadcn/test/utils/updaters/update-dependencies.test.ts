import { vi, describe, afterEach, test, expect } from "vitest"
import { execa } from "execa"
import prompts from "prompts"
import { updateDependencies } from "../../../src/utils/updaters/update-dependencies"
import path from "path"

vi.mock("execa")
vi.mock("prompts")

describe("updateDependencies", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    test.each([
        {
            description: "npm without react 19 includes no additional flags",
            options: { silent: true },
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "first", "second", "third"]
        },
        {
            description: "npm with react 19 applies force prompt when silent",
            options: { silent: true },
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "--force", "first", "second", "third"]
        },
        {
            description: "npm with react 19 prompts for flag when not silent",
            flagPrompt: "legacy-peer-deps",
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "--legacy-peer-deps", "first", "second", "third"]
        },
        {
            description: "deno uses specific package prefix when configured",
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-deno")
                },
                dependencies: {
                    denoPackagePrefix: "jsr:"
                }
            },
            expectedPackageManager: "deno",
            expectedArgs: ["add", "jsr:first", "jsr:second", "jsr:third"]
        },
        {
            description: "deno uses npm: package prefix when not configured",
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-deno")
                }
            },
            expectedPackageManager: "deno",
            expectedArgs: ["add", "npm:first", "npm:second", "npm:third"]
            
        },
        {
            description: "deno does not apply prefix to http[s] dependencies",
            dependencies: ["first", "http://second", "https://third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-deno")
                }
            },
            expectedPackageManager: "deno",
            expectedArgs: ["add", "npm:first", "http://second", "https://third"]
        },
        {
            description: "bun uses bun",
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-bun")
                }
            },
            expectedPackageManager: "bun",
            expectedArgs: ["add", "first", "second", "third"]
        },
        {
            description: "pnpm uses pnpm",
            dependencies: ["first", "second", "third"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-pnpm")
                }
            },
            expectedPackageManager: "pnpm",
            expectedArgs: ["add", "first", "second", "third"]
        }
    ])("$description", async ({ options, flagPrompt, config, dependencies, expectedPackageManager, expectedArgs }) => {

        vi.mocked(prompts).mockResolvedValue({ flag: flagPrompt })

        await updateDependencies(
            dependencies,
            config,
            options ?? {}
        )

        if (flagPrompt) {
            expect(prompts).toHaveBeenCalled()
        }

        expect(execa).toHaveBeenCalledWith(
            expectedPackageManager,
            expectedArgs,
            { cwd: config?.resolvedPaths.cwd }
        )
    })
})