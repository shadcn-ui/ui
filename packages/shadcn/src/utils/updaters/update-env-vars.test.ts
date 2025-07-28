import { existsSync, promises as fs } from "fs"
import type { Config } from "@/src/utils/get-config"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { updateEnvVars } from "./update-env-vars"

vi.mock("fs", () => ({
  existsSync: vi.fn(),
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    log: vi.fn(),
    success: vi.fn(),
    break: vi.fn(),
  },
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    stop: vi.fn(),
    succeed: vi.fn(),
  })),
}))

const mockConfig: Config = {
  style: "default",
  rsc: false,
  tailwind: {
    config: "tailwind.config.js",
    css: "app/globals.css",
    baseColor: "slate",
    prefix: "",
    cssVariables: false,
  },
  tsx: true,
  aliases: {
    components: "@/components",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
    utils: "@/utils",
  },
  resolvedPaths: {
    cwd: "/test/project",
    tailwindConfig: "/test/project/tailwind.config.js",
    tailwindCss: "/test/project/app/globals.css",
    components: "/test/project/components",
    ui: "/test/project/components/ui",
    lib: "/test/project/lib",
    hooks: "/test/project/hooks",
    utils: "/test/project/utils",
  },
}

describe("updateEnvVars", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test("should create new .env.local file when none exists", async () => {
    vi.mocked(existsSync).mockReturnValue(false)

    const envVars = {
      API_KEY: "test-key",
      API_URL: "https://api.example.com",
    }

    const result = await updateEnvVars(envVars, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      "/test/project/.env.local",
      "API_KEY=test-key\nAPI_URL=https://api.example.com\n",
      "utf-8"
    )
    expect(result).toEqual({
      envVarsAdded: ["API_KEY", "API_URL"],
      envFileUpdated: null,
      envFileCreated: ".env.local",
    })
  })

  test("should update existing .env.local file with new variables", async () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(fs.readFile).mockResolvedValue("EXISTING_KEY=existing-value\n")

    const envVars = {
      NEW_KEY: "new-value",
      ANOTHER_KEY: "another-value",
    }

    const result = await updateEnvVars(envVars, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      "/test/project/.env.local",
      "EXISTING_KEY=existing-value\n\nNEW_KEY=new-value\nANOTHER_KEY=another-value\n",
      "utf-8"
    )
    expect(result).toEqual({
      envVarsAdded: ["NEW_KEY", "ANOTHER_KEY"],
      envFileUpdated: ".env.local",
      envFileCreated: null,
    })
  })

  test("should skip when all variables already exist", async () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(fs.readFile).mockResolvedValue(
      "API_KEY=existing-key\nAPI_URL=existing-url\n"
    )

    const envVars = {
      API_KEY: "new-key",
      API_URL: "new-url",
    }

    const result = await updateEnvVars(envVars, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).not.toHaveBeenCalled()
    expect(result).toEqual({
      envVarsAdded: [],
      envFileUpdated: null,
      envFileCreated: null,
    })
  })

  test("should find and use .env.local when .env doesn't exist", async () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env.local")
    })
    vi.mocked(fs.readFile).mockResolvedValue("EXISTING_VAR=value\n")

    const envVars = {
      NEW_VAR: "new-value",
    }

    const result = await updateEnvVars(envVars, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      "/test/project/.env.local",
      "EXISTING_VAR=value\n\nNEW_VAR=new-value\n",
      "utf-8"
    )
    expect(result).toEqual({
      envVarsAdded: ["NEW_VAR"],
      envFileUpdated: ".env.local",
      envFileCreated: null,
    })
  })

  test("should return early when no env vars provided", async () => {
    const result = await updateEnvVars(undefined, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).not.toHaveBeenCalled()
    expect(result).toEqual({
      envVarsAdded: [],
      envFileUpdated: null,
      envFileCreated: null,
    })
  })

  test("should return early when empty env vars object provided", async () => {
    const result = await updateEnvVars({}, mockConfig, { silent: true })

    expect(vi.mocked(fs.writeFile)).not.toHaveBeenCalled()
    expect(result).toEqual({
      envVarsAdded: [],
      envFileUpdated: null,
      envFileCreated: null,
    })
  })
})
