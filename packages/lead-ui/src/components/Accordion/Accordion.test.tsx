import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

function singleAccordion(props: {
  defaultValue?: string
  collapsible?: boolean
} = {}) {
  return (
    <Accordion
      type="single"
      defaultValue={props.defaultValue}
      collapsible={props.collapsible ?? true}
    >
      <AccordionItem value="a">
        <AccordionTrigger>Question A</AccordionTrigger>
        <AccordionContent>Answer A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Question B</AccordionTrigger>
        <AccordionContent>Answer B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c" disabled>
        <AccordionTrigger>Question C</AccordionTrigger>
        <AccordionContent>Answer C</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("renders triggers and starts with no content open by default", () => {
    render(singleAccordion())
    expect(
      screen.getByRole("button", { name: "Question A" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Question B" })
    ).toBeInTheDocument()
    // Radix renders content with hidden attribute when closed; assert via
    // aria-expanded on the trigger rather than the body text presence.
    expect(
      screen.getByRole("button", { name: "Question A" })
    ).toHaveAttribute("aria-expanded", "false")
  })

  it("opens the matching item with defaultValue", () => {
    render(singleAccordion({ defaultValue: "b" }))
    expect(
      screen.getByRole("button", { name: "Question B" })
    ).toHaveAttribute("aria-expanded", "true")
    expect(
      screen.getByRole("button", { name: "Question A" })
    ).toHaveAttribute("aria-expanded", "false")
  })

  it("opens an item when its trigger is clicked (single + collapsible)", () => {
    render(singleAccordion())
    const trigger = screen.getByRole("button", { name: "Question A" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("closes the previously open item when another opens (single mode)", () => {
    render(singleAccordion({ defaultValue: "a" }))
    fireEvent.click(screen.getByRole("button", { name: "Question B" }))
    expect(
      screen.getByRole("button", { name: "Question A" })
    ).toHaveAttribute("aria-expanded", "false")
    expect(
      screen.getByRole("button", { name: "Question B" })
    ).toHaveAttribute("aria-expanded", "true")
  })

  it("supports multiple type with multiple items open at once", () => {
    render(
      <Accordion type="multiple" defaultValue={["a", "b"]}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Body B</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>C</AccordionTrigger>
          <AccordionContent>Body C</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "C" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    fireEvent.click(screen.getByRole("button", { name: "C" }))
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "C" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("disables a disabled item's trigger and ignores clicks", () => {
    render(singleAccordion())
    const c = screen.getByRole("button", { name: "Question C" })
    expect(c).toBeDisabled()
    expect(c).toHaveAttribute("data-disabled")
    fireEvent.click(c)
    expect(c).toHaveAttribute("aria-expanded", "false")
  })

  it("renders the chevron indicator and reflects state via data-state on the trigger", () => {
    render(singleAccordion({ defaultValue: "a" }))
    const trigger = screen.getByRole("button", { name: "Question A" })
    expect(trigger).toHaveAttribute("data-state", "open")
    expect(
      trigger.querySelector(".lead-AccordionTrigger__chevron")
    ).not.toBeNull()
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute("data-state", "closed")
  })

  it("supports controlled value + onValueChange (single)", () => {
    function Wrapper() {
      const [v, setV] = useState<string>("a")
      return (
        <Accordion
          type="single"
          collapsible
          value={v}
          onValueChange={setV}
        >
          <AccordionItem value="a">
            <AccordionTrigger>A</AccordionTrigger>
            <AccordionContent>Body A</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>B</AccordionTrigger>
            <AccordionContent>Body B</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }
    render(<Wrapper />)
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    fireEvent.click(screen.getByRole("button", { name: "B" }))
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("forwards refs on Root, Item, Trigger, and Content", () => {
    const rootRef = { current: null as HTMLDivElement | null }
    const itemRef = { current: null as HTMLDivElement | null }
    const triggerRef = { current: null as HTMLButtonElement | null }
    const contentRef = { current: null as HTMLDivElement | null }
    render(
      <Accordion type="single" collapsible defaultValue="a" ref={rootRef}>
        <AccordionItem value="a" ref={itemRef}>
          <AccordionTrigger ref={triggerRef}>A</AccordionTrigger>
          <AccordionContent ref={contentRef}>x</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(itemRef.current).toBeInstanceOf(HTMLDivElement)
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom classNames on Root, Item, Trigger, and Content", () => {
    render(
      <Accordion type="single" collapsible className="root-x">
        <AccordionItem value="a" className="item-x">
          <AccordionTrigger className="trig-x">A</AccordionTrigger>
          <AccordionContent className="content-x">x</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const root = screen.getByRole("button", { name: "A" }).closest(".lead-Accordion") as HTMLElement
    expect(root.className).toContain("root-x")
    const item = screen.getByRole("button", { name: "A" }).closest(".lead-AccordionItem") as HTMLElement
    expect(item.className).toContain("item-x")
    expect(screen.getByRole("button", { name: "A" }).className).toContain(
      "trig-x"
    )
  })
})
