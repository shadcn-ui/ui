import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Progress } from "./Progress"

describe("Progress", () => {
  it("renders a progressbar with default size and variant", () => {
    render(<Progress value={40} aria-label="loading" />)
    const p = screen.getByRole("progressbar", { name: "loading" })
    expect(p).toHaveAttribute("data-size", "md")
    expect(p).toHaveAttribute("data-variant", "default")
    expect(p.className).toContain("lead-Progress")
  })

  it.each(["sm", "md", "lg"] as const)("supports %s size", (size) => {
    render(<Progress value={50} size={size} aria-label="x" />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-size",
      size
    )
  })

  it.each(
    ["default", "success", "warning", "danger"] as const
  )("supports %s variant", (variant) => {
    render(<Progress value={50} variant={variant} aria-label="x" />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-variant",
      variant
    )
  })

  it("exposes aria-valuemin / aria-valuemax / aria-valuenow", () => {
    render(<Progress value={42} max={200} aria-label="x" />)
    const p = screen.getByRole("progressbar")
    // Radix Progress sets the aria value attributes via data-* + the
    // role's implicit semantics. Read them directly.
    expect(p).toHaveAttribute("aria-valuemax", "200")
    expect(p).toHaveAttribute("aria-valuenow", "42")
  })

  it("clamps the indicator transform between 0 and 100%", () => {
    const { rerender } = render(
      <Progress value={-50} aria-label="x" />
    )
    let indicator = document.querySelector(
      ".lead-Progress__indicator"
    ) as HTMLElement
    expect(indicator.style.transform).toBe("translateX(-100%)")

    rerender(<Progress value={200} aria-label="x" />)
    indicator = document.querySelector(
      ".lead-Progress__indicator"
    ) as HTMLElement
    // Browsers serialize translateX(0%) as translateX(-0%) when computed
    // from `100 - 100`. Match either form.
    expect(indicator.style.transform).toMatch(/^translateX\(-?0%\)$/)
  })

  it("renders an indeterminate progressbar when value is undefined or null", () => {
    const { rerender } = render(<Progress aria-label="x" />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "indeterminate"
    )
    rerender(<Progress value={null} aria-label="x" />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "indeterminate"
    )
  })

  it("renders a determinate progressbar when value is set", () => {
    render(<Progress value={75} aria-label="x" />)
    const state = screen.getByRole("progressbar").getAttribute("data-state")
    // Radix uses 'loading' for in-progress determinate, 'complete' for full.
    expect(["loading", "complete"]).toContain(state)
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Progress
        value={50}
        size="md"
        variant="default"
        aria-label="x"
        data-size="hacked"
        data-variant="hacked"
      />
    )
    const p = screen.getByRole("progressbar")
    expect(p).toHaveAttribute("data-size", "md")
    expect(p).toHaveAttribute("data-variant", "default")
  })

  it("forwards ref to the underlying div", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Progress value={10} ref={ref} aria-label="x" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom className with the base class", () => {
    render(<Progress value={10} aria-label="x" className="custom" />)
    const p = screen.getByRole("progressbar")
    expect(p.className).toContain("lead-Progress")
    expect(p.className).toContain("custom")
  })

  it("passes through aria-labelledby and aria-describedby", () => {
    render(
      <>
        <span id="lbl">Upload progress</span>
        <Progress value={20} aria-labelledby="lbl" aria-describedby="desc" />
        <span id="desc">38 of 200 files complete</span>
      </>
    )
    const p = screen.getByRole("progressbar")
    expect(p).toHaveAttribute("aria-labelledby", "lbl")
    expect(p).toHaveAttribute("aria-describedby", "desc")
  })
})
