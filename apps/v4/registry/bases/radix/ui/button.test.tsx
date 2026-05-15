import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Button } from "./button"

describe("radix button", () => {
  it("is a forwardRef component", () => {
    expect(Button.$$typeof).toBe(Symbol.for("react.forward_ref"))
  })

  it("renders an asChild child without wrapping", () => {
    const html = renderToStaticMarkup(
      <Button asChild>
        <span>Action</span>
      </Button>
    )

    expect(html).toMatch(/^<span\b[^>]*>Action<\/span>$/)
    expect(html).not.toContain("<button")
  })
})
