import { afterAll, beforeAll, describe, expect, it } from "vitest"
import fs from "fs-extra"
import path from "path"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

// Registry for testing component differences between style variants
const componentDiffRegistry = await createRegistryServer(
  [
    {
      name: "tooltip",
      type: "registry:ui",
      description: "Tooltip component with style variant differences",
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

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: TooltipPrimitive.Portal.Props) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-1 py-1.5 text-sm text-popover-foreground shadow-md",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }`,
          type: "registry:ui",
        },
        {
          path: "components/ui/radix-nova/tooltip.tsx",
          content: `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  skipDelayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }`,
          type: "registry:ui",
        },
      ],
    },
    {
      name: "accordion",
      type: "registry:ui",
      description: "Accordion component with style variant differences",
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

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-none border border-transparent py-2.5 text-left text-xs font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-xs data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }`,
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

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }`,
          type: "registry:ui",
        },
      ],
    },
  ],
  {
    port: 9999,
    path: "/component-diff",
  }
)

beforeAll(async () => {
  await componentDiffRegistry.start()
})

afterAll(async () => {
  await componentDiffRegistry.stop()
})

describe("component differences between style variants", () => {
  describe("import differences", () => {
    it("should handle different import patterns for tooltip", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/tooltip"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // base-lyra should use @base-ui/react
      expect(baseLyraContent).toContain("@base-ui/react/tooltip")
      expect(baseLyraContent).not.toContain("@radix-ui/react-tooltip")

      // radix-nova should use @radix-ui/react-tooltip
      expect(radixNovaContent).toContain("@radix-ui/react-tooltip")
      expect(radixNovaContent).not.toContain("@base-ui/react/tooltip")
    })

    it("should handle different prop types for tooltip", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/tooltip"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // base-lyra should use primitive prop types
      expect(baseLyraContent).toContain("TooltipPrimitive.Provider.Props")
      expect(baseLyraContent).toContain("TooltipPrimitive.Root.Props")
      expect(baseLyraContent).toContain("TooltipPrimitive.Trigger.Props")
      expect(baseLyraContent).toContain("TooltipPrimitive.Portal.Props")

      // radix-nova should use React.ComponentProps
      expect(radixNovaContent).toContain("React.ComponentProps<typeof TooltipPrimitive.Provider>")
      expect(radixNovaContent).toContain("React.ComponentProps<typeof TooltipPrimitive.Root>")
      expect(radixNovaContent).toContain("React.ComponentProps<typeof TooltipPrimitive.Trigger>")
      expect(radixNovaContent).toContain("React.ComponentProps<typeof TooltipPrimitive.Content>")
    })
  })

  describe("styling differences", () => {
    it("should maintain consistent styling patterns with variant-specific differences", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // Both should have common styling classes
      expect(baseLyraContent).toContain("flex w-full flex-col")
      expect(radixNovaContent).toContain("flex w-full flex-col")
      expect(baseLyraContent).toContain("not-last:border-b")
      expect(radixNovaContent).toContain("not-last:border-b")

      // base-lyra specific styling
      expect(baseLyraContent).toContain("rounded-none")
      expect(baseLyraContent).toContain("text-xs")
      expect(baseLyraContent).toContain("ring-1")

      // radix-nova specific styling
      expect(radixNovaContent).toContain("rounded-lg")
      expect(radixNovaContent).toContain("text-sm")
      expect(radixNovaContent).toContain("ring-3")
    })

    it("should handle different CSS variable naming conventions", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // base-lyra should use --accordion-panel-height
      expect(baseLyraContent).toContain("--accordion-panel-height")

      // radix-nova should use --radix-accordion-content-height
      expect(radixNovaContent).toContain("--radix-accordion-content-height")
    })
  })

  describe("component structure consistency", () => {
    it("should export the same components across variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/tooltip", "@component-diff/accordion"])

      // Check tooltip exports
      const baseLyraTooltip = await fs.readFile(
        path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx"),
        "utf-8"
      )
      const radixNovaTooltip = await fs.readFile(
        path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx"),
        "utf-8"
      )

      expect(baseLyraTooltip).toContain("export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }")
      expect(radixNovaTooltip).toContain("export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }")

      // Check accordion exports
      const baseLyraAccordion = await fs.readFile(
        path.join(fixturePath, "components/ui/base-lyra/accordion.tsx"),
        "utf-8"
      )
      const radixNovaAccordion = await fs.readFile(
        path.join(fixturePath, "components/ui/radix-nova/accordion.tsx"),
        "utf-8"
      )

      expect(baseLyraAccordion).toContain("export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }")
      expect(radixNovaAccordion).toContain("export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }")
    })

    it("should maintain data-slot attributes across variants", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/accordion"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/accordion.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/accordion.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // Both should have the same data-slot attributes
      expect(baseLyraContent).toContain('data-slot="accordion"')
      expect(radixNovaContent).toContain('data-slot="accordion"')
      expect(baseLyraContent).toContain('data-slot="accordion-item"')
      expect(radixNovaContent).toContain('data-slot="accordion-item"')
      expect(baseLyraContent).toContain('data-slot="accordion-trigger"')
      expect(radixNovaContent).toContain('data-slot="accordion-trigger"')
      expect(baseLyraContent).toContain('data-slot="accordion-content"')
      expect(radixNovaContent).toContain('data-slot="accordion-content"')
    })
  })

  describe("functionality differences", () => {
    it("should handle different primitive component behaviors", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")
      await configureRegistries(fixturePath, {
        "@component-diff": "http://localhost:9999/component-diff/{name}",
      })

      await npxShadcn(fixturePath, ["add", "@component-diff/tooltip"])

      const baseLyraPath = path.join(fixturePath, "components/ui/base-lyra/tooltip.tsx")
      const radixNovaPath = path.join(fixturePath, "components/ui/radix-nova/tooltip.tsx")

      const baseLyraContent = await fs.readFile(baseLyraPath, "utf-8")
      const radixNovaContent = await fs.readFile(radixNovaPath, "utf-8")

      // radix-nova should have additional props for Provider
      expect(radixNovaContent).toContain("delayDuration")
      expect(radixNovaContent).toContain("skipDelayDuration")
      expect(baseLyraContent).not.toContain("delayDuration")
      expect(baseLyraContent).not.toContain("skipDelayDuration")

      // Content component differences
      expect(baseLyraContent).toContain("TooltipPrimitive.Portal.Props")
      expect(radixNovaContent).toContain("TooltipPrimitive.Content")
    })
  })
})
