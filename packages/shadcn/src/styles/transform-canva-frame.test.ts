import { Project, ScriptKind } from "ts-morph"
import { describe, expect, it } from "vitest"

import { type StyleMap } from "./create-style-map"
import { transformCanvaFrame } from "./transform-canva-frame"

async function applyTransform(source: string, styleMap: StyleMap) {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  await transformCanvaFrame({ sourceFile, styleMap })

  return sourceFile.getText()
}

describe("transformCanvaFrame", () => {
  it("replaces CanvaFrame with div and updates className", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start">
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("preserves other attributes", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start" id="test" data-state="open">
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8" id="test" data-state="open"><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("handles CanvaFrame without className", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame>
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("handles spread attributes", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start" {...props}>
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8" {...props}><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("removes CanvaFrame import", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-center">
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("keeps other imports from same module", async () => {
    const source = `import * as React from "react"
import { CanvaFrame, OtherComponent } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start">
      <div>Content</div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { OtherComponent } from "@/app/(app)/design/components/canva"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>Content</div></div>
        )
      }
      "
    `)
  })

  it("handles multiple CanvaFrame elements", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <div>
      <CanvaFrame className="items-start">
        <div>First</div>
      </CanvaFrame>
      <CanvaFrame className="items-end">
        <div>Second</div>
      </CanvaFrame>
    </div>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div>
            <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>First</div></div>
            <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div>Second</div></div>
          </div>
        )
      }
      "
    `)
  })

  it("preserves complex nested children", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start">
      <div className="header">
        <h1>Title</h1>
        <p>Description</p>
      </div>
      <div className="content">
        <span>Text</span>
      </div>
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"><div className="header">
                    <h1>Title</h1>
                    <p>Description</p>
                  </div>
                  <div className="content">
                    <span>Text</span>
                  </div></div>
        )
      }
      "
    `)
  })

  it("handles empty children", async () => {
    const source = `import * as React from "react"
import { CanvaFrame } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaFrame className="items-start">
    </CanvaFrame>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <div className="bg-background border flex overflow-hidden rounded-xl p-8"></div>
        )
      }
      "
    `)
  })
})
