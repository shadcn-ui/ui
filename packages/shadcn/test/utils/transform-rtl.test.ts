import { describe, expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"
import { applyRtlMapping } from "../../src/utils/transformers/transform-rtl"

describe("applyRtlMapping", () => {
  test("transforms margin classes", () => {
    expect(applyRtlMapping("ml-2")).toBe("ms-2")
    expect(applyRtlMapping("mr-4")).toBe("me-4")
    expect(applyRtlMapping("-ml-2")).toBe("-ms-2")
    expect(applyRtlMapping("-mr-4")).toBe("-me-4")
  })

  test("transforms padding classes", () => {
    expect(applyRtlMapping("pl-2")).toBe("ps-2")
    expect(applyRtlMapping("pr-4")).toBe("pe-4")
  })

  test("transforms positioning classes", () => {
    expect(applyRtlMapping("left-0")).toBe("start-0")
    expect(applyRtlMapping("right-0")).toBe("end-0")
    expect(applyRtlMapping("-left-2")).toBe("-start-2")
    expect(applyRtlMapping("-right-2")).toBe("-end-2")
  })

  test("transforms inset classes", () => {
    expect(applyRtlMapping("inset-l-0")).toBe("inset-inline-start-0")
    expect(applyRtlMapping("inset-r-0")).toBe("inset-inline-end-0")
  })

  test("transforms border classes", () => {
    expect(applyRtlMapping("border-l")).toBe("border-s")
    expect(applyRtlMapping("border-r")).toBe("border-e")
    expect(applyRtlMapping("border-l-2")).toBe("border-s-2")
    expect(applyRtlMapping("border-r-2")).toBe("border-e-2")
  })

  test("transforms rounded corner classes", () => {
    expect(applyRtlMapping("rounded-l-md")).toBe("rounded-s-md")
    expect(applyRtlMapping("rounded-r-md")).toBe("rounded-e-md")
    expect(applyRtlMapping("rounded-tl-md")).toBe("rounded-ss-md")
    expect(applyRtlMapping("rounded-tr-md")).toBe("rounded-se-md")
    expect(applyRtlMapping("rounded-bl-md")).toBe("rounded-es-md")
    expect(applyRtlMapping("rounded-br-md")).toBe("rounded-ee-md")
  })

  test("transforms text alignment classes", () => {
    expect(applyRtlMapping("text-left")).toBe("text-start")
    expect(applyRtlMapping("text-right")).toBe("text-end")
  })

  test("transforms scroll margin/padding classes", () => {
    expect(applyRtlMapping("scroll-ml-2")).toBe("scroll-ms-2")
    expect(applyRtlMapping("scroll-mr-2")).toBe("scroll-me-2")
    expect(applyRtlMapping("scroll-pl-2")).toBe("scroll-ps-2")
    expect(applyRtlMapping("scroll-pr-2")).toBe("scroll-pe-2")
  })

  test("transforms float classes", () => {
    expect(applyRtlMapping("float-left")).toBe("float-start")
    expect(applyRtlMapping("float-right")).toBe("float-end")
  })

  test("transforms clear classes", () => {
    expect(applyRtlMapping("clear-left")).toBe("clear-start")
    expect(applyRtlMapping("clear-right")).toBe("clear-end")
  })

  test("transforms origin classes", () => {
    expect(applyRtlMapping("origin-left")).toBe("origin-start")
    expect(applyRtlMapping("origin-right")).toBe("origin-end")
    expect(applyRtlMapping("origin-top-left")).toBe("origin-top-start")
    expect(applyRtlMapping("origin-top-right")).toBe("origin-top-end")
    expect(applyRtlMapping("origin-bottom-left")).toBe("origin-bottom-start")
    expect(applyRtlMapping("origin-bottom-right")).toBe("origin-bottom-end")
  })

  test("preserves variant prefixes", () => {
    expect(applyRtlMapping("hover:ml-2")).toBe("hover:ms-2")
    expect(applyRtlMapping("focus:pl-4")).toBe("focus:ps-4")
    expect(applyRtlMapping("sm:md:ml-2")).toBe("sm:md:ms-2")
  })

  test("preserves arbitrary values", () => {
    expect(applyRtlMapping("ml-[10px]")).toBe("ms-[10px]")
    expect(applyRtlMapping("left-[50%]")).toBe("start-[50%]")
  })

  test("preserves modifiers", () => {
    expect(applyRtlMapping("ml-2/50")).toBe("ms-2/50")
  })

  test("handles multiple classes", () => {
    expect(applyRtlMapping("ml-2 mr-4 pl-2 pr-4")).toBe("ms-2 me-4 ps-2 pe-4")
  })

  test("adds rtl: variant for animation classes", () => {
    expect(applyRtlMapping("slide-in-from-left-2")).toBe(
      "slide-in-from-left-2 rtl:slide-in-from-right-2"
    )
    expect(applyRtlMapping("slide-in-from-right-2")).toBe(
      "slide-in-from-right-2 rtl:slide-in-from-left-2"
    )
    expect(applyRtlMapping("slide-out-to-left-2")).toBe(
      "slide-out-to-left-2 rtl:slide-out-to-right-2"
    )
    expect(applyRtlMapping("slide-out-to-right-2")).toBe(
      "slide-out-to-right-2 rtl:slide-out-to-left-2"
    )
  })

  test("handles animation classes with variants", () => {
    expect(applyRtlMapping("data-[side=left]:slide-in-from-right-2")).toBe(
      "data-[side=left]:slide-in-from-right-2 rtl:data-[side=left]:slide-in-from-left-2"
    )
  })

  test("does not transform unrelated classes", () => {
    expect(applyRtlMapping("bg-red-500")).toBe("bg-red-500")
    expect(applyRtlMapping("flex")).toBe("flex")
    expect(applyRtlMapping("mx-auto")).toBe("mx-auto")
    expect(applyRtlMapping("px-4")).toBe("px-4")
  })
})

describe("transformRtl", () => {
  test("transforms className string literals when direction is rtl", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className="ml-2 mr-4 text-left">foo</div>
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("text-start")
  })

  test("does not transform when direction is ltr", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className="ml-2 mr-4 text-left">foo</div>
}
`,
      config: {
        direction: "ltr",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain("ml-2")
    expect(result).toContain("mr-4")
    expect(result).toContain("text-left")
  })

  test("does not transform when direction is not specified", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className="ml-2 mr-4 text-left">foo</div>
}
`,
      config: {
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain("ml-2")
    expect(result).toContain("mr-4")
    expect(result).toContain("text-left")
  })

  test("transforms cn() function arguments", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className={cn("ml-2 mr-4", true && "pl-2")}>foo</div>
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("ps-2")
  })

  test("transforms cva base classes", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import { cva } from "class-variance-authority"
const buttonVariants = cva("ml-2 mr-4", {
  variants: {
    size: {
      default: "pl-4 pr-4",
      sm: "pl-2 pr-2",
    },
  },
})
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("ps-4")
    expect(result).toContain("pe-4")
    expect(result).toContain("ps-2")
    expect(result).toContain("pe-2")
  })

  test("transforms side prop values", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <Popover side="right" />
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain('side="left"')
    expect(result).not.toContain('side="right"')
  })

  test("transforms align prop values", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <Dropdown align="left" />
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain('align="right"')
    expect(result).not.toContain('align="left"')
  })

  test("transforms position prop values", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <Sheet position="left" />
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain('position="right"')
    expect(result).not.toContain('position="left"')
  })

  test("does not transform non-directional prop values", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <Popover side="top" align="center" />
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain('side="top"')
    expect(result).toContain('align="center"')
  })

  test("transforms default parameter values", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: Props) {
  return <div />
}
`,
      config: {
        direction: "rtl",
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })

    expect(result).toContain('side = "left"')
    expect(result).not.toContain('side = "right"')
    // align = "start" should remain unchanged (not a directional value).
    expect(result).toContain('align = "start"')
  })
})
