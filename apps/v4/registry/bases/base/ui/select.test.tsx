import { describe, expect, test } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import { Select, SelectTrigger, SelectValue } from "./select"

describe("select registry", () => {
  test("does not render a stray chevron character inside the trigger icon", () => {
    const html = renderToStaticMarkup(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a value" />
        </SelectTrigger>
      </Select>
    )

    expect(html).not.toContain("▼")
  })
})
