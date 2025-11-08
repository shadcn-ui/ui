import { Project, ScriptKind } from "ts-morph"
import { describe, expect, it } from "vitest"

import { type StyleMap } from "./create-style-map"
import { transformPortal } from "./transform-portal"

async function applyTransform(source: string, styleMap: StyleMap) {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  await transformPortal({ sourceFile, styleMap })

  return sourceFile.getText()
}

describe("transformPortal", () => {
  it("replaces CanvaPortal with element prop", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"
import { AlertDialogPortal } from "radix-ui"

function AlertDialogContent() {
  return (
    <CanvaPortal element={<AlertDialogPortal />}>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { AlertDialogPortal } from "radix-ui"

      function AlertDialogContent() {
        return (
          <AlertDialogPortal><div>Content</div></AlertDialogPortal>
        )
      }
      "
    `)
  })

  it("preserves children when replacing CanvaPortal", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function AlertDialogContent() {
  return (
    <CanvaPortal element={<AlertDialogPortal />}>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content className="test" />
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function AlertDialogContent() {
        return (
          <AlertDialogPortal><AlertDialogOverlay />
                  <AlertDialogPrimitive.Content className="test" /></AlertDialogPortal>
        )
      }
      "
    `)
  })

  it("handles element prop with attributes", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<SomePortal className="test" data-testid="portal" />}>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <SomePortal className="test" data-testid="portal"><div>Content</div></SomePortal>
        )
      }
      "
    `)
  })

  it("removes CanvaPortal import but keeps other imports from same module", async () => {
    const source = `import * as React from "react"
import { CanvaPortal, OtherComponent } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<SomePortal />}>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { OtherComponent } from "@/app/(app)/design/components/canva"

      function Test() {
        return (
          <SomePortal><div>Content</div></SomePortal>
        )
      }
      "
    `)
  })

  it("handles multiple CanvaPortal elements in one file", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <div>
      <CanvaPortal element={<FirstPortal />}>
        <div>First</div>
      </CanvaPortal>
      <CanvaPortal element={<SecondPortal />}>
        <div>Second</div>
      </CanvaPortal>
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
            <FirstPortal><div>First</div></FirstPortal>
            <SecondPortal><div>Second</div></SecondPortal>
          </div>
        )
      }
      "
    `)
  })

  it("skips CanvaPortal without element prop", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CanvaPortal } from "@/app/(app)/design/components/canva"

      function Test() {
        return (
          <CanvaPortal>
            <div>Content</div>
          </CanvaPortal>
        )
      }
      "
    `)
  })

  it("handles element prop with non-self-closing jsx element", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<SomePortal className="portal"><span>Portal content</span></SomePortal>}>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <SomePortal className="portal"><div>Content</div></SomePortal>
        )
      }
      "
    `)
  })

  it("handles empty children", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<SomePortal />}>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <SomePortal></SomePortal>
        )
      }
      "
    `)
  })

  it("handles deeply nested children", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<DialogPortal />}>
      <div className="overlay">
        <div className="content">
          <header>
            <h1>Title</h1>
          </header>
          <main>Body</main>
        </div>
      </div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <DialogPortal><div className="overlay">
                    <div className="content">
                      <header>
                        <h1>Title</h1>
                      </header>
                      <main>Body</main>
                    </div>
                  </div></DialogPortal>
        )
      }
      "
    `)
  })

  it("handles element with multiple complex attributes", async () => {
    const source = `import * as React from "react"
import { CanvaPortal } from "@/app/(app)/design/components/canva"

function Test() {
  return (
    <CanvaPortal element={<Portal container={containerRef} className="portal" data-state="open" {...props} />}>
      <div>Content</div>
    </CanvaPortal>
  )
}
`

    const result = await applyTransform(source, {})

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Test() {
        return (
          <Portal container={containerRef} className="portal" data-state="open" {...props}><div>Content</div></Portal>
        )
      }
      "
    `)
  })
})
