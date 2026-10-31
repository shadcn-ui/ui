import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Progress as RadixProgress } from "./bases/radix/ui/progress"
import { Progress as NewYorkProgress } from "./new-york-v4/ui/progress"

describe.each([
  ["bases/radix", RadixProgress],
  ["new-york-v4", NewYorkProgress],
])("%s progress", (_, Progress) => {
  it("forwards value to the root", () => {
    const html = renderToStaticMarkup(<Progress value={42} />)

    expect(html).toContain('aria-valuenow="42"')
    expect(html).toContain('data-state="loading"')
  })

  it("stays indeterminate without a value", () => {
    const html = renderToStaticMarkup(<Progress />)

    expect(html).not.toContain("aria-valuenow")
    expect(html).toContain('data-state="indeterminate"')
  })
})
