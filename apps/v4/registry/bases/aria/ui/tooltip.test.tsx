import * as React from "react"
import { describe, expect, test } from "vitest"

import { Tooltip, TooltipTrigger } from "./tooltip"

describe("tooltip trigger", () => {
  test("keeps the trigger element directly attached to the tooltip trigger", () => {
    const rendered = TooltipTrigger({
      delay: 0,
      children: [
        <button key="trigger" type="button">
          Hover
        </button>,
        <Tooltip key="tooltip">Add to library</Tooltip>,
      ],
    })

    expect(rendered.props.children[0].type).toBe("button")
    expect(rendered.props.children[0].props.type).toBe("button")
  })
})
