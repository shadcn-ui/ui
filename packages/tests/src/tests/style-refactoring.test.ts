import { afterAll, beforeAll, describe, expect, it } from "vitest"
import fs from "fs-extra"
import path from "path"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

// Mock registry with style variants for testing
const styleRegistry = await createRegistryServer(
  [
    {
      name: "accordion",
      type: "registry:ui",
      description: "An accordion component with style variants",
      files: [
        {
          path: "components/ui/base-lyra/accordion.tsx",
          content: `"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

export { Accordion }`,
          type: "registry:ui",
        },
        {
          path: "components/ui/radix-nova/accordion.tsx",
          content: `"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

export { Accordion }`,
          type: "registry:ui",
        },
      ],
    },
    {
      name: "tooltip",
      type: "registry:ui",
      description: "A tooltip component with style variants",
      files: [
        {
          path: "components/ui/base-lyra/tooltip.tsx",
          content: `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />
}

export { TooltipProvider, Tooltip }`,
          type: "registry:ui",
        },
        {
          path: "components/ui/radix-nova/tooltip.tsx",
          content: `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

export { TooltipProvider, Tooltip }`,
          type: "registry:ui",
        },
      ],
    },
  ],
  {
    port: 8888,
    path: "/styles",
  }
)

beforeAll(async () => {
  await styleRegistry.start()
})

afterAll(async () => {
  await styleRegistry.stop()
})

describe("style refactoring tests", () => {
  describe("component import consistency", () => {
    it("should maintain consistent imports across style variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      // Add accordion component
      await npxShadcn(fixturePath, ["add", "@styles/accordion"])

      // Check both style variants exist
      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      expect(await fs.pathExists(baseLyraPath)).toBe(true)
      expect(await fs.pathExists(radixNovaPath)).toBe(true)

      // Verify import differences
      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // base-lyra should use @base-ui/react
      expect(baseLyraContent).toContain("@base-ui/react/accordion")
      expect(baseLyraContent).not.toContain("radix-ui")

      // radix-nova should use radix-ui
      expect(radixNovaContent).toContain("radix-ui")
      expect(radixNovaContent).not.toContain("@base-ui/react")
    })

    it("should handle React import differences correctly", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      // Add tooltip component
      await npxShadcn(fixturePath, ["add", "@styles/tooltip"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // Both should have React import but radix-nova should use React.ComponentProps
      expect(baseLyraContent).toContain("import * as React from \"react\"")
      expect(radixNovaContent).toContain("import * as React from \"react\"")

      // radix-nova should use React.ComponentProps
      expect(radixNovaContent).toContain("React.ComponentProps")
      expect(baseLyraContent).not.toContain("React.ComponentProps")
    })
  })

  describe("component structure validation", () => {
    it("should maintain consistent component structure across variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@styles/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // Both should export the same components
      expect(baseLyraContent).toContain("export { Accordion }")
      expect(radixNovaContent).toContain("export { Accordion }")

      // Both should have the same data-slot attributes
      expect(baseLyraContent).toContain('data-slot="accordion"')
      expect(radixNovaContent).toContain('data-slot="accordion"')

      // Both should use cn utility
      expect(baseLyraContent).toContain("cn(")
      expect(radixNovaContent).toContain("cn(")
    })

    it("should preserve styling patterns across variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@styles/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // Both should have similar CSS classes
      expect(baseLyraContent).toContain("flex w-full flex-col")
      expect(radixNovaContent).toContain("flex w-full flex-col")
    })
  })

  describe("style variant organization", () => {
    it("should create proper directory structure for style variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@styles/accordion", "@styles/tooltip"])

      // Check that directories are created correctly
      const baseLyraDir = path.join(fixturePath, "components/ui/base-lyra")
      const radixNovaDir = path.join(fixturePath, "components/ui/radix-nova")

      expect(await fs.pathExists(baseLyraDir)).toBe(true)
      expect(await fs.pathExists(radixNovaDir)).toBe(true)

      // Check that components are in the right directories
      expect(await fs.pathExists(path.join(baseLyraDir, "accordion.tsx"))).toBe(true)
      expect(await fs.pathExists(path.join(baseLyraDir, "tooltip.tsx"))).toBe(true)
      expect(await fs.pathExists(path.join(radixNovaDir, "accordion.tsx"))).toBe(true)
      expect(await fs.pathExists(path.join(radixNovaDir, "tooltip.tsx"))).toBe(true)
    })
  })

  describe("migration compatibility", () => {
    it("should handle migration from old radix to new structure", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      
      // Simulate old structure
      const oldComponentsDir = path.join(fixturePath, "components/ui")
      await fs.ensureDir(oldComponentsDir)
      
      // Create old-style component
      const oldAccordionPath = path.join(oldComponentsDir, "accordion.tsx")
      await fs.writeFile(oldAccordionPath, `"use client"

import { Accordion as AccordionPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Accordion({ className, ...props }) {
  return (
    <AccordionPrimitive.Root className={cn("flex w-full flex-col", className)} {...props} />
  )
}

export { Accordion }`)

      // Configure and add new style variants
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@styles/accordion"])

      // New variants should be created alongside old one
      expect(await fs.pathExists(oldAccordionPath)).toBe(true) // Old file preserved
      expect(await fs.pathExists(path.join(fixturePath, "components/ui/base-lyra/accordion.tsx"))).toBe(true)
      expect(await fs.pathExists(path.join(fixturePath, "components/ui/radix-nova/accordion.tsx"))).toBe(true)
    })
  })

  describe("type safety validation", () => {
    it("should maintain type safety across all variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@styles": "http://localhost:8888/styles/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@styles/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // base-lyra should use AccordionPrimitive.Root.Props
      expect(baseLyraContent).toContain("AccordionPrimitive.Root.Props")

      // radix-nova should use React.ComponentProps
      expect(radixNovaContent).toContain("React.ComponentProps<typeof AccordionPrimitive.Root>")
    })
  })
})
