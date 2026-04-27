import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Label } from "./Label"

describe("Label", () => {
  it("renders children with default attributes", () => {
    render(<Label>Email</Label>)
    const label = screen.getByText("Email")
    expect(label.tagName).toBe("LABEL")
    expect(label).toHaveAttribute("data-size", "md")
    expect(label).toHaveAttribute("data-disabled", "false")
  })

  it("forwards htmlFor to the underlying label", () => {
    render(<Label htmlFor="email-input">Email</Label>)
    const label = screen.getByText("Email")
    expect(label).toHaveAttribute("for", "email-input")
  })

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Label size={size}>x</Label>)
    expect(screen.getByText("x")).toHaveAttribute("data-size", size)
  })

  it("exposes data-disabled when disabled", () => {
    render(<Label disabled>x</Label>)
    expect(screen.getByText("x")).toHaveAttribute("data-disabled", "true")
  })

  it("renders the required indicator when required is true", () => {
    render(<Label required>Email</Label>)
    const label = screen.getByText("Email")
    expect(label.querySelector(".lead-Label__required")).not.toBeNull()
    expect(label.textContent).toContain("*")
  })

  it("omits the required indicator by default", () => {
    render(<Label>Email</Label>)
    const label = screen.getByText("Email")
    expect(label.querySelector(".lead-Label__required")).toBeNull()
  })

  it("uses a custom requiredIndicator and requiredLabel when provided", () => {
    render(
      <Label required requiredIndicator="(req)" requiredLabel="must">
        Email
      </Label>
    )
    const indicator = screen
      .getByText("Email")
      .querySelector(".lead-Label__required")
    expect(indicator).not.toBeNull()
    expect(indicator?.textContent).toContain("(req)")
    expect(indicator?.textContent).toContain("must")
  })

  it("forwards ref to the underlying label element", () => {
    const ref = { current: null as HTMLLabelElement | null }
    render(<Label ref={ref}>x</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it("merges custom className with the base class", () => {
    render(<Label className="custom">x</Label>)
    const label = screen.getByText("x")
    expect(label.className).toContain("lead-Label")
    expect(label.className).toContain("custom")
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Label
        size="md"
        disabled
        data-size="xl"
        data-disabled="false"
      >
        x
      </Label>
    )
    const label = screen.getByText("x")
    expect(label).toHaveAttribute("data-size", "md")
    expect(label).toHaveAttribute("data-disabled", "true")
  })
})
