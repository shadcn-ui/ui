import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Separator } from "./Separator"

describe("Separator", () => {
  it("renders horizontal by default with role=none (decorative)", () => {
    render(<Separator data-testid="s" />)
    const s = screen.getByTestId("s")
    expect(s.tagName).toBe("DIV")
    expect(s).toHaveAttribute("data-orientation", "horizontal")
    expect(s).toHaveAttribute("data-variant", "default")
    expect(s).toHaveAttribute("role", "none")
    expect(s).not.toHaveAttribute("aria-orientation")
    expect(s.className).toContain("lead-Separator")
  })

  it("supports vertical orientation", () => {
    render(<Separator data-testid="s" orientation="vertical" />)
    expect(screen.getByTestId("s")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("when not decorative, sets role=separator and aria-orientation=horizontal", () => {
    render(<Separator decorative={false} />)
    const s = screen.getByRole("separator")
    expect(s).toHaveAttribute("aria-orientation", "horizontal")
  })

  it("when not decorative + vertical, aria-orientation=vertical", () => {
    render(<Separator decorative={false} orientation="vertical" />)
    const s = screen.getByRole("separator")
    expect(s).toHaveAttribute("aria-orientation", "vertical")
  })

  it("supports the strong variant", () => {
    render(<Separator data-testid="s" variant="strong" />)
    expect(screen.getByTestId("s")).toHaveAttribute("data-variant", "strong")
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Separator
        data-testid="s"
        orientation="horizontal"
        variant="default"
        data-orientation="hacked"
        data-variant="hacked"
      />
    )
    const s = screen.getByTestId("s")
    expect(s).toHaveAttribute("data-orientation", "horizontal")
    expect(s).toHaveAttribute("data-variant", "default")
  })

  it("forwards ref to the underlying div", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Separator ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom className with the base class", () => {
    render(<Separator data-testid="s" className="custom" />)
    const s = screen.getByTestId("s")
    expect(s.className).toContain("lead-Separator")
    expect(s.className).toContain("custom")
  })

  it("passes through normal attributes like aria-label", () => {
    render(
      <Separator
        decorative={false}
        aria-label="section break"
      />
    )
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-label",
      "section break"
    )
  })
})
