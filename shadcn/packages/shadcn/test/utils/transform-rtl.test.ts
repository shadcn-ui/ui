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
    expect(applyRtlMapping("right-1")).toBe("end-1")
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

  test("handles named group selectors with data attributes", () => {
    expect(
      applyRtlMapping(
        "sm:group-data-[size=default]/alert-dialog-content:text-left"
      )
    ).toBe("sm:group-data-[size=default]/alert-dialog-content:text-start")
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

  // test("transforms slide animation classes to logical equivalents", () => {
  //   // tw-animate-css has logical slide utilities (start/end).
  //   expect(applyRtlMapping("slide-in-from-left-2")).toBe("slide-in-from-start-2")
  //   expect(applyRtlMapping("slide-in-from-right-2")).toBe("slide-in-from-end-2")
  //   expect(applyRtlMapping("slide-out-to-left-2")).toBe("slide-out-to-start-2")
  //   expect(applyRtlMapping("slide-out-to-right-2")).toBe("slide-out-to-end-2")
  // })

  // test("transforms slide animations with variants", () => {
  //   expect(applyRtlMapping("data-[side=left]:slide-in-from-right-2")).toBe(
  //     "data-[side=left]:slide-in-from-end-2"
  //   )
  //   expect(applyRtlMapping("data-[side=right]:slide-in-from-left-2")).toBe(
  //     "data-[side=right]:slide-in-from-start-2"
  //   )
  // })

  test("transforms slide animations inside logical side variants", () => {
    expect(
      applyRtlMapping("data-[side=inline-start]:slide-in-from-right-2")
    ).toBe("data-[side=inline-start]:slide-in-from-end-2")
    expect(
      applyRtlMapping("data-[side=inline-start]:slide-out-to-right-2")
    ).toBe("data-[side=inline-start]:slide-out-to-end-2")
    expect(
      applyRtlMapping("data-[side=inline-end]:slide-in-from-left-2")
    ).toBe("data-[side=inline-end]:slide-in-from-start-2")
    expect(
      applyRtlMapping("data-[side=inline-end]:slide-out-to-left-2")
    ).toBe("data-[side=inline-end]:slide-out-to-start-2")
  })

  test("does not transform slide animations inside physical side variants", () => {
    // Physical side variants should keep physical slide directions.
    expect(
      applyRtlMapping("data-[side=left]:slide-in-from-right-2")
    ).toBe("data-[side=left]:slide-in-from-right-2")
    expect(
      applyRtlMapping("data-[side=right]:slide-in-from-left-2")
    ).toBe("data-[side=right]:slide-in-from-left-2")
  })

  test("does not transform unrelated classes", () => {
    expect(applyRtlMapping("bg-red-500")).toBe("bg-red-500")
    expect(applyRtlMapping("flex")).toBe("flex")
    expect(applyRtlMapping("mx-auto")).toBe("mx-auto")
    expect(applyRtlMapping("px-4")).toBe("px-4")
  })

  test("does not transform classes that partially match RTL mappings", () => {
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

  test("adds rtl: variant for translate-x classes", () => {
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

  test("handles translate-x with variant prefixes", () => {
    expect(applyRtlMapping("after:-translate-x-1/2")).toBe(
      "after:-translate-x-1/2 rtl:after:translate-x-1/2"
    )
    expect(applyRtlMapping("group-hover:translate-x-2")).toBe(
      "group-hover:translate-x-2 rtl:group-hover:-translate-x-2"
    )
  })

  test("does not add rtl: variant for translate-y classes", () => {
    expect(applyRtlMapping("-translate-y-1/2")).toBe("-translate-y-1/2")
    expect(applyRtlMapping("translate-y-full")).toBe("translate-y-full")
  })

  test("adds rtl:space-x-reverse for space-x classes", () => {
    expect(applyRtlMapping("space-x-4")).toBe("space-x-4 rtl:space-x-reverse")
    expect(applyRtlMapping("space-x-2")).toBe("space-x-2 rtl:space-x-reverse")
    expect(applyRtlMapping("space-x-0")).toBe("space-x-0 rtl:space-x-reverse")
  })

  test("adds rtl:divide-x-reverse for divide-x classes", () => {
    expect(applyRtlMapping("divide-x-2")).toBe("divide-x-2 rtl:divide-x-reverse")
    expect(applyRtlMapping("divide-x-0")).toBe("divide-x-0 rtl:divide-x-reverse")
  })

  test("handles space-x and divide-x with variant prefixes", () => {
    expect(applyRtlMapping("md:space-x-4")).toBe(
      "md:space-x-4 rtl:md:space-x-reverse"
    )
    expect(applyRtlMapping("hover:divide-x-2")).toBe(
      "hover:divide-x-2 rtl:hover:divide-x-reverse"
    )
  })

  test("does not add rtl: variant for space-y or divide-y classes", () => {
    expect(applyRtlMapping("space-y-4")).toBe("space-y-4")
    expect(applyRtlMapping("divide-y-2")).toBe("divide-y-2")
  })

  test("adds rtl: variant for cursor resize classes", () => {
    expect(applyRtlMapping("cursor-w-resize")).toBe(
      "cursor-w-resize rtl:cursor-e-resize"
    )
    expect(applyRtlMapping("cursor-e-resize")).toBe(
      "cursor-e-resize rtl:cursor-w-resize"
    )
  })

  test("handles cursor resize with variant prefixes", () => {
    expect(applyRtlMapping("hover:cursor-w-resize")).toBe(
      "hover:cursor-w-resize rtl:hover:cursor-e-resize"
    )
  })

  test("transforms cn-rtl-flip marker to rtl:rotate-180", () => {
    expect(applyRtlMapping("cn-rtl-flip size-4")).toBe("rtl:rotate-180 size-4")
    expect(applyRtlMapping("size-4 cn-rtl-flip")).toBe("size-4 rtl:rotate-180")
    expect(applyRtlMapping("cn-rtl-flip")).toBe("rtl:rotate-180")
  })

  test("transforms cn-rtl-flip with other RTL mappings", () => {
    expect(applyRtlMapping("cn-rtl-flip ml-2")).toBe("rtl:rotate-180 ms-2")
  })

  // test("adds logical side selectors when cn-logical-sides marker is present", () => {
  //   // With cn-logical-sides marker, adds logical alongside physical.
  //   // In RTL: inline-start = right, inline-end = left.
  //   expect(
  //     applyRtlMapping("cn-logical-sides data-[side=left]:top-1")
  //   ).toBe("cn-logical-sides data-[side=left]:top-1 data-[side=inline-end]:top-1")
  //   expect(
  //     applyRtlMapping("cn-logical-sides data-[side=right]:-left-1")
  //   ).toBe("cn-logical-sides data-[side=right]:-start-1 data-[side=inline-start]:-start-1")
  // })

  test("does not add logical side selectors without cn-logical-sides marker", () => {
    // Without marker, no logical selectors added.
    expect(applyRtlMapping("data-[side=left]:top-1")).toBe(
      "data-[side=left]:top-1"
    )
  })

  test("does not transform positioning classes inside physical side variants", () => {
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

  test("still transforms non-positioning classes inside physical side variants", () => {
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

  test("skips classes with rtl: prefix", () => {
    expect(applyRtlMapping("rtl:ml-2")).toBe("rtl:ml-2")
    expect(applyRtlMapping("rtl:text-right")).toBe("rtl:text-right")
    expect(applyRtlMapping("rtl:space-x-reverse")).toBe("rtl:space-x-reverse")
  })

  test("skips classes with ltr: prefix", () => {
    expect(applyRtlMapping("ltr:ml-2")).toBe("ltr:ml-2")
    expect(applyRtlMapping("ltr:text-left")).toBe("ltr:text-left")
  })

  test("skips rtl:/ltr: classes but transforms others in same string", () => {
    expect(applyRtlMapping("ml-2 rtl:mr-2")).toBe("ms-2 rtl:mr-2")
    expect(applyRtlMapping("ltr:pl-4 pr-4")).toBe("ltr:pl-4 pe-4")
    expect(applyRtlMapping("text-left rtl:text-right ltr:text-left")).toBe(
      "text-start rtl:text-right ltr:text-left"
    )
  })

  test("skips manually specified ltr:/rtl: translate pairs", () => {
    expect(applyRtlMapping("ltr:-translate-x-1/2 rtl:-translate-x-1/2")).toBe(
      "ltr:-translate-x-1/2 rtl:-translate-x-1/2"
    )
  })
})

describe("transformRtl", () => {
  test("transforms className string literals when rtl is true", async () => {
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
      },
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("me-4")
    expect(result).toContain("text-start")
  })

  test("does not transform when rtl is false", async () => {
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
        rtl: true,
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
        rtl: true,
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

  // test("transforms side prop values", async () => {
  //   const result = await transform({
  //     filename: "test.tsx",
  //     raw: `import * as React from "react"
  // export function Foo() {
  //   return <Popover side="right" />
  // }
  // `,
  //     config: {
  //       rtl: true,
  //       tailwind: {
  //         baseColor: "neutral",
  //       },
  //       aliases: {
  //         components: "@/components",
  //         utils: "@/lib/utils",
  //       },
  //     },
  //   })

  //   expect(result).toContain('side="left"')
  //   expect(result).not.toContain('side="right"')
  // })

  // test("transforms align prop values", async () => {
  //   const result = await transform({
  //     filename: "test.tsx",
  //     raw: `import * as React from "react"
  // export function Foo() {
  //   return <Dropdown align="left" />
  // }
  // `,
  //     config: {
  //       rtl: true,
  //       tailwind: {
  //         baseColor: "neutral",
  //       },
  //       aliases: {
  //         components: "@/components",
  //         utils: "@/lib/utils",
  //       },
  //     },
  //   })

  //   expect(result).toContain('align="right"')
  //   expect(result).not.toContain('align="left"')
  // })

  // test("transforms position prop values", async () => {
  //   const result = await transform({
  //     filename: "test.tsx",
  //     raw: `import * as React from "react"
  // export function Foo() {
  //   return <Sheet position="left" />
  // }
  // `,
  //     config: {
  //       rtl: true,
  //       tailwind: {
  //         baseColor: "neutral",
  //       },
  //       aliases: {
  //         components: "@/components",
  //         utils: "@/lib/utils",
  //       },
  //     },
  //   })

  //   expect(result).toContain('position="right"')
  //   expect(result).not.toContain('position="left"')
  // })

  // test("does not transform non-directional prop values", async () => {
  //   const result = await transform({
  //     filename: "test.tsx",
  //     raw: `import * as React from "react"
  // export function Foo() {
  //   return <Popover side="top" align="center" />
  // }
  // `,
  //     config: {
  //       rtl: true,
  //       tailwind: {
  //         baseColor: "neutral",
  //       },
  //       aliases: {
  //         components: "@/components",
  //         utils: "@/lib/utils",
  //       },
  //     },
  //   })

  //   expect(result).toContain('side="top"')
  //   expect(result).toContain('align="center"')
  // })

  // test("transforms default parameter values", async () => {
  //   const result = await transform({
  //     filename: "test.tsx",
  //     raw: `import * as React from "react"
  // function DropdownMenuSubContent({
  //   align = "start",
  //   alignOffset = -3,
  //   side = "right",
  //   sideOffset = 0,
  //   className,
  //   ...props
  // }: Props) {
  //   return <div />
  // }
  // `,
  //     config: {
  //       rtl: true,
  //       tailwind: {
  //         baseColor: "neutral",
  //       },
  //       aliases: {
  //         components: "@/components",
  //         utils: "@/lib/utils",
  //       },
  //     },
  //   })

  //   expect(result).toContain('side = "left"')
  //   expect(result).not.toContain('side = "right"')
  //   // align = "start" should remain unchanged (not a directional value).
  //   expect(result).toContain('align = "start"')
  // })

  test("transforms cn() inside mergeProps", async () => {
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
      },
    })

    expect(result).toContain("end-1")
    expect(result).not.toContain("right-1")
  })

  test("transforms string literal className inside mergeProps", async () => {
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
      },
    })

    expect(result).toContain("ms-2")
    expect(result).toContain("end-0")
    expect(result).not.toContain("ml-2")
    expect(result).not.toContain("right-0")
  })

  test("transforms cn-rtl-flip marker to rtl:rotate-180", async () => {
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
      },
    })

    expect(result).toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("transforms cn-rtl-flip marker in cn() call", async () => {
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
      },
    })

    expect(result).toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("does not add rtl:rotate-180 without cn-rtl-flip marker", async () => {
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
      },
    })

    expect(result).not.toContain("rtl:rotate-180")
    expect(result).toContain("size-4")
  })

  test("transforms side prop to logical value for whitelisted components", async () => {
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
      },
    })

    expect(result).toContain('side="inline-end"')
    expect(result).not.toContain('side="right"')
  })

  test("transforms side prop left to inline-start", async () => {
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
      },
    })

    expect(result).toContain('side="inline-start"')
    expect(result).not.toContain('side="left"')
  })

  test("does not transform side prop for non-whitelisted components", async () => {
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
      },
    })

    expect(result).toContain('side="right"')
    expect(result).not.toContain('side="inline-end"')
  })

  test("transforms default parameter value for side prop in whitelisted functions", async () => {
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
      },
    })

    expect(result).toContain('side = "inline-end"')
    expect(result).not.toContain('side = "right"')
  })

  test("does not transform default parameter value for side prop in non-whitelisted functions", async () => {
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
      },
    })

    expect(result).toContain('side = "right"')
    expect(result).not.toContain('side = "inline-end"')
  })
})
