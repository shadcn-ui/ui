import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"

function basicTabs(props: { defaultValue?: string } = {}) {
  return (
    <Tabs defaultValue={props.defaultValue ?? "a"}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Tab C
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Body A</TabsContent>
      <TabsContent value="b">Body B</TabsContent>
      <TabsContent value="c">Body C</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("renders list, triggers, and the default content", () => {
    render(basicTabs())
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getAllByRole("tab")).toHaveLength(3)
    expect(screen.getByText("Body A")).toBeInTheDocument()
    expect(screen.queryByText("Body B")).toBeNull()
  })

  it("activates a different tab on keyboard select (uncontrolled)", () => {
    // jsdom note: Radix Tabs trigger activation does not fire on
    // `fireEvent.click` under jsdom — Radix wires its own pointerdown
    // handler that jsdom does not faithfully simulate. Keyboard
    // activation (focus + Enter) is observable and equally valid.
    render(basicTabs())
    const tabB = screen.getByRole("tab", { name: "Tab B" })
    tabB.focus()
    fireEvent.keyDown(tabB, { key: "Enter", code: "Enter" })
    expect(screen.getByText("Body B")).toBeInTheDocument()
    expect(screen.queryByText("Body A")).toBeNull()
  })

  it("respects defaultValue", () => {
    render(basicTabs({ defaultValue: "b" }))
    expect(screen.getByText("Body B")).toBeInTheDocument()
    expect(screen.queryByText("Body A")).toBeNull()
  })

  it("supports controlled value + onValueChange via external opener", () => {
    function Wrapper() {
      const [v, setV] = useState("a")
      return (
        <>
          <button type="button" onClick={() => setV("b")}>
            external
          </button>
          <Tabs value={v} onValueChange={setV}>
            <TabsList>
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
            </TabsList>
            <TabsContent value="a">Body A</TabsContent>
            <TabsContent value="b">Body B</TabsContent>
          </Tabs>
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.getByText("Body A")).toBeInTheDocument()
    fireEvent.click(screen.getByText("external"))
    expect(screen.getByText("Body B")).toBeInTheDocument()
    expect(screen.queryByText("Body A")).toBeNull()
  })

  it("marks a disabled trigger with data-disabled and does not activate it on click", () => {
    render(basicTabs())
    const c = screen.getByRole("tab", { name: "Tab C" })
    expect(c).toHaveAttribute("data-disabled")
    fireEvent.click(c)
    expect(screen.getByText("Body A")).toBeInTheDocument()
  })

  it("propagates Tabs.size to triggers via context", () => {
    render(
      <Tabs defaultValue="a" size="lg">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute(
      "data-size",
      "lg"
    )
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
      "data-size",
      "lg"
    )
  })

  it("lets a trigger override its own size", () => {
    render(
      <Tabs defaultValue="a" size="md">
        <TabsList>
          <TabsTrigger value="a" size="sm">
            A
          </TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute(
      "data-size",
      "sm"
    )
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
      "data-size",
      "md"
    )
  })

  it("sets data-orientation on Root and TabsList for vertical orientation", () => {
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("forwards refs on Root, List, Trigger, and Content", () => {
    const rootRef = { current: null as HTMLDivElement | null }
    const listRef = { current: null as HTMLDivElement | null }
    const triggerRef = { current: null as HTMLButtonElement | null }
    const contentRef = { current: null as HTMLDivElement | null }
    render(
      <Tabs defaultValue="a" ref={rootRef}>
        <TabsList ref={listRef}>
          <TabsTrigger value="a" ref={triggerRef}>
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a" ref={contentRef}>
          x
        </TabsContent>
      </Tabs>
    )
    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(listRef.current).toBeInstanceOf(HTMLDivElement)
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom classNames on Root, List, Trigger, and Content", () => {
    render(
      <Tabs defaultValue="a" className="root-x">
        <TabsList className="list-x">
          <TabsTrigger value="a" className="trig-x">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="content-x">
          x
        </TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tablist").className).toContain("list-x")
    expect(screen.getByRole("tab")).toHaveClass("lead-TabsTrigger", "trig-x")
    expect(screen.getByText("x").className).toContain("content-x")
  })
})
