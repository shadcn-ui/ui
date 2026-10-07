import type { Config } from "@/src/utils/get-config"
import ts from "typescript"
import { describe, expect, it } from "vitest"

import { transform } from "."
import {
  applyRtlMapping,
  transformDirection,
  transformRtl,
} from "./transform-rtl"

const rtlConfig = {
  rtl: true,
  tailwind: {
    baseColor: "neutral",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
} as Config

// Runs only transformRtl through the string seam.
function transformWithRtl(raw: string) {
  return transform({ filename: "test.tsx", raw, config: rtlConfig }, [
    transformRtl,
  ])
}

describe("applyRtlMapping", () => {
  it("transforms margin classes", () => {
    expect(applyRtlMapping("ml-2")).toBe("ms-2")
    expect(applyRtlMapping("mr-4")).toBe("me-4")
    expect(applyRtlMapping("-ml-2")).toBe("-ms-2")
    expect(applyRtlMapping("-mr-4")).toBe("-me-4")
  })

  it("transforms padding classes", () => {
    expect(applyRtlMapping("pl-2")).toBe("ps-2")
    expect(applyRtlMapping("pr-4")).toBe("pe-4")
  })

  it("transforms positioning classes", () => {
    expect(applyRtlMapping("left-0")).toBe("start-0")
    expect(applyRtlMapping("right-0")).toBe("end-0")
    expect(applyRtlMapping("right-1")).toBe("end-1")
    expect(applyRtlMapping("-left-2")).toBe("-start-2")
    expect(applyRtlMapping("-right-2")).toBe("-end-2")
  })

  it("transforms inset classes", () => {
    expect(applyRtlMapping("inset-l-0")).toBe("inset-inline-start-0")
    expect(applyRtlMapping("inset-r-0")).toBe("inset-inline-end-0")
  })

  it("transforms border classes", () => {
    expect(applyRtlMapping("border-l")).toBe("border-s")
    expect(applyRtlMapping("border-r")).toBe("border-e")
    expect(applyRtlMapping("border-l-2")).toBe("border-s-2")
    expect(applyRtlMapping("border-r-2")).toBe("border-e-2")
  })

  it("transforms rounded corner classes", () => {
    expect(applyRtlMapping("rounded-l-md")).toBe("rounded-s-md")
    expect(applyRtlMapping("rounded-r-md")).toBe("rounded-e-md")
    expect(applyRtlMapping("rounded-tl-md")).toBe("rounded-ss-md")
    expect(applyRtlMapping("rounded-tr-md")).toBe("rounded-se-md")
    expect(applyRtlMapping("rounded-bl-md")).toBe("rounded-es-md")
    expect(applyRtlMapping("rounded-br-md")).toBe("rounded-ee-md")
  })

  it("transforms text alignment classes", () => {
    expect(applyRtlMapping("text-left")).toBe("text-start")
    expect(applyRtlMapping("text-right")).toBe("text-end")
  })

  it("transforms scroll margin/padding classes", () => {
    expect(applyRtlMapping("scroll-ml-2")).toBe("scroll-ms-2")
    expect(applyRtlMapping("scroll-mr-2")).toBe("scroll-me-2")
    expect(applyRtlMapping("scroll-pl-2")).toBe("scroll-ps-2")
    expect(applyRtlMapping("scroll-pr-2")).toBe("scroll-pe-2")
  })

  it("transforms float classes", () => {
    expect(applyRtlMapping("float-left")).toBe("float-start")
    expect(applyRtlMapping("float-right")).toBe("float-end")
  })

  it("transforms clear classes", () => {
    expect(applyRtlMapping("clear-left")).toBe("clear-start")
    expect(applyRtlMapping("clear-right")).toBe("clear-end")
  })

  it("transforms origin classes", () => {
    expect(applyRtlMapping("origin-left")).toBe("origin-start")
    expect(applyRtlMapping("origin-right")).toBe("origin-end")
    expect(applyRtlMapping("origin-top-left")).toBe("origin-top-start")
    expect(applyRtlMapping("origin-top-right")).toBe("origin-top-end")
    expect(applyRtlMapping("origin-bottom-left")).toBe("origin-bottom-start")
    expect(applyRtlMapping("origin-bottom-right")).toBe("origin-bottom-end")
  })

  it("preserves variant prefixes", () => {
    expect(applyRtlMapping("hover:ml-2")).toBe("hover:ms-2")
    expect(applyRtlMapping("focus:pl-4")).toBe("focus:ps-4")
    expect(applyRtlMapping("sm:md:ml-2")).toBe("sm:md:ms-2")
  })

  it("handles named group selectors with data attributes", () => {
    expect(
      applyRtlMapping(
        "sm:group-data-[size=default]/alert-dialog-content:text-left"
      )
    ).toBe("sm:group-data-[size=default]/alert-dialog-content:text-start")
  })

  it("preserves arbitrary values", () => {
    expect(applyRtlMapping("ml-[10px]")).toBe("ms-[10px]")
    expect(applyRtlMapping("left-[50%]")).toBe("start-[50%]")
  })

  it("preserves modifiers", () => {
    expect(applyRtlMapping("ml-2/50")).toBe("ms-2/50")
  })

  it("handles multiple classes", () => {
    expect(applyRtlMapping("ml-2 mr-4 pl-2 pr-4")).toBe("ms-2 me-4 ps-2 pe-4")
  })

  it("transforms slide animations inside logical side variants", () => {
    expect(
      applyRtlMapping("data-[side=inline-start]:slide-in-from-right-2")
    ).toBe("data-[side=inline-start]:slide-in-from-end-2")
    expect(
      applyRtlMapping("data-[side=inline-start]:slide-out-to-right-2")
    ).toBe("data-[side=inline-start]:slide-out-to-end-2")
    expect(applyRtlMapping("data-[side=inline-end]:slide-in-from-left-2")).toBe(
      "data-[side=inline-end]:slide-in-from-start-2"
    )
    expect(applyRtlMapping("data-[side=inline-end]:slide-out-to-left-2")).toBe(
      "data-[side=inline-end]:slide-out-to-start-2"
    )
  })

  it("does not transform slide animations inside physical side variants", () => {
    // Physical side variants should keep physical slide directions.
    expect(applyRtlMapping("data-[side=left]:slide-in-from-right-2")).toBe(
      "data-[side=left]:slide-in-from-right-2"
    )
    expect(applyRtlMapping("data-[side=right]:slide-in-from-left-2")).toBe(
      "data-[side=right]:slide-in-from-left-2"
    )
  })

  it("does not transform unrelated classes", () => {
    expect(applyRtlMapping("bg-red-500")).toBe("bg-red-500")
    expect(applyRtlMapping("flex")).toBe("flex")
    expect(applyRtlMapping("mx-auto")).toBe("mx-auto")
    expect(applyRtlMapping("px-4")).toBe("px-4")
  })

  it("does not transform classes that partially match RTL mappings", () => {
    // border-r should become border-e, but border-ring should stay as-is.
    expect(applyRtlMapping("border-ring")).toBe("border-ring")
    expect(applyRtlMapping("border-ring/50")).toBe("border-ring/50")
    // border-l should become border-s, but border-lime-500 should stay as-is.
    expect(applyRtlMapping("border-lime-500")).toBe("border-lime-500")
    // text-left should become text-start, but text-left-foo should stay as-is.
    expect(applyRtlMapping("text-left")).toBe("text-start")
    // text-right should become text-end, but text-right-foo should stay as-is if it existed.
    expect(applyRtlMapping("text-right")).toBe("text-end")
    // float-left should become float-start, but float-leftish (hypothetical) should stay.
    expect(applyRtlMapping("float-left")).toBe("float-start")
    // origin-left should become origin-start, but origin-leftover (hypothetical) should stay.
    expect(applyRtlMapping("origin-left")).toBe("origin-start")
    // origin-top-left should become origin-top-start.
    expect(applyRtlMapping("origin-top-left")).toBe("origin-top-start")
    // scroll-mr- should become scroll-me-, but scroll-m-4 should stay as-is.
    expect(applyRtlMapping("scroll-m-4")).toBe("scroll-m-4")
  })

  it("adds rtl: variant for translate-x classes", () => {
    expect(applyRtlMapping("-translate-x-1/2")).toBe(
      "-translate-x-1/2 rtl:translate-x-1/2"
    )
    expect(applyRtlMapping("translate-x-full")).toBe(
      "translate-x-full rtl:-translate-x-full"
    )
    expect(applyRtlMapping("-translate-x-px")).toBe(
      "-translate-x-px rtl:translate-x-px"
    )
  })

  it("handles translate-x with variant prefixes", () => {
    expect(applyRtlMapping("after:-translate-x-1/2")).toBe(
      "after:-translate-x-1/2 rtl:after:translate-x-1/2"
    )
    expect(applyRtlMapping("group-hover:translate-x-2")).toBe(
      "group-hover:translate-x-2 rtl:group-hover:-translate-x-2"
    )
  })

  it("does not add rtl: variant for translate-y classes", () => {
    expect(applyRtlMapping("-translate-y-1/2")).toBe("-translate-y-1/2")
    expect(applyRtlMapping("translate-y-full")).toBe("translate-y-full")
  })

  it("adds rtl:space-x-reverse for space-x classes", () => {
    expect(applyRtlMapping("space-x-4")).toBe("space-x-4 rtl:space-x-reverse")
    expect(applyRtlMapping("space-x-2")).toBe("space-x-2 rtl:space-x-reverse")
    expect(applyRtlMapping("space-x-0")).toBe("space-x-0 rtl:space-x-reverse")
  })

  it("adds rtl:divide-x-reverse for divide-x classes", () => {
    expect(applyRtlMapping("divide-x-2")).toBe(
      "divide-x-2 rtl:divide-x-reverse"
    )
    expect(applyRtlMapping("divide-x-0")).toBe(
      "divide-x-0 rtl:divide-x-reverse"
    )
  })

  it("handles space-x and divide-x with variant prefixes", () => {
    expect(applyRtlMapping("md:space-x-4")).toBe(
      "md:space-x-4 rtl:md:space-x-reverse"
    )
    expect(applyRtlMapping("hover:divide-x-2")).toBe(
      "hover:divide-x-2 rtl:hover:divide-x-reverse"
    )
  })

  it("does not add rtl: variant for space-y or divide-y classes", () => {
    expect(applyRtlMapping("space-y-4")).toBe("space-y-4")
    expect(applyRtlMapping("divide-y-2")).toBe("divide-y-2")
  })

  it("adds rtl: variant for cursor resize classes", () => {
    expect(applyRtlMapping("cursor-w-resize")).toBe(
      "cursor-w-resize rtl:cursor-e-resize"
    )
    expect(applyRtlMapping("cursor-e-resize")).toBe(
      "cursor-e-resize rtl:cursor-w-resize"
    )
  })

  it("handles cursor resize with variant prefixes", () => {
    expect(applyRtlMapping("hover:cursor-w-resize")).toBe(
      "hover:cursor-w-resize rtl:hover:cursor-e-resize"
    )
  })

  it("transforms cn-rtl-flip marker to rtl:rotate-180", () => {
    expect(applyRtlMapping("cn-rtl-flip size-4")).toBe("rtl:rotate-180 size-4")
    expect(applyRtlMapping("size-4 cn-rtl-flip")).toBe("size-4 rtl:rotate-180")
    expect(applyRtlMapping("cn-rtl-flip")).toBe("rtl:rotate-180")
  })

  it("transforms cn-rtl-flip with other RTL mappings", () => {
    expect(applyRtlMapping("cn-rtl-flip ml-2")).toBe("rtl:rotate-180 ms-2")
  })

  it("does not add logical side selectors without cn-logical-sides marker", () => {
    // Without marker, no logical selectors added.
    expect(applyRtlMapping("data-[side=left]:top-1")).toBe(
      "data-[side=left]:top-1"
    )
  })

  it("does not transform positioning classes inside physical side variants", () => {
    // Physical side variants (data-[side=left], data-[side=right]) should keep
    // physical positioning because the side is physical, not logical.
    // e.g., tooltip on physical left needs arrow on physical right.
    expect(applyRtlMapping("data-[side=left]:-right-1")).toBe(
      "data-[side=left]:-right-1"
    )
    expect(applyRtlMapping("data-[side=right]:-left-1")).toBe(
      "data-[side=right]:-left-1"
    )
    expect(applyRtlMapping("data-[side=left]:right-0")).toBe(
      "data-[side=left]:right-0"
    )
    expect(applyRtlMapping("data-[side=right]:left-0")).toBe(
      "data-[side=right]:left-0"
    )
  })

  it("still transforms non-positioning classes inside physical side variants", () => {
    // Other classes like margins, padding should still be transformed.
    expect(applyRtlMapping("data-[side=left]:ml-2")).toBe(
      "data-[side=left]:ms-2"
    )
    expect(applyRtlMapping("data-[side=right]:pl-4")).toBe(
      "data-[side=right]:ps-4"
    )
    expect(applyRtlMapping("data-[side=left]:text-left")).toBe(
      "data-[side=left]:text-start"
    )
  })

  it("skips classes with rtl: prefix", () => {
    expect(applyRtlMapping("rtl:ml-2")).toBe("rtl:ml-2")
    expect(applyRtlMapping("rtl:text-right")).toBe("rtl:text-right")
    expect(applyRtlMapping("rtl:space-x-reverse")).toBe("rtl:space-x-reverse")
  })

  it("skips classes with ltr: prefix", () => {
    expect(applyRtlMapping("ltr:ml-2")).toBe("ltr:ml-2")
    expect(applyRtlMapping("ltr:text-left")).toBe("ltr:text-left")
  })

  it("skips rtl:/ltr: classes but transforms others in same string", () => {
    expect(applyRtlMapping("ml-2 rtl:mr-2")).toBe("ms-2 rtl:mr-2")
    expect(applyRtlMapping("ltr:pl-4 pr-4")).toBe("ltr:pl-4 pe-4")
    expect(applyRtlMapping("text-left rtl:text-right ltr:text-left")).toBe(
      "text-start rtl:text-right ltr:text-left"
    )
  })

  it("skips manually specified ltr:/rtl: translate pairs", () => {
    expect(applyRtlMapping("ltr:-translate-x-1/2 rtl:-translate-x-1/2")).toBe(
      "ltr:-translate-x-1/2 rtl:-translate-x-1/2"
    )
  })

  it("preserves empty segments from leading, trailing and repeated spaces", () => {
    expect(applyRtlMapping(" ml-2  mr-2 ")).toBe(" ms-2  me-2 ")
    expect(applyRtlMapping("")).toBe("")
  })

  it("leaves a variant without a value unchanged", () => {
    expect(applyRtlMapping("hover: ml-2")).toBe("hover: ms-2")
  })

  it("only splits classes on spaces", () => {
    // Current behavior: a tab or newline does not separate classes, so only the first one is mapped.
    expect(applyRtlMapping("ml-2\tmr-2")).toBe("ms-2\tmr-2")
    expect(applyRtlMapping("text-left\nmr-2")).toBe("text-left\nmr-2")
  })

  it("preserves modifiers on slide animations inside logical side variants", () => {
    expect(
      applyRtlMapping("data-[side=inline-start]:slide-in-from-right-2/50")
    ).toBe("data-[side=inline-start]:slide-in-from-end-2/50")
  })

  it("preserves modifiers together with variant prefixes", () => {
    expect(applyRtlMapping("hover:border-l-red-500/50")).toBe(
      "hover:border-s-red-500/50"
    )
    expect(applyRtlMapping("data-[state=open]:bg-muted/50")).toBe(
      "data-[state=open]:bg-muted/50"
    )
  })

  it("is not idempotent for classes that add an rtl: variant", () => {
    const once = applyRtlMapping(
      "translate-x-2 space-x-2 divide-x-2 cursor-w-resize cn-rtl-flip ml-2"
    )
    expect(once).toBe(
      "translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse divide-x-2 rtl:divide-x-reverse cursor-w-resize rtl:cursor-e-resize rtl:rotate-180 ms-2"
    )
    // Current behavior: a second pass appends the rtl: variants again.
    expect(applyRtlMapping(once)).toBe(
      "translate-x-2 rtl:-translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse rtl:space-x-reverse divide-x-2 rtl:divide-x-reverse rtl:divide-x-reverse cursor-w-resize rtl:cursor-e-resize rtl:cursor-e-resize rtl:rotate-180 ms-2"
    )
  })
})

describe("transformRtl", () => {
  it("transforms className string literals when rtl is true", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className="ml-2 mr-4 text-left">foo</div>
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("text-start")
  })

  it("escapes transformed string literals that contain double quotes", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: String.raw`import * as React from "react"
export function Foo() {
  return <div className='ml-1 after:content-["\""]' />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    const sourceFile = ts.createSourceFile(
      "test.tsx",
      result,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )
    const stringLiterals: string[] = []

    function visit(node: ts.Node) {
      if (ts.isStringLiteral(node)) {
        stringLiterals.push(node.text)
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)

    expect((sourceFile as any).parseDiagnostics).toHaveLength(0)
    expect(stringLiterals).toContain('ms-1 after:content-["\\""]')
  })

  it("does not transform when rtl is false", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className="ml-2 mr-4 text-left">foo</div>
}
`,
      config: {
        rtl: false,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("ml-2")
    expect(result).toContain("mr-4")
    expect(result).toContain("text-left")
  })

  it("does not transform when direction is not specified", async () => {
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
      } as Config,
    })

    expect(result).toContain("ml-2")
    expect(result).toContain("mr-4")
    expect(result).toContain("text-left")
  })

  it("transforms cn() function arguments", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <div className={cn("ml-2 mr-4", true && "pl-2")}>foo</div>
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("ps-2")
  })

  it("transforms cva base classes", async () => {
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
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("ps-4")
    expect(result).toContain("pe-4")
    expect(result).toContain("ps-2")
    expect(result).toContain("pe-2")
  })

  it("transforms cn() inside mergeProps", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return mergeProps(
    {
      className: cn("absolute right-1 top-1"),
    },
    props
  )
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("end-1")
    expect(result).not.toContain("right-1")
  })

  it("transforms string literal className inside mergeProps", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return mergeProps(
    {
      className: "ml-2 right-0",
    },
    props
  )
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("end-0")
    expect(result).not.toContain("ml-2")
    expect(result).not.toContain("right-0")
  })

  it("transforms cn-rtl-flip marker to rtl:rotate-180", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <IconPlaceholder lucide="ChevronRightIcon" className="cn-rtl-flip size-4" />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
    expect(result).not.toContain("cn-rtl-flip")
  })

  it("transforms cn-rtl-flip marker in cn() call", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo({ className }) {
  return <IconPlaceholder lucide="ChevronRightIcon" className={cn("cn-rtl-flip size-4", className)} />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
    expect(result).not.toContain("cn-rtl-flip")
  })

  it("does not add rtl:rotate-180 without cn-rtl-flip marker", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <IconPlaceholder lucide="ChevronRightIcon" className="size-4" />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).not.toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
  })

  it("transforms side prop to logical value for whitelisted components", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <ContextMenuContent side="right" />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain('side="inline-end"')
    expect(result).not.toContain('side="right"')
  })

  it("transforms side prop left to inline-start", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <DropdownMenuSubContent side="left" />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain('side="inline-start"')
    expect(result).not.toContain('side="left"')
  })

  it("does not transform side prop for non-whitelisted components", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Foo() {
  return <SomeOtherComponent side="right" />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain('side="right"')
    expect(result).not.toContain('side="inline-end"')
  })

  it("transforms default parameter value for side prop in whitelisted functions", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
function DropdownMenuSubContent({
  side = "right",
  ...props
}) {
  return <div />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain('side = "inline-end"')
    expect(result).not.toContain('side = "right"')
  })

  it("does not transform default parameter value for side prop in non-whitelisted functions", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
function Sidebar({
  side = "right",
  ...props
}) {
  return <div />
}
`,
      config: {
        rtl: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
    })

    expect(result).toContain('side = "right"')
    expect(result).not.toContain('side = "inline-end"')
  })

  it("preserves the quote kind of transformed class strings", async () => {
    const result = await transformWithRtl(
      `export function Foo({ isActive, isOpen }) {
  return (
    <div className='ml-2 text-left'>
      <span
        className={cn('pl-2', "pr-2", isActive ? 'left-0' : "right-0", isOpen && 'mr-1')}
      />
    </div>
  )
}
`
    )

    expect(result).toBe(`export function Foo({ isActive, isOpen }) {
  return (
    <div className='ms-2 text-start'>
      <span
        className={cn('ps-2', "pe-2", isActive ? 'start-0' : "end-0", isOpen && 'me-1')}
      />
    </div>
  )
}
`)
  })

  it("does not transform template literals", async () => {
    const result = await transformWithRtl(`export function Foo({ active }) {
  return (
    <div className={\`ml-2 \${active}\`}>
      <span className={cn(\`pl-2\`, "pr-2")} />
    </div>
  )
}
`)

    // Current behavior: only "pr-2" is a StringLiteral, so the template literals keep physical classes.
    expect(result).toBe(`export function Foo({ active }) {
  return (
    <div className={\`ml-2 \${active}\`}>
      <span className={cn(\`pl-2\`, "pe-2")} />
    </div>
  )
}
`)
  })

  it("transforms a multi-line className={cn(...)} in place", async () => {
    const result = await transformWithRtl(
      `function SheetContent({ className, side = "right", ...props }) {
  return (
    <SheetPrimitive.Content
      className={cn(
        "fixed z-50 gap-4 bg-background shadow-lg",
        side === "right" &&
          "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left"
          ? "inset-y-0 left-0 h-full w-3/4 border-r"
          : "pr-4",
        className
      )}
      {...props}
    />
  )
}
`
    )

    expect(result).toBe(
      `function SheetContent({ className, side = "right", ...props }) {
  return (
    <SheetPrimitive.Content
      className={cn(
        "fixed z-50 gap-4 bg-background shadow-lg",
        side === "right" &&
          "inset-y-0 end-0 h-full w-3/4 border-s sm:max-w-sm",
        side === "left"
          ? "inset-y-0 start-0 h-full w-3/4 border-e"
          : "pe-4",
        className
      )}
      {...props}
    />
  )
}
`
    )
  })

  it("inserts a line continuation into multi-line className strings", async () => {
    const result = await transformWithRtl(`export function Foo() {
  return (
    <div
      className="ml-2 text-left
        mr-2"
    />
  )
}
`)

    // Current behavior: a backslash (kept literally by JSX) is added before the newline, and the "text-left" before it is not mapped.
    expect(result).toBe(`export function Foo() {
  return (
    <div
      className="ms-2 text-left\\
        me-2"
    />
  )
}
`)
  })

  it("drops a backslash from escaped class strings in cn()", async () => {
    const result = await transformWithRtl(String.raw`export function Foo() {
  return (
    <>
      <div className={cn("ml-2 before:content-['\\00a0']")} />
      <div className="ml-2 before:content-['\00a0']" />
    </>
  )
}
`)

    // Current behavior: the escaped "\\" in the cn() string is written back as a single "\".
    expect(result).toBe(String.raw`export function Foo() {
  return (
    <>
      <div className={cn("ms-2 before:content-['\00a0']")} />
      <div className="ms-2 before:content-['\00a0']" />
    </>
  )
}
`)
  })

  it("only transforms direct string arguments of the first cn() in a className expression", async () => {
    const result = await transformWithRtl(`export function Foo({ isOpen }) {
  return (
    <>
      <div className={"ml-2"} />
      <div className={isOpen ? "ml-2" : "mr-2"} />
      <div className={cn(cn("ml-2"), "mr-2")} />
      <div className={cn((isOpen && "ml-2"), "pr-2")} />
    </>
  )
}
`)

    // Current behavior: bare strings, ternaries outside cn(), nested cn() and parenthesized arguments are skipped.
    expect(result).toBe(`export function Foo({ isOpen }) {
  return (
    <>
      <div className={"ml-2"} />
      <div className={isOpen ? "ml-2" : "mr-2"} />
      <div className={cn(cn("ml-2"), "me-2")} />
      <div className={cn((isOpen && "ml-2"), "pe-2")} />
    </>
  )
}
`)
  })

  it("transforms classNames object properties", async () => {
    const result = await transformWithRtl(
      `export function Calendar({ classNames, isRtl, ...props }) {
  return (
    <DayPicker
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        nav: cn(
          "absolute right-1 top-0",
          isRtl ? "pl-2" : 'pr-2',
          defaultClassNames.nav
        ),
        day: someHelper("pl-2"),
        button_previous: "left-1",
        nested: { day: 'pr-1' },
        ...classNames,
      }}
      {...props}
    />
  )
}
`
    )

    expect(result).toBe(
      `export function Calendar({ classNames, isRtl, ...props }) {
  return (
    <DayPicker
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        nav: cn(
          "absolute end-1 top-0",
          isRtl ? "ps-2" : 'pe-2',
          defaultClassNames.nav
        ),
        day: someHelper("ps-2"),
        button_previous: "start-1",
        nested: { day: 'pe-1' },
        ...classNames,
      }}
      {...props}
    />
  )
}
`
    )
  })

  it("skips logical cn() arguments, variant keys and string values in classNames", async () => {
    const result = await transformWithRtl(`export function Calendar({ isRtl }) {
  return (
    <>
      <DayPicker
        classNames={{
          nav: cn("pl-2", isRtl && "ml-2"),
          variant: "ml-2",
        }}
      />
      <DayPicker classNames="ml-2" />
    </>
  )
}
`)

    // Current behavior: unlike className, "&&" arguments in classNames cn() calls are not transformed.
    expect(result).toBe(`export function Calendar({ isRtl }) {
  return (
    <>
      <DayPicker
        classNames={{
          nav: cn("ps-2", isRtl && "ml-2"),
          variant: "ml-2",
        }}
      />
      <DayPicker classNames="ml-2" />
    </>
  )
}
`)
  })

  it("transforms conditional and logical cn() arguments inside mergeProps", async () => {
    const result = await transformWithRtl(`function Item({ inset, props }) {
  const a = mergeProps<"div">(
    {
      className: cn("ml-2", inset ? "pl-8" : 'pr-2', inset && "mr-1", \`left-0\`),
    },
    props
  )
  const b = mergeProps(props, { className: "ml-2" })
  const c = mergeProps({ className: clsx("ml-2") }, props)
  const d = mergeProps({ ...props, "data-slot": "item" })
  return [a, b, c, d]
}
`)

    // Current behavior: only a cn() call or string in the first argument is transformed, and template literals are skipped.
    expect(result).toBe(`function Item({ inset, props }) {
  const a = mergeProps<"div">(
    {
      className: cn("ms-2", inset ? "ps-8" : 'pe-2', inset && "me-1", \`left-0\`),
    },
    props
  )
  const b = mergeProps(props, { className: "ml-2" })
  const c = mergeProps({ className: clsx("ml-2") }, props)
  const d = mergeProps({ ...props, "data-slot": "item" })
  return [a, b, c, d]
}
`)
  })

  it("leaves side props that are missing, dynamic or unmapped", async () => {
    const result = await transformWithRtl(`export function Foo({ side }) {
  return (
    <>
      <ContextMenuContent className="ml-2" />
      <ContextMenuSubContent side={side} />
      <DropdownMenuSubContent side={"right"}>x</DropdownMenuSubContent>
      <ContextMenuContent side="top" />
    </>
  )
}
`)

    // Current behavior: a string inside an expression container (side={"right"}) is not mapped.
    expect(result).toBe(`export function Foo({ side }) {
  return (
    <>
      <ContextMenuContent className="ms-2" />
      <ContextMenuSubContent side={side} />
      <DropdownMenuSubContent side={"right"}>x</DropdownMenuSubContent>
      <ContextMenuContent side="top" />
    </>
  )
}
`)
  })

  it("writes mapped side values with double quotes", async () => {
    const result = await transformWithRtl(
      `function ContextMenuContent({ side = 'left' }) {
  return <ContextMenuSubContent side='right' />
}
`
    )

    // Current behavior: single-quoted side values are rewritten with double quotes.
    expect(result).toBe(
      `function ContextMenuContent({ side = "inline-start" }) {
  return <ContextMenuSubContent side="inline-end" />
}
`
    )
  })

  it("leaves side defaults that are missing or not string literals", async () => {
    const result = await transformWithRtl(
      `function ContextMenuSubContent({ side, align = "start" }) {
  return <div data-side={side} data-align={align} />
}

function DropdownMenuSubContent({ side = DEFAULT_SIDE, ...props }) {
  const { side: placement = "left" } = props
  return <div data-side={side} data-placement={placement} />
}
`
    )

    expect(result).toBe(
      `function ContextMenuSubContent({ side, align = "start" }) {
  return <div data-side={side} data-align={align} />
}

function DropdownMenuSubContent({ side = DEFAULT_SIDE, ...props }) {
  const { side: placement = "left" } = props
  return <div data-side={side} data-placement={placement} />
}
`
    )
  })

  it("transforms any side binding inside a whitelisted function declaration", async () => {
    const result = await transformWithRtl(`function ContextMenuContent(props) {
  const { side = "left" } = props
  const render = ({ side = "right" }) => <div data-side={side} />
  return render({ side })
}
`)

    // Current behavior: side bindings in the body and in nested arrows are mapped, not just parameters.
    expect(result).toBe(`function ContextMenuContent(props) {
  const { side = "inline-start" } = props
  const render = ({ side = "inline-end" }) => <div data-side={side} />
  return render({ side })
}
`)
  })

  it("does not transform side defaults in arrow function components", async () => {
    const result = await transformWithRtl(
      `const DropdownMenuSubContent = ({ side = "right", ...props }) => (
  <div data-side={side} {...props} />
)
`
    )

    // Current behavior: only function declarations are matched by name.
    expect(result).toBe(
      `const DropdownMenuSubContent = ({ side = "right", ...props }) => (
  <div data-side={side} {...props} />
)
`
    )
  })

  it("transforms cva variants but not compoundVariants or template literals", async () => {
    const result = await transformWithRtl(
      `const itemVariants = cva('translate-x-2', {
  variants: {
    size: { sm: 'pl-2', lg: \`pr-2\` },
  },
  compoundVariants: [{ size: "sm", className: "ml-2" }],
  defaultVariants: { size: "sm" },
})
`
    )

    // Current behavior: compoundVariants and template literal variants keep physical classes.
    expect(result).toBe(
      `const itemVariants = cva('translate-x-2 rtl:-translate-x-2', {
  variants: {
    size: { sm: 'ps-2', lg: \`pr-2\` },
  },
  compoundVariants: [{ size: "sm", className: "ml-2" }],
  defaultVariants: { size: "sm" },
})
`
    )
  })

  it("transforms cva variant strings nested two levels deep twice", async () => {
    const result = await transformWithRtl(`const itemVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: {
        start: "translate-x-2 ml-2",
      },
    },
  },
})
`)

    // Current behavior: the inner string is visited once per enclosing property, so rtl: is appended twice.
    expect(result).toBe(`const itemVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: {
        start: "translate-x-2 rtl:-translate-x-2 rtl:-translate-x-2 ms-2",
      },
    },
  },
})
`)
  })

  it("maps a cva base again inside a classNames call", async () => {
    // Current behavior: the cva() pass and the classNames pass both visit it.
    expect(
      await transformWithRtl(
        `const a = <div classNames={{ root: cva("translate-x-2") }} />
`
      )
    ).toBe(
      `const a = <div classNames={{ root: cva("translate-x-2 rtl:-translate-x-2 rtl:-translate-x-2") }} />
`
    )
  })

  it("rewrites the escapes of class strings only", async () => {
    expect(
      await transformWithRtl(
        `const a = cn("a\\x41", 'it\\'s')
const b = <div className={cn("pl-2\\u0020ml-2")} />
`
      )
    ).toBe(`const a = cn("a\\x41", 'it\\'s')
const b = <div className={cn("ps-2 ms-2")} />
`)
  })

  it("maps side defaults by their innermost function declaration", async () => {
    expect(
      await transformWithRtl(
        `export function DropdownMenuSubContent({ align: side = "left" }) {
  const f = ({ side = "right" }) => side
  function Inner({ side = "right" }) {}
  return f
}
`
      )
    )
      .toBe(`export function DropdownMenuSubContent({ align: side = "inline-start" }) {
  const f = ({ side = "inline-end" }) => side
  function Inner({ side = "right" }) {}
  return f
}
`)
  })

  it("preserves CRLF line endings", async () => {
    const result = await transformWithRtl(
      'function ContextMenuSubContent({\r\n  side = "right",\r\n}) {\r\n  return <ContextMenuContent side="left" className={cn(\r\n    "ml-2",\r\n    "pr-4"\r\n  )} />\r\n}\r\n'
    )

    expect(result).toBe(
      'function ContextMenuSubContent({\r\n  side = "inline-end",\r\n}) {\r\n  return <ContextMenuContent side="inline-start" className={cn(\r\n    "ms-2",\r\n    "pe-4"\r\n  )} />\r\n}\r\n'
    )
  })
})

describe("transformDirection", () => {
  it("returns the input unchanged when rtl is false", async () => {
    const input = `// Copyright (c) Acme, Inc.

"use client"

export function Foo() {
  return <div className="ml-2 text-left" />
}
`

    expect(await transformDirection(input, false)).toBe(input)
  })

  it("transforms a component file", async () => {
    const result = await transformDirection(
      `"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function ContextMenuContent({
  className,
  align = "start",
  side = "right",
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, "align" | "side">) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        side={side}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "z-50 min-w-36 rounded-md p-1 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:-right-1",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-left",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="cn-rtl-flip ml-auto size-4" />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="shadow-lg"
      side="right"
      {...props}
    />
  )
}

export { ContextMenuContent, ContextMenuSubTrigger, ContextMenuSubContent }
`,
      true
    )

    expect(result).toMatchInlineSnapshot(`
      ""use client"

      import * as React from "react"
      import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
      import { ChevronRightIcon } from "lucide-react"

      import { cn } from "@/lib/utils"

      function ContextMenuContent({
        className,
        align = "start",
        side = "inline-end",
        ...props
      }: ContextMenuPrimitive.Popup.Props &
        Pick<ContextMenuPrimitive.Positioner.Props, "align" | "side">) {
        return (
          <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Positioner
              className="isolate z-50 outline-none"
              align={align}
              side={side}
            >
              <ContextMenuPrimitive.Popup
                data-slot="context-menu-content"
                className={cn(
                  "z-50 min-w-36 rounded-md p-1 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:-right-1",
                  className
                )}
                {...props}
              />
            </ContextMenuPrimitive.Positioner>
          </ContextMenuPrimitive.Portal>
        )
      }

      function ContextMenuSubTrigger({
        className,
        inset,
        children,
        ...props
      }: ContextMenuPrimitive.SubmenuTrigger.Props & {
        inset?: boolean
      }) {
        return (
          <ContextMenuPrimitive.SubmenuTrigger
            data-slot="context-menu-sub-trigger"
            data-inset={inset}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-start",
              inset && "ps-8",
              className
            )}
            {...props}
          >
            {children}
            <ChevronRightIcon className="rtl:rotate-180 ms-auto size-4" />
          </ContextMenuPrimitive.SubmenuTrigger>
        )
      }

      function ContextMenuSubContent({
        ...props
      }: React.ComponentProps<typeof ContextMenuContent>) {
        return (
          <ContextMenuContent
            data-slot="context-menu-sub-content"
            className="shadow-lg"
            side="inline-end"
            {...props}
          />
        )
      }

      export { ContextMenuContent, ContextMenuSubTrigger, ContextMenuSubContent }
      "
    `)
  })

  it("strips a leading license comment", async () => {
    const result = await transformDirection(
      `/**
 * Copyright (c) Acme, Inc.
 * SPDX-License-Identifier: MIT
 */

"use client"

export function Foo() {
  return <div className="ml-2" />
}
`,
      true
    )

    // Current behavior: getText() drops the leading comment and blank line.
    expect(result).toBe(`"use client"

export function Foo() {
  return <div className="ms-2" />
}
`)
  })

  it("strips a leading comment even when no classes change", async () => {
    const result = await transformDirection(
      `// Copyright (c) Acme, Inc.

export const a = 1
`,
      true
    )

    // Current behavior: the output differs from the input, so migrate rtl rewrites the file without its header.
    expect(result).toBe(`export const a = 1
`)
  })

  it("strips a leading byte order mark", async () => {
    const result = await transformDirection(
      `﻿"use client"

export const Foo = () => <div className="ml-2" />
`,
      true
    )

    expect(result).toBe(`"use client"

export const Foo = () => <div className="ms-2" />
`)
  })

  it("preserves CRLF line endings", async () => {
    const result = await transformDirection(
      '"use client"\r\n\r\nfunction DropdownMenuSubContent({\r\n  side = "left",\r\n}) {\r\n  return <div className="ml-2 text-right" />\r\n}\r\n',
      true
    )

    expect(result).toBe(
      '"use client"\r\n\r\nfunction DropdownMenuSubContent({\r\n  side = "inline-start",\r\n}) {\r\n  return <div className="ms-2 text-end" />\r\n}\r\n'
    )
  })

  it("is not idempotent when run twice", async () => {
    const input = `"use client"

function Foo({ className }) {
  return (
    <div
      className={cn(
        "translate-x-2 space-x-2 cursor-w-resize ml-2",
        className
      )}
    >
      <ChevronRightIcon className="cn-rtl-flip ml-auto" />
      <ContextMenuContent side="right" />
    </div>
  )
}
`

    const once = await transformDirection(input, true)
    expect(once).toBe(`"use client"

function Foo({ className }) {
  return (
    <div
      className={cn(
        "translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse cursor-w-resize rtl:cursor-e-resize ms-2",
        className
      )}
    >
      <ChevronRightIcon className="rtl:rotate-180 ms-auto" />
      <ContextMenuContent side="inline-end" />
    </div>
  )
}
`)

    // Current behavior: a second run appends the translate-x, space-x and cursor rtl: variants again.
    expect(await transformDirection(once, true)).toBe(`"use client"

function Foo({ className }) {
  return (
    <div
      className={cn(
        "translate-x-2 rtl:-translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse rtl:space-x-reverse cursor-w-resize rtl:cursor-e-resize rtl:cursor-e-resize ms-2",
        className
      )}
    >
      <ChevronRightIcon className="rtl:rotate-180 ms-auto" />
      <ContextMenuContent side="inline-end" />
    </div>
  )
}
`)
  })
})
