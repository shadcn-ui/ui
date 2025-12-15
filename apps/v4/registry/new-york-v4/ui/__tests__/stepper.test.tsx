/**
 * @vitest-environment jsdom
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StepConnector } from "@/registry/new-york-v4/ui/step-connector"
import { StepIndicator } from "@/registry/new-york-v4/ui/step-indicator"
import { StepLabel } from "@/registry/new-york-v4/ui/step-label"
import { Stepper } from "@/registry/new-york-v4/ui/stepper"
import { StepperItem } from "@/registry/new-york-v4/ui/stepper-item"

describe("Stepper", () => {
  it("renders basic stepper with correct number of steps", () => {
    render(
      <Stepper currentStep={0}>
        <StepperItem title="Step 1" />
        <StepperItem title="Step 2" />
        <StepperItem title="Step 3" />
      </Stepper>
    )

    const list = screen.getByRole("list")
    expect(list).toBeInTheDocument()

    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(3)
  })

  it("applies horizontal orientation by default", () => {
    render(
      <Stepper currentStep={0}>
        <StepperItem title="Step 1" />
        <StepperItem title="Step 2" />
      </Stepper>
    )

    const stepper = screen.getByRole("list")
    expect(stepper).toHaveAttribute("data-orientation", "horizontal")
  })

  it("applies vertical orientation when specified", () => {
    render(
      <Stepper currentStep={0} orientation="vertical">
        <StepperItem title="Step 1" />
        <StepperItem title="Step 2" />
      </Stepper>
    )

    const stepper = screen.getByRole("list")
    expect(stepper).toHaveAttribute("data-orientation", "vertical")
  })

  it("marks the active step with aria-current", () => {
    render(
      <Stepper currentStep={1}>
        <StepperItem title="Step 1" />
        <StepperItem title="Step 2" />
        <StepperItem title="Step 3" />
      </Stepper>
    )

    const items = screen.getAllByRole("listitem")

    // First step should not have aria-current
    expect(items[0]).not.toHaveAttribute("aria-current")
    // Second step (index 1) should be active
    expect(items[1]).toHaveAttribute("aria-current", "step")
    // Third step should not have aria-current
    expect(items[2]).not.toHaveAttribute("aria-current")
  })

  it("sets correct data-state on steps", () => {
    render(
      <Stepper currentStep={1}>
        <StepperItem title="Step 1" />
        <StepperItem title="Step 2" />
        <StepperItem title="Step 3" />
      </Stepper>
    )

    const items = screen.getAllByRole("listitem")

    expect(items[0]).toHaveAttribute("data-state", "completed")
    expect(items[1]).toHaveAttribute("data-state", "active")
    expect(items[2]).toHaveAttribute("data-state", "upcoming")
  })

  it("renders step titles and descriptions", () => {
    render(
      <Stepper currentStep={0}>
        <StepperItem title="First Step" description="First description" />
        <StepperItem title="Second Step" description="Second description" />
      </Stepper>
    )

    expect(screen.getByText("First Step")).toBeInTheDocument()
    expect(screen.getByText("First description")).toBeInTheDocument()
    expect(screen.getByText("Second Step")).toBeInTheDocument()
    expect(screen.getByText("Second description")).toBeInTheDocument()
  })

  it("renders custom icons when provided", () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />

    render(
      <Stepper currentStep={0}>
        <StepperItem title="Step 1" icon={<CustomIcon />} />
        <StepperItem title="Step 2" />
      </Stepper>
    )

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })
})

describe("StepIndicator", () => {
  it("renders step number for upcoming steps", () => {
    render(
      <StepIndicator
        index={2}
        isCompleted={false}
        isActive={false}
        isUpcoming={true}
      />
    )

    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders check icon for completed steps", () => {
    const { container } = render(
      <StepIndicator
        index={0}
        isCompleted={true}
        isActive={false}
        isUpcoming={false}
      />
    )

    // Lucide Check icon renders as an SVG
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("has correct data-state attribute", () => {
    const { rerender, container } = render(
      <StepIndicator
        index={0}
        isCompleted={true}
        isActive={false}
        isUpcoming={false}
      />
    )

    expect(container.firstChild).toHaveAttribute("data-state", "completed")

    rerender(
      <StepIndicator
        index={0}
        isCompleted={false}
        isActive={true}
        isUpcoming={false}
      />
    )

    expect(container.firstChild).toHaveAttribute("data-state", "active")

    rerender(
      <StepIndicator
        index={0}
        isCompleted={false}
        isActive={false}
        isUpcoming={true}
      />
    )

    expect(container.firstChild).toHaveAttribute("data-state", "upcoming")
  })
})

describe("StepLabel", () => {
  it("renders title and description", () => {
    render(
      <StepLabel
        title="Test Title"
        description="Test Description"
        isActive={false}
        isCompleted={false}
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("renders only title when description is not provided", () => {
    render(
      <StepLabel
        title="Test Title"
        isActive={false}
        isCompleted={false}
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument()
  })
})

describe("StepConnector", () => {
  it("renders with correct orientation", () => {
    const { container, rerender } = render(
      <StepConnector isCompleted={false} orientation="horizontal" />
    )

    expect(container.firstChild).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )

    rerender(<StepConnector isCompleted={false} orientation="vertical" />)

    expect(container.firstChild).toHaveAttribute("data-orientation", "vertical")
  })

  it("has aria-hidden attribute for accessibility", () => {
    const { container } = render(
      <StepConnector isCompleted={false} orientation="horizontal" />
    )

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true")
  })

  it("has correct data-state based on completion", () => {
    const { container, rerender } = render(
      <StepConnector isCompleted={false} orientation="horizontal" />
    )

    expect(container.firstChild).toHaveAttribute("data-state", "pending")

    rerender(<StepConnector isCompleted={true} orientation="horizontal" />)

    expect(container.firstChild).toHaveAttribute("data-state", "completed")
  })
})
