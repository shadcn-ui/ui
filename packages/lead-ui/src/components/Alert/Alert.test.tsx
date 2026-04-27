import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Alert, AlertDescription, AlertTitle } from "./Alert"

describe("Alert", () => {
  it("renders a div with default neutral variant and role=status", () => {
    render(<Alert data-testid="a">x</Alert>)
    const a = screen.getByTestId("a")
    expect(a.tagName).toBe("DIV")
    expect(a).toHaveAttribute("data-variant", "neutral")
    expect(a).toHaveAttribute("role", "status")
    expect(a.className).toContain("lead-Alert")
  })

  it.each(["neutral", "info", "success"] as const)(
    "uses role=status for the polite variant %s",
    (variant) => {
      render(<Alert data-testid="a" variant={variant}>x</Alert>)
      expect(screen.getByTestId("a")).toHaveAttribute("role", "status")
    }
  )

  it.each(["warning", "danger"] as const)(
    "uses role=alert for the assertive variant %s",
    (variant) => {
      render(<Alert data-testid="a" variant={variant}>x</Alert>)
      expect(screen.getByTestId("a")).toHaveAttribute("role", "alert")
    }
  )

  it.each(
    ["neutral", "info", "success", "warning", "danger"] as const
  )("sets data-variant=%s", (variant) => {
    render(<Alert data-testid="a" variant={variant}>x</Alert>)
    expect(screen.getByTestId("a")).toHaveAttribute("data-variant", variant)
  })

  it("respects an explicit role override", () => {
    render(
      <Alert data-testid="a" variant="danger" role="alertdialog">
        x
      </Alert>
    )
    expect(screen.getByTestId("a")).toHaveAttribute("role", "alertdialog")
  })

  it("does not let user-supplied data-variant override internal state", () => {
    render(
      <Alert data-testid="a" variant="info" data-variant="hacked">
        x
      </Alert>
    )
    expect(screen.getByTestId("a")).toHaveAttribute("data-variant", "info")
  })

  it("forwards ref to the underlying div", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Alert ref={ref}>x</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom className with the base class", () => {
    render(<Alert data-testid="a" className="custom">x</Alert>)
    const a = screen.getByTestId("a")
    expect(a.className).toContain("lead-Alert")
    expect(a.className).toContain("custom")
  })

  it("passes through normal attributes like aria-label", () => {
    render(<Alert data-testid="a" aria-label="ann">x</Alert>)
    expect(screen.getByTestId("a")).toHaveAttribute("aria-label", "ann")
  })
})

describe("AlertTitle", () => {
  it("renders a p with the base class", () => {
    render(<AlertTitle>Heads up</AlertTitle>)
    const t = screen.getByText("Heads up")
    expect(t.tagName).toBe("P")
    expect(t.className).toContain("lead-AlertTitle")
  })

  it("forwards ref to the paragraph", () => {
    const ref = { current: null as HTMLParagraphElement | null }
    render(<AlertTitle ref={ref}>x</AlertTitle>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it("merges custom className", () => {
    render(<AlertTitle className="custom">x</AlertTitle>)
    expect(screen.getByText("x").className).toContain("custom")
  })
})

describe("AlertDescription", () => {
  it("renders a p with the base class", () => {
    render(<AlertDescription>body</AlertDescription>)
    const d = screen.getByText("body")
    expect(d.tagName).toBe("P")
    expect(d.className).toContain("lead-AlertDescription")
  })

  it("forwards ref to the paragraph", () => {
    const ref = { current: null as HTMLParagraphElement | null }
    render(<AlertDescription ref={ref}>x</AlertDescription>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })
})

describe("Alert composition", () => {
  it("renders title + description as siblings inside the alert", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your trial ends in 3 days.</AlertDescription>
      </Alert>
    )
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Heads up")).toBeInTheDocument()
    expect(
      screen.getByText("Your trial ends in 3 days.")
    ).toBeInTheDocument()
  })

  it("does not render an icon slot by default", () => {
    render(
      <Alert>
        <AlertTitle>x</AlertTitle>
      </Alert>
    )
    const alertEl = screen.getByText("x").closest(".lead-Alert") as HTMLElement
    expect(alertEl).toHaveAttribute("data-with-icon", "false")
    expect(alertEl.querySelector(".lead-Alert__icon")).toBeNull()
  })

  it("renders the caller-supplied icon as aria-hidden inside an icon slot", () => {
    render(
      <Alert variant="info" icon={<span data-testid="icon">ℹ</span>}>
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Body</AlertDescription>
      </Alert>
    )
    const alertEl = screen
      .getByText("Info")
      .closest(".lead-Alert") as HTMLElement
    expect(alertEl).toHaveAttribute("data-with-icon", "true")
    const slot = alertEl.querySelector(".lead-Alert__icon") as HTMLElement
    expect(slot).not.toBeNull()
    expect(slot).toHaveAttribute("aria-hidden", "true")
    expect(slot.querySelector("[data-testid='icon']")).not.toBeNull()
  })
})
