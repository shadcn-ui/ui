import { RegistryNotFoundError } from "@/src/registry/errors"
import {
  getPreviousMinorCommand,
  getPreviousMinorVersion,
  handleError,
} from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    error: (value: string) => value,
    info: (value: string) => value,
  },
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
  },
}))

describe("handleError", () => {
  const originalArgv = process.argv
  const originalUserAgent = process.env.npm_config_user_agent
  const exit = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit:${code}`)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    process.argv = ["node", "shadcn", "add", "foo"]
    process.env.npm_config_user_agent = "npm/10.0.0 node/v22"
  })

  afterEach(() => {
    process.argv = originalArgv
    if (originalUserAgent) {
      process.env.npm_config_user_agent = originalUserAgent
    } else {
      delete process.env.npm_config_user_agent
    }
  })

  afterAll(() => {
    exit.mockRestore()
  })

  it("gets the previous minor version", () => {
    expect(getPreviousMinorVersion("4.6.0")).toBe("4.5.0")
    expect(getPreviousMinorVersion("4.6.3")).toBe("4.5.0")
    expect(getPreviousMinorVersion("4.0.0")).toBeNull()
    expect(getPreviousMinorVersion("latest")).toBeNull()
  })

  it("builds a previous minor command from the failed arguments", () => {
    expect(getPreviousMinorCommand("4.6.0", ["add", "foo"])).toBe(
      "npx shadcn@4.5.0 add foo"
    )
  })

  it("uses the package runner from the user agent", () => {
    process.env.npm_config_user_agent = "pnpm/10.0.0 npm/? node/v22"

    expect(getPreviousMinorCommand("4.6.0", ["add", "foo"])).toBe(
      "pnpm dlx shadcn@4.5.0 add foo"
    )
  })

  it("quotes arguments that need shell escaping", () => {
    expect(
      getPreviousMinorCommand("4.6.0", ["add", "hello world", "it's-working"])
    ).toBe("npx shadcn@4.5.0 add 'hello world' 'it'\\''s-working'")
  })

  it("prints the previous minor command before exiting", () => {
    expect(() => {
      handleError(
        new RegistryNotFoundError(
          "http://localhost:4000/r/styles/new-york-v4/foo.json"
        )
      )
    }).toThrow("process.exit:1")

    expect(logger.error).toHaveBeenCalledWith(
      "You can also try a previous version to see if that works:"
    )
    expect(logger.error).toHaveBeenCalledWith("npx shadcn@4.5.0 add foo")
    expect(exit).toHaveBeenCalledWith(1)
  })
})
