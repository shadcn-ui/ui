import { describe, expect, it } from "vitest"

import { isContentSame } from "./compare"

describe("isContentSame", () => {
  describe("basic comparisons", () => {
    it("should return true for identical content", () => {
      const content = `const foo = "bar"`
      expect(isContentSame(content, content)).toBe(true)
    })

    it("should return true for content with different line endings", () => {
      const content1 = `line1\nline2\nline3`
      const content2 = `line1\r\nline2\r\nline3`
      expect(isContentSame(content1, content2)).toBe(true)
    })

    it("should return true for content with different whitespace at ends", () => {
      const content1 = `  const foo = "bar"  `
      const content2 = `const foo = "bar"`
      expect(isContentSame(content1, content2)).toBe(true)
    })

    it("should return false for different content", () => {
      const content1 = `const foo = "bar"`
      const content2 = `const foo = "baz"`
      expect(isContentSame(content1, content2)).toBe(false)
    })
  })

  describe("import comparisons with ignoreImports enabled", () => {
    it("should return true for different aliased imports to same module", () => {
      const content1 = `import { Button } from "@/components/ui/button"`
      const content2 = `import { Button } from "~/ui/button"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })

    it("should return true for different paths to same final module", () => {
      const content1 = `import { cn } from "@/lib/utils"`
      const content2 = `import { cn } from "~/utils"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })

    it("should preserve relative imports and require exact match", () => {
      const content1 = `import { Button } from "./button"`
      const content2 = `import { Button } from "../button"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        false
      )
    })

    it("should handle multiple imports with different aliases", () => {
      const content1 = `
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function Component() {
  return <div />
}
`
      const content2 = `
import { Button } from "~/ui/button"
import { cn } from "~/utils"
import { Card } from "#/components/card"

export function Component() {
  return <div />
}
`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })

    it("should handle type imports", () => {
      const content1 = `import type { Config } from "@/types/config"`
      const content2 = `import type { Config } from "~/config"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })

    it("should handle namespace imports", () => {
      const content1 = `import * as React from "react"`
      const content2 = `import * as React from "react"`
      expect(isContentSame(content1, content2)).toBe(true)
    })

    it("should handle mixed default and named imports", () => {
      const content1 = `import React, { useState } from "react"`
      const content2 = `import React, { useState } from "react"`
      expect(isContentSame(content1, content2)).toBe(true)
    })

    it("should return false if non-import content differs", () => {
      const content1 = `
import { Button } from "@/components/ui/button"
export const foo = "bar"
`
      const content2 = `
import { Button } from "~/ui/button"
export const foo = "baz"
`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        false
      )
    })

    it("should handle imports with renamed exports", () => {
      const content1 = `import { Button as Btn } from "@/components/ui/button"`
      const content2 = `import { Button as Btn } from "~/ui/button"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })

    it("should handle multiline imports", () => {
      const content1 = `import {
  Button,
  ButtonProps,
  ButtonVariants
} from "@/components/ui/button"`
      const content2 = `import {
  Button,
  ButtonProps,
  ButtonVariants
} from "~/ui/button"`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })
  })

  describe("import comparisons with ignoreImports disabled (default)", () => {
    it("should return false for different aliased imports", () => {
      const content1 = `import { Button } from "@/components/ui/button"`
      const content2 = `import { Button } from "~/ui/button"`
      expect(isContentSame(content1, content2, { ignoreImports: false })).toBe(
        false
      )
    })

    it("should return false for different aliased imports by default", () => {
      const content1 = `import { Button } from "@/components/ui/button"`
      const content2 = `import { Button } from "~/ui/button"`
      expect(isContentSame(content1, content2)).toBe(false)
    })

    it("should return true only for exact matches", () => {
      const content1 = `import { Button } from "@/components/ui/button"`
      const content2 = `import { Button } from "@/components/ui/button"`
      expect(isContentSame(content1, content2, { ignoreImports: false })).toBe(
        true
      )
    })

    it("should still normalize line endings and whitespace", () => {
      const content1 = `import { Button } from "@/components/ui/button"\r\n`
      const content2 = `import { Button } from "@/components/ui/button"\n`
      expect(isContentSame(content1, content2, { ignoreImports: false })).toBe(
        true
      )
    })
  })

  describe("complex real-world scenarios", () => {
    it("should handle React component with different import aliases", () => {
      const component1 = `
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileCard({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>Profile</CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
`
      const component2 = `
import * as React from "react"
import { cn } from "~/utils"
import { Button } from "~/ui/button"
import { Card, CardContent, CardHeader } from "#/components/card"

export function ProfileCard({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>Profile</CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
`
      expect(
        isContentSame(component1, component2, { ignoreImports: true })
      ).toBe(true)
    })

    it("should detect actual code differences", () => {
      const component1 = `
import { Button } from "@/components/ui/button"

export function Component() {
  return <Button variant="default">Click</Button>
}
`
      const component2 = `
import { Button } from "~/ui/button"

export function Component() {
  return <Button variant="outline">Click</Button>
}
`
      expect(
        isContentSame(component1, component2, { ignoreImports: true })
      ).toBe(false)
    })

    it("should handle files with no imports", () => {
      const content1 = `
export function add(a: number, b: number) {
  return a + b
}
`
      const content2 = `
export function add(a: number, b: number) {
  return a + b
}
`
      expect(isContentSame(content1, content2)).toBe(true)
    })

    it("should handle CSS imports", () => {
      const content1 = `
import styles from "@/styles/component.module.css"
import "./global.css"
`
      const content2 = `
import styles from "~/styles/component.module.css"
import "./global.css"
`
      expect(isContentSame(content1, content2, { ignoreImports: true })).toBe(
        true
      )
    })
  })
})
