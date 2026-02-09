import { transformDirection } from "@/src/utils/transformers/transform-rtl"
import { describe, expect, it } from "vitest"

describe("migrateRtl", () => {
  describe("transformDirection", () => {
    it("should transform className string literals", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className="ml-2 mr-4 text-left">content</div>
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("ms-2")
      expect(result).toContain("me-4")
      expect(result).toContain("text-start")
    })

    it("should transform cn() function arguments", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className={cn("ml-2 mr-4", true && "pl-2")}>content</div>
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("ms-2")
      expect(result).toContain("me-4")
      expect(result).toContain("ps-2")
    })

    it("should transform cva base classes and variants", async () => {
      const input = `
import { cva } from "class-variance-authority"

const buttonVariants = cva("ml-2 mr-4", {
  variants: {
    size: {
      default: "pl-4 pr-4",
      sm: "pl-2 pr-2",
    },
  },
})`

      const result = await transformDirection(input, true)
      expect(result).toContain("ms-2")
      expect(result).toContain("me-4")
      expect(result).toContain("ps-4")
      expect(result).toContain("pe-4")
      expect(result).toContain("ps-2")
      expect(result).toContain("pe-2")
    })

    it("should not transform when rtl is false", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className="ml-2 mr-4 text-left">content</div>
}`

      const result = await transformDirection(input, false)
      expect(result).toContain("ml-2")
      expect(result).toContain("mr-4")
      expect(result).toContain("text-left")
      expect(result).not.toContain("ms-2")
    })

    it("should skip classes with rtl: or ltr: prefixes", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className="ml-2 rtl:mr-2 ltr:pl-4">content</div>
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("ms-2")
      expect(result).toContain("rtl:mr-2")
      expect(result).toContain("ltr:pl-4")
    })

    it("should add rtl: variants for translate-x classes", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className="-translate-x-1/2">content</div>
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("-translate-x-1/2")
      expect(result).toContain("rtl:translate-x-1/2")
    })

    it("should add rtl:space-x-reverse for space-x classes", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <div className="space-x-4">content</div>
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("space-x-4")
      expect(result).toContain("rtl:space-x-reverse")
    })

    it("should transform cn-rtl-flip marker to rtl:rotate-180", async () => {
      const input = `
import * as React from "react"

export function Component() {
  return <Icon className="cn-rtl-flip size-4" />
}`

      const result = await transformDirection(input, true)
      expect(result).toContain("rtl:rotate-180")
      expect(result).toContain("size-4")
      expect(result).not.toContain("cn-rtl-flip")
    })
  })
})
