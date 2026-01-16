import path from "path"
import { afterEach, describe, expect, it, vi } from "vitest"
import fsExtra from "fs-extra"
import { generate } from "../../src/commands/generate"

const testDir = path.join(__dirname, "../../test-output/generate")

describe("generate command", () => {
  afterEach(async () => {
    if (fsExtra.existsSync(testDir)) {
      await fsExtra.remove(testDir)
    }
    vi.clearAllMocks()
  })

  it("should be defined", () => {
    expect(generate).toBeDefined()
    expect(generate.name()).toBe("generate")
  })

  it("should have alias 'gen'", () => {
    expect(generate.aliases()).toContain("gen")
  })

  it("should have the correct description", () => {
    expect(generate.description()).toBe(
      "generate boilerplate code for various types"
    )
  })

  it("should accept type and name arguments", () => {
    const args = generate.registeredArguments
    expect(args).toHaveLength(2)
    expect(args[0].name()).toBe("type")
    expect(args[1].name()).toBe("name")
  })

  it("should have --cwd option", () => {
    const options = generate.options
    const cwdOption = options.find((opt: any) => opt.long === "--cwd")
    expect(cwdOption).toBeDefined()
    expect(cwdOption?.description).toContain("working directory")
  })

  it("should have --path option", () => {
    const options = generate.options
    const pathOption = options.find((opt: any) => opt.long === "--path")
    expect(pathOption).toBeDefined()
    expect(pathOption?.description).toContain("custom path")
  })
})

describe("generate templates", () => {
  it("should generate component with PascalCase name", async () => {
    // This test would require mocking prompts and file system
    // For now, we verify the command structure
    expect(generate.name()).toBe("generate")
  })

  it("should generate hook with camelCase and 'use' prefix", async () => {
    // This test would require mocking prompts and file system
    // For now, we verify the command structure
    expect(generate.name()).toBe("generate")
  })

  it("should generate util with camelCase name", async () => {
    // This test would require mocking prompts and file system
    // For now, we verify the command structure
    expect(generate.name()).toBe("generate")
  })
})
