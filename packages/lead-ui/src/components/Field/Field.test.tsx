import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "../Input/Input"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./index"

describe("Field", () => {
  it("renders children inside a container with default attributes", () => {
    render(
      <Field data-testid="root">
        <span>contents</span>
      </Field>
    )
    const root = screen.getByTestId("root")
    expect(root.tagName).toBe("DIV")
    expect(root).toHaveAttribute("data-orientation", "vertical")
    expect(root).toHaveAttribute("data-invalid", "false")
    expect(root).toHaveAttribute("data-disabled", "false")
  })

  it("supports horizontal orientation", () => {
    render(<Field data-testid="root" orientation="horizontal" />)
    expect(screen.getByTestId("root")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("propagates disabled and invalid to FieldControl + FieldLabel", () => {
    render(
      <Field disabled invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>We never share this</FieldDescription>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
        <FieldError>Required</FieldError>
      </Field>
    )
    const input = screen.getByLabelText("email")
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("aria-invalid", "true")

    const label = screen.getByText("Email")
    expect(label).toHaveAttribute("data-disabled", "true")
    expect(label).toHaveAttribute("for", input.getAttribute("id"))
  })

  it("auto-generates and shares an id between FieldLabel and FieldControl", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
      </Field>
    )
    const input = screen.getByLabelText("email")
    const label = screen.getByText("Email")
    const id = input.getAttribute("id")
    expect(id).toMatch(/^lead-field-/)
    expect(label).toHaveAttribute("for", id!)
  })

  it("respects an explicit Field id", () => {
    render(
      <Field id="custom-id">
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
      </Field>
    )
    expect(screen.getByLabelText("email")).toHaveAttribute("id", "custom-id")
    expect(screen.getByText("Email")).toHaveAttribute("for", "custom-id")
  })

  it("wires aria-describedby to the description when present", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>We never share this</FieldDescription>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
      </Field>
    )
    const input = screen.getByLabelText("email")
    const desc = screen.getByText("We never share this")
    expect(input).toHaveAttribute("aria-describedby", desc.id)
    expect(desc.id).toMatch(/-description$/)
  })

  it("includes the error id in aria-describedby only when invalid AND an error is rendered", () => {
    const { rerender } = render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
      </Field>
    )
    // invalid=true but no FieldError: aria-describedby should not include errorId
    const input1 = screen.getByLabelText("email")
    expect(input1.getAttribute("aria-describedby") ?? "").not.toMatch(
      /-error/
    )

    rerender(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
        <FieldError>Required</FieldError>
      </Field>
    )
    const input2 = screen.getByLabelText("email")
    const errorEl = screen.getByText("Required")
    expect(errorEl.id).toMatch(/-error$/)
    expect(input2.getAttribute("aria-describedby") ?? "").toContain(errorEl.id)
  })

  it("does not wire the error id when not invalid even if FieldError renders", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input aria-label="email" />
        </FieldControl>
        <FieldError>Required</FieldError>
      </Field>
    )
    const input = screen.getByLabelText("email")
    expect(input.getAttribute("aria-describedby") ?? "").not.toMatch(/-error/)
  })

  it("merges Field-supplied aria-describedby with caller-supplied aria-describedby", () => {
    render(
      <Field>
        <FieldDescription>desc</FieldDescription>
        <FieldControl>
          <Input aria-label="email" aria-describedby="external-help" />
        </FieldControl>
      </Field>
    )
    const input = screen.getByLabelText("email")
    const describedBy = input.getAttribute("aria-describedby") ?? ""
    expect(describedBy).toContain("external-help")
    expect(describedBy).toMatch(/-description/)
  })

  it("merges custom className with the base Field class", () => {
    render(<Field data-testid="root" className="custom" />)
    const root = screen.getByTestId("root")
    expect(root.className).toContain("lead-Field")
    expect(root.className).toContain("custom")
  })
})

describe("FieldGroup", () => {
  it("renders as a div with role=group by default", () => {
    render(
      <FieldGroup data-testid="group">
        <span>x</span>
      </FieldGroup>
    )
    const group = screen.getByTestId("group")
    expect(group.tagName).toBe("DIV")
    expect(group).toHaveAttribute("role", "group")
    expect(group.className).toContain("lead-FieldGroup")
  })

  it("supports an explicit role override", () => {
    render(<FieldGroup role="radiogroup" data-testid="group" />)
    expect(screen.getByTestId("group")).toHaveAttribute("role", "radiogroup")
  })

  it("merges custom className", () => {
    render(<FieldGroup data-testid="group" className="custom" />)
    const group = screen.getByTestId("group")
    expect(group.className).toContain("lead-FieldGroup")
    expect(group.className).toContain("custom")
  })
})

describe("FieldDescription", () => {
  it("uses the Field context id when not given an explicit one", () => {
    render(
      <Field id="f">
        <FieldDescription>help</FieldDescription>
      </Field>
    )
    expect(screen.getByText("help").id).toBe("f-description")
  })

  it("respects an explicit id override", () => {
    render(
      <Field id="f">
        <FieldDescription id="custom">help</FieldDescription>
      </Field>
    )
    expect(screen.getByText("help").id).toBe("custom")
  })

  it("reflects the Field disabled state via data-disabled", () => {
    render(
      <Field disabled>
        <FieldDescription>help</FieldDescription>
      </Field>
    )
    expect(screen.getByText("help")).toHaveAttribute("data-disabled", "true")
  })
})

describe("FieldError", () => {
  it("renders with role=alert and uses the Field context id", () => {
    render(
      <Field id="f" invalid>
        <FieldError>Required</FieldError>
      </Field>
    )
    const err = screen.getByRole("alert")
    expect(err).toHaveTextContent("Required")
    expect(err.id).toBe("f-error")
  })

  it("returns null when given no children", () => {
    render(
      <Field id="f" invalid>
        <FieldError />
      </Field>
    )
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("respects an explicit id override", () => {
    render(
      <Field id="f" invalid>
        <FieldError id="custom">Bad</FieldError>
      </Field>
    )
    expect(screen.getByRole("alert").id).toBe("custom")
  })
})

describe("FieldControl", () => {
  it("does not override an explicit child id", () => {
    render(
      <Field id="ctx">
        <FieldControl>
          <Input id="my-id" aria-label="email" />
        </FieldControl>
      </Field>
    )
    expect(screen.getByLabelText("email")).toHaveAttribute("id", "my-id")
  })

  it("does not override an explicit child disabled prop", () => {
    render(
      <Field>
        <FieldControl>
          <Input disabled aria-label="email" />
        </FieldControl>
      </Field>
    )
    expect(screen.getByLabelText("email")).toBeDisabled()
  })
})
