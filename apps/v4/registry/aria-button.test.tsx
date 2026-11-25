import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Button, LinkButton } from "./bases/aria/ui/button"

// React Aria's Button filters aria-invalid out of the DOM props, so the
// destructive styles keyed on [aria-invalid] never apply (#12805). The
// registry component maps it to data-invalid, which React Aria forwards.
describe("aria base Button", () => {
  it("maps aria-invalid to data-invalid so invalid styles apply", () => {
    const html = renderToString(<Button aria-invalid="true">Save</Button>)

    expect(html).toContain("data-invalid")
    expect(html).not.toContain("aria-invalid")
  })

  it("does not set data-invalid when aria-invalid is absent", () => {
    const html = renderToString(<Button>Save</Button>)

    expect(html).not.toContain("data-invalid")
    expect(html).not.toContain("aria-invalid")
  })

  it("maps aria-invalid on LinkButton the same way", () => {
    const html = renderToString(
      <LinkButton href="/x" aria-invalid="true">
        Open
      </LinkButton>
    )

    expect(html).toContain("data-invalid")
    expect(html).not.toContain("aria-invalid")
  })
})
