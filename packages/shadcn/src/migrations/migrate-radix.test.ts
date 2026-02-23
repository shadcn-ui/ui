import { promises as fs } from "fs"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { migrateRadix, migrateRadixFile } from "./migrate-radix"

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
    break: vi.fn(),
  },
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn(),
}))

vi.mock("@/src/utils/get-package-info", () => ({
  getPackageInfo: vi.fn(),
}))

vi.mock("@/src/utils/updaters/update-dependencies", () => ({
  updateDependencies: vi.fn(),
}))

const mockFs = fs as any
const mockConfig = {
  style: "default",
  rsc: false,
  tsx: true,
  tailwind: {
    css: "app/globals.css",
    baseColor: "slate",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/test-project",
    ui: "/test-project/components",
    tailwindConfig: "/test-project/tailwind.config.js",
    tailwindCss: "/test-project/app/globals.css",
    utils: "/test-project/lib/utils",
    components: "/test-project/components",
    lib: "/test-project/lib",
    hooks: "/test-project/hooks",
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

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui"

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should migrate named imports", async () => {
    const input = `import { Root, Trigger } from "@radix-ui/react-dialog"
import { Content } from "@radix-ui/react-select"

export const DialogRoot = Root
export const DialogTrigger = Trigger
export const SelectContent = Content`

    const expected = `import { Root, Trigger, Content } from "radix-ui"

export const DialogRoot = Root
export const DialogTrigger = Trigger
export const SelectContent = Content`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle mixed import types", async () => {
    const input = `import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Root as SelectRoot } from "@radix-ui/react-select"
import { useState } from "react"

export const Dialog = DialogPrimitive.Root
export const Select = SelectRoot`

    const expected = `import { Dialog as DialogPrimitive, Root as SelectRoot } from "radix-ui"

import { useState } from "react"

export const Dialog = DialogPrimitive.Root
export const Select = SelectRoot`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should not modify non-Radix imports", async () => {
    const input = `import React from "react"
import { clsx } from "clsx"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content).toContain('import React from "react"')
    expect(result.content).toContain('import { clsx } from "clsx"')
    expect(result.content).toContain(
      'import { Dialog as DialogPrimitive } from "radix-ui"'
    )
    expect(result.content).not.toContain("@radix-ui/react-dialog")
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle files with no Radix imports", async () => {
    const input = `import React from "react"
import { clsx } from "clsx"

export const Component = () => <div>Hello</div>`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(input.trim())
    expect(result.replacedPackages).toEqual([])
  })

  it("should preserve import position in file", async () => {
    const input = `"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useState } from "react"

export const Dialog = DialogPrimitive.Root`

    const expected = `"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import { useState } from "react"

export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle multiple Radix imports without node removal errors", async () => {
    const input = `"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useState } from "react"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const Dialog = DialogPrimitive.Root`

    const expected = `"use client"

import { DropdownMenu as DropdownMenuPrimitive, Dialog as DialogPrimitive } from "radix-ui"

import { useState } from "react"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
    ])
  })

  it("should preserve single quotes if used in original imports", async () => {
    const input = `import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as SelectPrimitive from '@radix-ui/react-select'

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from 'radix-ui'

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should preserve mixed quote styles from first import", async () => {
    const input = `import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as SelectPrimitive from "@radix-ui/react-select"

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from 'radix-ui'

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle type-only imports", async () => {
    const input = `import type { ComponentProps } from "@radix-ui/react-dialog"
import { type SelectProps, Root } from "@radix-ui/react-select"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export type MyDialogProps = ComponentProps
export type MySelectProps = SelectProps
export const Dialog = DialogPrimitive.Root`

    const expected = `import { type ComponentProps, type SelectProps, Root, Dialog as DialogPrimitive } from "radix-ui"

export type MyDialogProps = ComponentProps
export type MySelectProps = SelectProps
export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle mixed type and value imports", async () => {
    const input = `import type { DialogProps } from "@radix-ui/react-dialog"
import { Root, Trigger } from "@radix-ui/react-dialog"

export type Props = DialogProps
export const DialogRoot = Root`

    const expected = `import { type DialogProps, Root, Trigger } from "radix-ui"

export type Props = DialogProps
export const DialogRoot = Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle type-only namespace imports", async () => {
    const input = `import type * as DialogTypes from "@radix-ui/react-dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export type Props = DialogTypes.ComponentProps
export const Dialog = DialogPrimitive.Root`

    const expected = `import { type Dialog as DialogTypes, Dialog as DialogPrimitive } from "radix-ui"

export type Props = DialogTypes.ComponentProps
export const Dialog = DialogPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should not migrate @radix-ui/react-icons imports", async () => {
    const input = `import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Root } from "@radix-ui/react-select"

export const Dialog = DialogPrimitive.Root
export const ChevronDown = ChevronDownIcon`

    const expected = `import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Dialog as DialogPrimitive, Root } from "radix-ui"

export const Dialog = DialogPrimitive.Root
export const ChevronDown = ChevronDownIcon`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should not migrate type imports from @radix-ui/react-icons", async () => {
    const input = `import type { IconProps } from "@radix-ui/react-icons/dist/types"
import type { ComponentProps } from "@radix-ui/react-dialog"
import { Root } from "@radix-ui/react-dialog"

export type MyIconProps = IconProps
export type MyDialogProps = ComponentProps`

    const expected = `import type { IconProps } from "@radix-ui/react-icons/dist/types"
import { type ComponentProps, Root } from "radix-ui"

export type MyIconProps = IconProps
export type MyDialogProps = ComponentProps`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle mixed imports with icons and other radix packages", async () => {
    const input = `import * as Icons from "@radix-ui/react-icons"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import type { IconProps } from "@radix-ui/react-icons/dist/types"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Root } from "@radix-ui/react-select"

export const Dialog = DialogPrimitive.Root
export const Icon = ChevronDownIcon
export type Props = IconProps`

    const expected = `import * as Icons from "@radix-ui/react-icons"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import type { IconProps } from "@radix-ui/react-icons/dist/types"
import { Dialog as DialogPrimitive, Root } from "radix-ui"

export const Dialog = DialogPrimitive.Root
export const Icon = ChevronDownIcon
export type Props = IconProps`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle multi-line imports", async () => {
    const input = `import {
  Root,
  Trigger,
  Content
} from "@radix-ui/react-dialog"
import {
  Value,
  Item
} from "@radix-ui/react-select"

export const DialogRoot = Root
export const SelectValue = Value`

    const expected = `import { Root, Trigger, Content, Value, Item } from "radix-ui"

export const DialogRoot = Root
export const SelectValue = Value`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle multi-line imports with mixed formatting", async () => {
    const input = `import {
  Root as DialogRoot,
  Trigger,
  Content,
} from "@radix-ui/react-dialog"
import * as SelectPrimitive from "@radix-ui/react-select"

export const Dialog = DialogRoot
export const Select = SelectPrimitive.Root`

    const expected = `import { Root as DialogRoot, Trigger, Content, Select as SelectPrimitive } from "radix-ui"

export const Dialog = DialogRoot
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle multi-line type imports", async () => {
    const input = `import type {
  ComponentProps,
  DialogProps
} from "@radix-ui/react-dialog"
import {
  type SelectProps,
  Root
} from "@radix-ui/react-select"

export type Props = DialogProps`

    const expected = `import { type ComponentProps, type DialogProps, type SelectProps, Root } from "radix-ui"

export type Props = DialogProps`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should handle complex multi-line imports with comments and extra whitespace", async () => {
    const input = `import {
  Root,   // Main component
  Trigger,

  Content,   // Content component
} from "@radix-ui/react-dialog"

export const DialogRoot = Root`

    const expected = `import { Root, Trigger, Content } from "radix-ui"

export const DialogRoot = Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle multi-line imports with block comments", async () => {
    const input = `import {
  Root, /* main dialog component */
  Trigger,
  Content /* dialog content */,
} from "@radix-ui/react-dialog"

export const DialogRoot = Root`

    const expected = `import { Root, Trigger, Content } from "radix-ui"

export const DialogRoot = Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle real-world shadcn/ui patterns from registry files", async () => {
    // This test captures all the actual import patterns found in the shadcn/ui registry
    const input = `import * as AccordionPrimitive from "@radix-ui/react-accordion"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { Slot } from "@radix-ui/react-slot"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import * as LabelPrimitive from "@radix-ui/react-label"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export const Accordion = AccordionPrimitive.Root
export const AlertDialog = AlertDialogPrimitive.Root
export const Button = Slot`

    const expected = `import { Accordion as AccordionPrimitive, AlertDialog as AlertDialogPrimitive, AspectRatio as AspectRatioPrimitive, Avatar as AvatarPrimitive, Slot as SlotPrimitive, Checkbox as CheckboxPrimitive, Collapsible as CollapsiblePrimitive, ContextMenu as ContextMenuPrimitive, Dialog as DialogPrimitive, DropdownMenu as DropdownMenuPrimitive, HoverCard as HoverCardPrimitive, Label as LabelPrimitive, Menubar as MenubarPrimitive, NavigationMenu as NavigationMenuPrimitive, Popover as PopoverPrimitive, Progress as ProgressPrimitive, RadioGroup as RadioGroupPrimitive, ScrollArea as ScrollAreaPrimitive, Select as SelectPrimitive, Separator as SeparatorPrimitive, Slider as SliderPrimitive, Switch as SwitchPrimitive, Tabs as TabsPrimitive, Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive, Tooltip as TooltipPrimitive } from "radix-ui"

export const Accordion = AccordionPrimitive.Root
export const AlertDialog = AlertDialogPrimitive.Root
export const Button = SlotPrimitive.Slot`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-slot",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
    ])
  })

  it("should handle the special sheet.tsx pattern from registry", async () => {
    // In shadcn/ui, sheet.tsx imports from react-dialog instead of a dedicated sheet package
    const input = `import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger`

    const expected = `import { Dialog as SheetPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-dialog"])
  })

  it("should handle form.tsx mixed pattern from registry", async () => {
    // form.tsx uses both namespace and named imports
    const input = `import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"

export const FormLabel = LabelPrimitive.Root
export const FormControl = Slot`

    const expected = `import { Label as LabelPrimitive, Slot as SlotPrimitive } from "radix-ui"

export const FormLabel = LabelPrimitive.Root
export const FormControl = SlotPrimitive.Slot`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
    ])
  })

  it("should handle all 26 packages used in shadcn/ui registry", async () => {
    // Test that we correctly handle all packages found in the registry analysis
    const allPackages = [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
    ]

    // Create import statements for all packages
    const imports = allPackages
      .map((pkg) => {
        const componentName = pkg
          .replace("@radix-ui/react-", "")
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("")

        if (pkg === "@radix-ui/react-slot") {
          return `import { Slot } from "${pkg}"`
        }
        return `import * as ${componentName}Primitive from "${pkg}"`
      })
      .join("\n")

    const result = await migrateRadixFile(imports)

    // Should contain all 26 packages in replacedPackages
    expect(result.replacedPackages).toHaveLength(26)
    expect(result.replacedPackages.sort()).toEqual(allPackages.sort())

    // Should be a single unified import from radix-ui
    expect(result.content).toContain('from "radix-ui"')
    expect(result.content.startsWith("import {")).toBe(true)
    expect(result.content).toContain("Slot as SlotPrimitive") // Slot should be aliased as SlotPrimitive
    expect(result.content).toContain("Accordion as AccordionPrimitive") // Namespace should be aliased

    // Should have transformed all imports into a single statement
    const importLines = result.content
      .split("\n")
      .filter((line) => line.includes("import"))
    expect(importLines).toHaveLength(1)
  })

  it("should transform Slot usage in ternary expressions", async () => {
    const input = `import { Slot } from "@radix-ui/react-slot"

const Button = ({ asChild, children }) => {
  const Comp = asChild ? Slot : "button"
  const Element = asChild ? Slot : "div"
  return <Comp>{children}</Comp>
}`

    const expected = `import { Slot as SlotPrimitive } from "radix-ui"

const Button = ({ asChild, children }) => {
  const Comp = asChild ? SlotPrimitive.Slot : "button"
  const Element = asChild ? SlotPrimitive.Slot : "div"
  return <Comp>{children}</Comp>
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should handle Slot usage with different spacing patterns", async () => {
    const input = `import { Slot } from "@radix-ui/react-slot"

const Button = ({ asChild }) => {
  const Comp1 = asChild ? Slot : "button"
  const Comp2 = asChild?Slot:"button"
  const Comp3 = asChild  ?  Slot  :  "button"
  return null
}`

    const expected = `import { Slot as SlotPrimitive } from "radix-ui"

const Button = ({ asChild }) => {
  const Comp1 = asChild ? SlotPrimitive.Slot : "button"
  const Comp2 = asChild?SlotPrimitive.Slot:"button"
  const Comp3 = asChild  ?  SlotPrimitive.Slot  :  "button"
  return null
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should handle custom Slot aliases differently", async () => {
    const input = `import { Slot as SlotComponent } from "@radix-ui/react-slot"

const Button = ({ asChild }) => {
  const Comp = asChild ? Slot : "button"
  const Element = asChild ? SlotComponent : "div"
  return null
}`

    const expected = `import { Slot as SlotComponent } from "radix-ui"

const Button = ({ asChild }) => {
  const Comp = asChild ? Slot : "button"
  const Element = asChild ? SlotComponent : "div"
  return null
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should transform all Slot references but preserve string literals", async () => {
    const input = `import { Slot } from "@radix-ui/react-slot"

const Button = ({ asChild }) => {
  const SlotName = "Slot"
  const someSlot = slot
  const Comp = asChild ? Slot : "button"
  return <Slot />
}`

    const expected = `import { Slot as SlotPrimitive } from "radix-ui"

const Button = ({ asChild }) => {
  const SlotName = "Slot"
  const someSlot = slot
  const Comp = asChild ? SlotPrimitive.Slot : "button"
  return <SlotPrimitive.Slot />
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should transform React.ComponentProps<typeof Slot>", async () => {
    const input = `import { Slot } from "@radix-ui/react-slot"
import React from "react"

type ButtonProps = React.ComponentProps<typeof Slot> & {
  variant?: string
}

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}`

    const expected = `import { Slot as SlotPrimitive } from "radix-ui"
import React from "react"

type ButtonProps = React.ComponentProps<typeof SlotPrimitive.Slot> & {
  variant?: string
}

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? SlotPrimitive.Slot : "button"
  return <Comp {...props} />
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should transform ComponentProps<typeof Slot> without React prefix", async () => {
    const input = `import { Slot } from "@radix-ui/react-slot"
import { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof Slot> & {
  variant?: string
}

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}`

    const expected = `import { Slot as SlotPrimitive } from "radix-ui"
import { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof SlotPrimitive.Slot> & {
  variant?: string
}

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? SlotPrimitive.Slot : "button"
  return <Comp {...props} />
}`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual(["@radix-ui/react-slot"])
  })

  it("should not add double semicolons when import already ends with semicolon", async () => {
    const input = `import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui";

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
  })

  it("should not add semicolon when original imports don't have semicolons", async () => {
    const input = `import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as SelectPrimitive from "@radix-ui/react-select"

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const expected = `import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui"

export const Dialog = DialogPrimitive.Root
export const Select = SelectPrimitive.Root`

    const result = await migrateRadixFile(input)
    expect(result.content.trim()).toBe(expected.trim())
    expect(result.replacedPackages).toEqual([
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ])
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
        react: "^18.0.0",
        "@radix-ui/react-dialog": "^1.0.0",
        "@radix-ui/react-select": "^1.0.0",
        "other-package": "^1.0.0",
      },
      devDependencies: {
        "@radix-ui/react-toast": "^1.0.0",
      },
    }

    const expectedPackageJson = {
      name: "test-project",
      dependencies: {
        react: "^18.0.0",
        "other-package": "^1.0.0",
        "radix-ui": "latest",
      },
      devDependencies: {
        "@radix-ui/react-toast": "^1.0.0",
      },
    }

    // Mock package info
    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)

    // Mock file system
    mockFs.writeFile.mockResolvedValue(undefined)

    // Mock fast-glob to return files with Radix imports
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["dialog.tsx", "select.tsx"])

    // Mock file reads to return content with Radix imports
    mockFs.readFile
      .mockResolvedValueOnce(
        'import * as DialogPrimitive from "@radix-ui/react-dialog"'
      )
      .mockResolvedValueOnce(
        'import * as SelectPrimitive from "@radix-ui/react-select"'
      )

    // Mock prompts to confirm migration
    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    // Mock package manager detection
    const { getPackageManager } = await import(
      "@/src/utils/get-package-manager"
    )
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
        react: "^18.0.0",
        "other-package": "^1.0.0",
      },
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)

    const { updateDependencies } = await import(
      "@/src/utils/updaters/update-dependencies"
    )

    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["component.tsx"])

    // Mock file read to return content with no Radix imports
    mockFs.readFile.mockResolvedValue('import React from "react"')

    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig as any)

    // Should not write the file if no Radix packages found
    expect(mockFs.writeFile).not.toHaveBeenCalledWith(
      "/test-project/package.json",
      expect.any(String)
    )

    // Should not attempt to install dependencies
    expect(updateDependencies).not.toHaveBeenCalled()
  })

  it("should handle missing package.json gracefully", async () => {
    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(null)

    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["component.tsx"])

    // Mock file read
    mockFs.readFile.mockResolvedValue('import React from "react"')

    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    // Should not throw
    await expect(migrateRadix(mockConfig)).resolves.not.toThrow()
  })

  it("should automatically install radix-ui dependency", async () => {
    const mockPackageJson = {
      name: "test-project",
      dependencies: {
        "@radix-ui/react-dialog": "^1.0.0",
      },
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)

    const { updateDependencies } = await import(
      "@/src/utils/updaters/update-dependencies"
    )

    mockFs.writeFile.mockResolvedValue(undefined)

    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["dialog.tsx"])

    // Mock file read to return content with Radix imports
    mockFs.readFile.mockResolvedValue(
      'import * as DialogPrimitive from "@radix-ui/react-dialog"'
    )

    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig)

    expect(updateDependencies).toHaveBeenCalledWith(
      ["radix-ui"],
      [],
      mockConfig,
      { silent: false }
    )
  })

  it("should only remove packages that were found in source files", async () => {
    const mockPackageJson = {
      name: "test-project",
      dependencies: {
        react: "^18.0.0",
        "@radix-ui/react-dialog": "^1.0.0",
        "@radix-ui/react-select": "^1.0.0",
        "@radix-ui/react-toast": "^1.0.0", // This one is NOT in source files
        "other-package": "^1.0.0",
      },
    }

    const expectedPackageJson = {
      name: "test-project",
      dependencies: {
        react: "^18.0.0",
        "@radix-ui/react-toast": "^1.0.0", // Should remain since not found in source
        "other-package": "^1.0.0",
        "radix-ui": "latest",
      },
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)

    const { getPackageManager } = await import(
      "@/src/utils/get-package-manager"
    )
    vi.mocked(getPackageManager).mockResolvedValue("npm")

    mockFs.writeFile.mockResolvedValue(undefined)

    // Mock fast-glob to return files with only dialog and select imports
    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["dialog.tsx"])

    // Mock file read to return content with only dialog and select
    mockFs.readFile.mockResolvedValue(`
      import * as DialogPrimitive from "@radix-ui/react-dialog"
      import * as SelectPrimitive from "@radix-ui/react-select"
      export const Dialog = DialogPrimitive.Root
    `)

    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig)

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "/test-project/package.json",
      JSON.stringify(expectedPackageJson, null, 2) + "\n"
    )
  })

  it("should not remove @radix-ui/react-icons from package.json", async () => {
    const mockPackageJson = {
      name: "test-project",
      dependencies: {
        react: "^18.0.0",
        "@radix-ui/react-dialog": "^1.0.0",
        "@radix-ui/react-icons": "^1.3.0", // Should NOT be removed
        "other-package": "^1.0.0",
      },
    }

    const expectedPackageJson = {
      name: "test-project",
      dependencies: {
        react: "^18.0.0",
        "@radix-ui/react-icons": "^1.3.0", // Should remain
        "other-package": "^1.0.0",
        "radix-ui": "latest",
      },
    }

    const { getPackageInfo } = await import("@/src/utils/get-package-info")
    vi.mocked(getPackageInfo).mockReturnValue(mockPackageJson)

    const { getPackageManager } = await import(
      "@/src/utils/get-package-manager"
    )
    vi.mocked(getPackageManager).mockResolvedValue("npm")

    mockFs.writeFile.mockResolvedValue(undefined)

    const fg = await import("fast-glob")
    vi.mocked(fg.default).mockResolvedValue(["dialog.tsx"])

    // Mock file read to return content with dialog imports but NOT icons
    mockFs.readFile.mockResolvedValue(
      'import * as DialogPrimitive from "@radix-ui/react-dialog"'
    )

    const prompts = await import("prompts")
    vi.mocked(prompts.default).mockResolvedValue({ confirm: true })

    await migrateRadix(mockConfig)

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "/test-project/package.json",
      JSON.stringify(expectedPackageJson, null, 2) + "\n"
    )
  })
})
