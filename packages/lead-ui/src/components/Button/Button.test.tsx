import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./Button"

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Save</Button>)
    const btn = screen.getByRole("button", { name: "Save" })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute("data-variant", "primary")
    expect(btn).toHaveAttribute("data-size", "md")
    expect(btn).toHaveAttribute("type", "button")
    expect(btn).not.toBeDisabled()
  })

  it.each(["primary", "secondary", "outline", "ghost", "danger"] as const)(
    "renders %s variant",
    (variant) => {
      render(<Button variant={variant}>Click</Button>)
      expect(screen.getByRole("button")).toHaveAttribute(
        "data-variant",
        variant
      )
    }
  )

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Button size={size}>Click</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("data-size", size)
  })

  it("disables the button and exposes data-disabled when disabled", () => {
    render(<Button disabled>Save</Button>)
    const btn = screen.getByRole("button")
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute("data-disabled", "true")
  })

  it("renders a spinner with aria-busy when loading", () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole("button")
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute("aria-busy", "true")
    expect(btn).toHaveAttribute("data-loading", "true")
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument()
  })

  it("hides leading and trailing icons while loading", () => {
    render(
      <Button
        loading
        leadingIcon={<span data-testid="leading">L</span>}
        trailingIcon={<span data-testid="trailing">T</span>}
      >
        Save
      </Button>
    )
    expect(screen.queryByTestId("leading")).toBeNull()
    expect(screen.queryByTestId("trailing")).toBeNull()
  })

  it("forwards onClick when enabled", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("forwards ref to the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges custom className with the base class", () => {
    render(<Button className="custom">Save</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("lead-Button")
    expect(btn.className).toContain("custom")
  })
})
