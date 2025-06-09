import { describe, expect, it, vi, beforeEach } from "vitest"
import { promises as fs } from "fs"
import path from "path"

import { migrateRadixFile, migrateRadix } from "./migrate-radix"

// Mock dependencies
vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdtemp: vi.fn(),
  },
}))

vi.mock("fast-glob", () => ({
  default: vi.fn(),
}))

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: "",
  })),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn(),
}))

vi.mock("@/src/utils/get-package-info", () => ({
  getPackageInfo: vi.fn(),
}))

const mockFs = fs as any
const mockConfig = {
  resolvedPaths: {
    cwd: "/test-project",
    ui: "/test-project/components",
  },
}

beforeEach(() => {
  // Mock mkdtemp to return a valid temp directory path
  mockFs.mkdtemp.mockResolvedValue("/tmp/shadcn-test")
})

describe("migrateRadixFile", () => {
  it("should migrate namespace imports", async () => {
    const input = `import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as SelectPrimitive from "@radix-ui/react-select"

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui";
export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(expected.trim())
  })

  it("should migrate named imports", async () => {
    const input = `import { Root, Trigger } from "@radix-ui/react-dialog"
import { Content } from "@radix-ui/react-select"

export const DialogRoot = Root
export const DialogTrigger = Trigger
export const SelectContent = Content`

    const expected = `import { Root, Trigger, Content } from "radix-ui";
export const DialogRoot = Root
export const DialogTrigger = Trigger
export const SelectContent = Content`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(expected.trim())
  })

  it("should handle mixed import types", async () => {
    const input = `import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Root as SelectRoot } from "@radix-ui/react-select"
import { useState } from "react"

export const Dialog = DialogPrimitive.Root
export const Select = SelectRoot`

    const expected = `import { Dialog as DialogPrimitive, Root as SelectRoot } from "radix-ui";
import { useState } from "react"

export const Dialog = DialogPrimitive.Root
export const Select = SelectRoot`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(expected.trim())
  })

  it("should not modify non-Radix imports", async () => {
    const input = `import React from "react"
import { clsx } from "clsx"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result).toContain('import React from "react"')
    expect(result).toContain('import { clsx } from "clsx"')
    expect(result).toContain('import { Dialog as DialogPrimitive } from "radix-ui"')
    expect(result).not.toContain('@radix-ui/react-dialog')
  })

  it("should handle files with no Radix imports", async () => {
    const input = `import React from "react"
import { clsx } from "clsx"

export const Component = () => <div>Hello</div>`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(input.trim())
  })

  it("should preserve import position in file", async () => {
    const input = `"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useState } from "react"

export const Dialog = DialogPrimitive.Root`

    const expected = `"use client"

import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react"

export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(expected.trim())
  })

  it("should handle multiple Radix imports without node removal errors", async () => {
    const input = `"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useState } from "react"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const Dialog = DialogPrimitive.Root`

    const expected = `"use client"

import { DropdownMenu as DropdownMenuPrimitive, Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.trim()).toBe(expected.trim())
  })
})

describe("migrateRadix - package.json updates", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should update package.json with Radix dependencies", async () => {
    const mockPackageJson = {
      name: "test-project", 
      dependencies: {
        "react": "^18.0.0",
        "@radix-ui/react-dialog": "^1.0.0",
        "@radix-ui/react-select": "^1.0.0",
        "other-package": "^1.0.0"
      },
      devDependencies: {
        "@radix-ui/react-toast": "^1.0.0"
      }
    }

    const expectedPackageJson = {
      name: "test-project",
      dependencies: {
        "react": "^18.0.0", 
        "other-package": "^1.0.0",
        "radix-ui": "latest"
      },
      devDependencies: {}
    }

    // Mock package info
    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)
    
    // Mock file system
    mockFs.writeFile.mockResolvedValue(undefined)
    
    // Mock fast-glob to return empty files
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue([])
    
    // Mock prompts to confirm migration
    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })
    
    // Mock package manager detection
    const { getPackageManager } = await import("@/src/utils/get-package-manager")
    vi.mocked(getPackageManager).mockResolvedValue("npm")

    await migrateRadix(mockConfig)

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "/test-project/package.json",
      JSON.stringify(expectedPackageJson, null, 2) + "\n"
    )
  })

  it("should handle package.json with no Radix dependencies", async () => {
    const mockPackageJson = {
      name: "test-project",
      dependencies: {
        "react": "^18.0.0",
        "other-package": "^1.0.0"
      }
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)
    
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue([])
    
    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig)

    // Should not write the file if no Radix packages found
    expect(mockFs.writeFile).not.toHaveBeenCalledWith(
      "/test-project/package.json",
      expect.any(String)
    )
  })

  it("should handle missing package.json gracefully", async () => {
    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(null)
    
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue([])
    
    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    // Should not throw
    await expect(migrateRadix(mockConfig)).resolves.not.toThrow()
  })

  it("should show correct install command for different package managers", async () => {
    const mockPackageJson = {
      name: "test-project", 
      dependencies: {
        "@radix-ui/react-dialog": "^1.0.0",
      }
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)
    
    const { getPackageManager } = await import("@/src/utils/get-package-manager")
    vi.mocked(getPackageManager).mockResolvedValue("pnpm")
    
    const { logger } = await import("@/src/utils/logger")
    
    mockFs.writeFile.mockResolvedValue(undefined)
    
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue([])
    
    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig)

    expect(logger.info).toHaveBeenCalledWith("  pnpm install")
  })
})