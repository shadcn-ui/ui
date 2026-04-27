import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Input } from "./Input"

describe("Input", () => {
  it("renders with default attributes", () => {
    render(<Input aria-label="email" />)
    const input = screen.getByLabelText("email") as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "text")
    expect(input).toHaveAttribute("data-size", "md")
    expect(input).toHaveAttribute("data-invalid", "false")
    expect(input).toHaveAttribute("data-disabled", "false")
    expect(input).not.toHaveAttribute("aria-invalid")
    expect(input).not.toBeDisabled()
  })

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Input aria-label="x" size={size} />)
    expect(screen.getByLabelText("x")).toHaveAttribute("data-size", size)
  })

  it("sets aria-invalid when invalid is true", () => {
    render(<Input aria-label="x" invalid />)
    const input = screen.getByLabelText("x")
    expect(input).toHaveAttribute("data-invalid", "true")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("treats variant=error as invalid", () => {
    render(<Input aria-label="x" variant="error" />)
    const input = screen.getByLabelText("x")
    expect(input).toHaveAttribute("data-invalid", "true")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("explicit invalid={false} overrides variant=error", () => {
    render(<Input aria-label="x" variant="error" invalid={false} />)
    const input = screen.getByLabelText("x")
    expect(input).toHaveAttribute("data-invalid", "false")
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  it("disables the input and exposes data-disabled when disabled", () => {
    render(<Input aria-label="x" disabled />)
    const input = screen.getByLabelText("x")
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("data-disabled", "true")
  })

  it("forwards ref to the underlying input element", () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("merges custom className with the base class", () => {
    render(<Input aria-label="x" className="custom" />)
    const input = screen.getByLabelText("x")
    expect(input.className).toContain("lead-Input")
    expect(input.className).toContain("custom")
  })

  it("passes through normal attributes like data-testid and placeholder", () => {
    render(
      <Input
        aria-label="x"
        data-testid="email"
        placeholder="you@example.com"
      />
    )
    const input = screen.getByTestId("email")
    expect(input).toHaveAttribute("placeholder", "you@example.com")
  })

  it("forwards onChange when enabled", () => {
    const onChange = vi.fn()
    render(<Input aria-label="x" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText("x"), {
      target: { value: "abc" },
    })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Input
        aria-label="x"
        size="md"
        invalid
        disabled
        data-size="xl"
        data-invalid="false"
        data-disabled="false"
      />
    )
    const input = screen.getByLabelText("x")
    expect(input).toHaveAttribute("data-size", "md")
    expect(input).toHaveAttribute("data-invalid", "true")
    expect(input).toHaveAttribute("data-disabled", "true")
  })

  it("respects custom type", () => {
    render(<Input aria-label="x" type="email" />)
    expect(screen.getByLabelText("x")).toHaveAttribute("type", "email")
  })
})
