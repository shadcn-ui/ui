import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("renders a span with default rect shape and decorative role", () => {
    render(<Skeleton data-testid="s" />)
    const s = screen.getByTestId("s")
    expect(s.tagName).toBe("SPAN")
    expect(s).toHaveAttribute("data-shape", "rect")
    expect(s).toHaveAttribute("aria-hidden", "true")
    expect(s).toHaveAttribute("role", "none")
    expect(s.className).toContain("lead-Skeleton")
  })

  it.each(["text", "rect", "circle"] as const)(
    "supports %s shape",
    (shape) => {
      render(<Skeleton data-testid="s" shape={shape} />)
      expect(screen.getByTestId("s")).toHaveAttribute("data-shape", shape)
    }
  )

  it("when decorative=false, exposes role=status and removes aria-hidden", () => {
    render(<Skeleton data-testid="s" decorative={false} />)
    const s = screen.getByTestId("s")
    expect(s).toHaveAttribute("role", "status")
    expect(s).not.toHaveAttribute("aria-hidden")
  })

  it("does not let user-supplied data-shape override internal state", () => {
    render(
      <Skeleton data-testid="s" shape="rect" data-shape="hacked" />
    )
    expect(screen.getByTestId("s")).toHaveAttribute("data-shape", "rect")
  })

  it("forwards ref to the underlying span", () => {
    const ref = { current: null as HTMLSpanElement | null }
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("merges custom className with the base class", () => {
    render(<Skeleton data-testid="s" className="custom" />)
    const s = screen.getByTestId("s")
    expect(s.className).toContain("lead-Skeleton")
    expect(s.className).toContain("custom")
  })

  it("passes through style for explicit width/height", () => {
    render(
      <Skeleton
        data-testid="s"
        style={{ width: 120, height: 24 }}
      />
    )
    const s = screen.getByTestId("s")
    expect(s.style.width).toBe("120px")
    expect(s.style.height).toBe("24px")
  })

  it("passes through normal attributes like aria-label", () => {
    render(
      <Skeleton
        data-testid="s"
        decorative={false}
        aria-label="Loading user profile"
      />
    )
    expect(screen.getByTestId("s")).toHaveAttribute(
      "aria-label",
      "Loading user profile"
    )
  })
})
