import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card"

describe("Card", () => {
  it("renders a div with default attributes", () => {
    render(<Card data-testid="root">contents</Card>)
    const card = screen.getByTestId("root")
    expect(card.tagName).toBe("DIV")
    expect(card).toHaveAttribute("data-padding", "md")
    expect(card).toHaveAttribute("data-variant", "default")
    expect(card.className).toContain("lead-Card")
  })

  it.each(["none", "sm", "md", "lg"] as const)("supports %s padding", (p) => {
    render(<Card data-testid="root" padding={p} />)
    expect(screen.getByTestId("root")).toHaveAttribute("data-padding", p)
  })

  it.each(["default", "muted", "outline"] as const)(
    "supports %s variant",
    (v) => {
      render(<Card data-testid="root" variant={v} />)
      expect(screen.getByTestId("root")).toHaveAttribute("data-variant", v)
    }
  )

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Card
        data-testid="root"
        padding="md"
        variant="default"
        data-padding="hacked"
        data-variant="hacked"
      />
    )
    const card = screen.getByTestId("root")
    expect(card).toHaveAttribute("data-padding", "md")
    expect(card).toHaveAttribute("data-variant", "default")
  })

  it("forwards ref to the underlying div", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Card ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom className with the base class", () => {
    render(<Card data-testid="root" className="custom" />)
    const card = screen.getByTestId("root")
    expect(card.className).toContain("lead-Card")
    expect(card.className).toContain("custom")
  })

  it("passes through normal attributes like aria-label", () => {
    render(<Card data-testid="root" aria-label="account-card" />)
    expect(screen.getByTestId("root")).toHaveAttribute(
      "aria-label",
      "account-card"
    )
  })
})

describe("CardHeader", () => {
  it("renders a div with the base class", () => {
    render(<CardHeader data-testid="h" />)
    const h = screen.getByTestId("h")
    expect(h.tagName).toBe("DIV")
    expect(h.className).toContain("lead-CardHeader")
  })

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardHeader ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("merges custom className", () => {
    render(<CardHeader data-testid="h" className="custom" />)
    expect(screen.getByTestId("h").className).toContain("custom")
  })
})

describe("CardTitle", () => {
  it("renders an h3 by default", () => {
    render(<CardTitle>Title</CardTitle>)
    const h = screen.getByRole("heading", { name: "Title" })
    expect(h.tagName).toBe("H3")
    expect(h.className).toContain("lead-CardTitle")
  })

  it.each([1, 2, 4, 5, 6] as const)("renders an h%i when level set", (lvl) => {
    render(<CardTitle level={lvl}>Title</CardTitle>)
    const h = screen.getByRole("heading", { name: "Title" })
    expect(h.tagName).toBe(`H${lvl}`)
  })

  it("forwards ref to the heading element", () => {
    const ref = { current: null as HTMLHeadingElement | null }
    render(<CardTitle ref={ref}>Title</CardTitle>)
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe("CardDescription", () => {
  it("renders a paragraph with the base class", () => {
    render(<CardDescription>desc</CardDescription>)
    const p = screen.getByText("desc")
    expect(p.tagName).toBe("P")
    expect(p.className).toContain("lead-CardDescription")
  })

  it("forwards ref to the paragraph", () => {
    const ref = { current: null as HTMLParagraphElement | null }
    render(<CardDescription ref={ref}>x</CardDescription>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })
})

describe("CardContent", () => {
  it("renders a div with the base class", () => {
    render(<CardContent data-testid="c" />)
    const c = screen.getByTestId("c")
    expect(c.tagName).toBe("DIV")
    expect(c.className).toContain("lead-CardContent")
  })

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardContent ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("CardFooter", () => {
  it("renders a div with default alignment", () => {
    render(<CardFooter data-testid="f" />)
    const f = screen.getByTestId("f")
    expect(f).toHaveAttribute("data-align", "start")
    expect(f.className).toContain("lead-CardFooter")
  })

  it.each(["start", "end", "between"] as const)("supports %s align", (a) => {
    render(<CardFooter data-testid="f" align={a} />)
    expect(screen.getByTestId("f")).toHaveAttribute("data-align", a)
  })

  it("does not let user-supplied data-align override internal state", () => {
    render(
      <CardFooter
        data-testid="f"
        align="end"
        data-align="hacked"
      />
    )
    expect(screen.getByTestId("f")).toHaveAttribute("data-align", "end")
  })

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardFooter ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("Card composition", () => {
  it("renders semantic structure end-to-end", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>body</p>
        </CardContent>
        <CardFooter>
          <span>actions</span>
        </CardFooter>
      </Card>
    )
    expect(
      screen.getByRole("heading", { name: "Profile" })
    ).toBeInTheDocument()
    expect(screen.getByText("Manage your account.")).toBeInTheDocument()
    expect(screen.getByText("body")).toBeInTheDocument()
    expect(screen.getByText("actions")).toBeInTheDocument()
  })
})
