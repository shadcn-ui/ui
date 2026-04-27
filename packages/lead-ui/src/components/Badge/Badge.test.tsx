import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "./Badge"

describe("Badge", () => {
  it("renders a span with default attributes", () => {
    render(<Badge>New</Badge>)
    const b = screen.getByText("New")
    expect(b.tagName).toBe("SPAN")
    expect(b).toHaveAttribute("data-variant", "neutral")
    expect(b).toHaveAttribute("data-size", "md")
    expect(b.className).toContain("lead-Badge")
  })

  it.each(
    ["neutral", "brand", "success", "warning", "danger"] as const
  )("supports %s variant", (variant) => {
    render(<Badge variant={variant}>x</Badge>)
    expect(screen.getByText("x")).toHaveAttribute("data-variant", variant)
  })

  it.each(["sm", "md", "lg"] as const)("supports %s size", (size) => {
    render(<Badge size={size}>x</Badge>)
    expect(screen.getByText("x")).toHaveAttribute("data-size", size)
  })

  it("does not render the dot by default", () => {
    render(<Badge>x</Badge>)
    expect(
      screen.getByText("x").querySelector(".lead-Badge__dot")
    ).toBeNull()
  })

  it("renders the dot when dot=true", () => {
    render(<Badge dot>active</Badge>)
    const dot = screen.getByText("active").querySelector(".lead-Badge__dot")
    expect(dot).not.toBeNull()
    expect(dot).toHaveAttribute("aria-hidden", "true")
  })

  it("forwards ref to the underlying span", () => {
    const ref = { current: null as HTMLSpanElement | null }
    render(<Badge ref={ref}>x</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("merges custom className with the base class", () => {
    render(<Badge className="custom">x</Badge>)
    const b = screen.getByText("x")
    expect(b.className).toContain("lead-Badge")
    expect(b.className).toContain("custom")
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Badge
        variant="brand"
        size="md"
        data-variant="hacked"
        data-size="hacked"
      >
        x
      </Badge>
    )
    const b = screen.getByText("x")
    expect(b).toHaveAttribute("data-variant", "brand")
    expect(b).toHaveAttribute("data-size", "md")
  })

  it("passes through normal attributes like aria-label and data-testid", () => {
    render(
      <Badge aria-label="status" data-testid="b">
        x
      </Badge>
    )
    const b = screen.getByTestId("b")
    expect(b).toHaveAttribute("aria-label", "status")
  })
})
