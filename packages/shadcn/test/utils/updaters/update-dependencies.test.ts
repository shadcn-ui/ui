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
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "first", "second", "third"],
            expectedDevArgs: ["install", "-D", "fourth"]
        },
        {
            description: "npm with react 19 applies force prompt when silent",
            options: { silent: true },
            dependencies: ["first", "second", "third"],
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "--force", "first", "second", "third"],
            expectedDevArgs: ["install", "--force", "-D", "fourth"]
        },
        {
            description: "npm with react 19 prompts for flag when not silent",
            flagPrompt: "legacy-peer-deps",
            dependencies: ["first", "second", "third"],
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm-react19")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "--legacy-peer-deps", "first", "second", "third"],
            expectedDevArgs: ["install", "--legacy-peer-deps", "-D", "fourth"]
        },
        {
            description: "deno uses npm: package prefix",
            dependencies: ["first", "second", "third"],
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-deno")
                }
            },
            expectedPackageManager: "deno",
            expectedArgs: ["add", "npm:first", "npm:second", "npm:third"],
            expectedDevArgs: ["add", "-D", "npm:fourth"]            
        },
        {
            description: "bun uses bun",
            dependencies: ["first", "second", "third"],
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-bun")
                }
            },
            expectedPackageManager: "bun",
            expectedArgs: ["add", "first", "second", "third"],
            expectedDevArgs: ["add", "-D", "fourth"]
        },
        {
            description: "pnpm uses pnpm",
            dependencies: ["first", "second", "third"],
            devDependencies: ["fourth"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-pnpm")
                }
            },
            expectedPackageManager: "pnpm",
            expectedArgs: ["add", "first", "second", "third"],
            expectedDevArgs: ["add", "-D", "fourth"]
        },
        {
            description: "deduplicates input dependencies",
            options: { silent: true },
            dependencies: ["first", "first"],
            devDependencies: ["second", "second"],
            config: {
                resolvedPaths: {
                    cwd: path.resolve(__dirname, "../../fixtures/project-npm")
                }
            },
            expectedPackageManager: "npm",
            expectedArgs: ["install", "first"],
            expectedDevArgs: ["install", "-D", "second"]
        }
    ])("$description", async ({ options, flagPrompt, config, dependencies, devDependencies, expectedPackageManager, expectedArgs, expectedDevArgs }) => {

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


        expect(execa).toHaveBeenCalledWith(
            expectedPackageManager,
            expectedArgs,
            { cwd: config?.resolvedPaths.cwd }
        )

        expect(execa).toHaveBeenCalledWith(
            expectedPackageManager,
            expectedDevArgs,
            { cwd: config?.resolvedPaths.cwd }
        )
    })
})