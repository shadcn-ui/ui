import { type Config } from "@/src/get-config"
import { transformIcons } from "@/src/transformers/transform-icons"
import { describe, expect, test } from "vitest"

import { transform } from "."

const testConfig: Config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "",
    tailwindCss: "tailwind.css",
  },
}

describe("transformIconPlaceholder", () => {
  describe("lucide library", () => {
    test("transforms IconPlaceholder to icon component", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder lucide="CheckIcon" /></div>
}`,
            config: {
              ...testConfig,
              iconLibrary: "lucide",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <div><CheckIcon /></div>
        }"
      `)
    })

    test("preserves className and other props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" className="size-4" aria-label="check" />
}`,
            config: {
              ...testConfig,
              iconLibrary: "lucide",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon className="size-4" aria-label="check" />
        }"
      `)
    })

    test("handles multiple icons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder lucide="CheckIcon" />
      <IconPlaceholder lucide="ArrowDownIcon" />
    </div>
  )
}`,
            config: {
              ...testConfig,
              iconLibrary: "lucide",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon, ArrowDownIcon } from "lucide-react"

        export function Component() {
          return (
            <div>
              <CheckIcon />
              <ArrowDownIcon />
            </div>
          )
        }"
      `)
    })

    test("preserves semicolons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react";
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />;
}`,
            config: {
              ...testConfig,
              iconLibrary: "lucide",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react";
        import { CheckIcon } from "lucide-react";

        export function Component() {
          return <CheckIcon />;
        }"
      `)
    })
  })

  describe("tabler library", () => {
    test("transforms IconPlaceholder to icon component", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder tabler="IconCheck" /></div>
}`,
            config: {
              ...testConfig,
              iconLibrary: "tabler",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { IconCheck } from "@tabler/icons-react"

        export function Component() {
          return <div><IconCheck /></div>
        }"
      `)
    })

    test("preserves className and other props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder tabler="IconCheck" className="size-4" aria-label="check" />
}`,
            config: {
              ...testConfig,
              iconLibrary: "tabler",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { IconCheck } from "@tabler/icons-react"

        export function Component() {
          return <IconCheck className="size-4" aria-label="check" />
        }"
      `)
    })

    test("handles multiple icons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder tabler="IconCheck" />
      <IconPlaceholder tabler="IconArrowDown" />
    </div>
  )
}`,
            config: {
              ...testConfig,
              iconLibrary: "tabler",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { IconCheck, IconArrowDown } from "@tabler/icons-react"

        export function Component() {
          return (
            <div>
              <IconCheck />
              <IconArrowDown />
            </div>
          )
        }"
      `)
    })

    test("preserves semicolons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react";
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder tabler="IconCheck" />;
}`,
            config: {
              ...testConfig,
              iconLibrary: "tabler",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react";
        import { IconCheck } from "@tabler/icons-react";

        export function Component() {
          return <IconCheck />;
        }"
      `)
    })
  })

  describe("hugeicons library", () => {
    test("transforms IconPlaceholder to HugeiconsIcon wrapper", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder hugeicons="Tick02Icon" /></div>
}`,
            config: {
              ...testConfig,
              iconLibrary: "hugeicons",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <div><HugeiconsIcon icon={Tick02Icon} strokeWidth={2} /></div>
        }"
      `)
    })

    test("preserves className and other props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" className="size-4" />
}`,
            config: {
              ...testConfig,
              iconLibrary: "hugeicons",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
        }"
      `)
    })

    test("does not add strokeWidth if already present", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" strokeWidth={4} />
}`,
            config: {
              ...testConfig,
              iconLibrary: "hugeicons",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={4} />
        }"
      `)
    })

    test("handles multiple icons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder hugeicons="Tick02Icon" />
      <IconPlaceholder hugeicons="ArrowDown02Icon" />
    </div>
  )
}`,
            config: {
              ...testConfig,
              iconLibrary: "hugeicons",
            },
          },
          [transformIcons]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon, ArrowDown02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return (
            <div>
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
              <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} />
            </div>
          )
        }"
      `)
    })
  })

  test("does not transform when iconLibrary is not set", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          config: testConfig,
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

      export function Component() {
        return <IconPlaceholder lucide="CheckIcon" />
      }"
    `)
  })

  test("skips icons when library prop is not provided", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder tabler="IconCheck" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "lucide",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      export function Component() {
        return <IconPlaceholder tabler="IconCheck" />
      }"
    `)
  })

  test("handles props with spaces in values", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" aria-label="check icon here" className="size-4" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "lucide",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CheckIcon } from "lucide-react"

      export function Component() {
        return <CheckIcon aria-label="check icon here" className="size-4" />
      }"
    `)
  })

  test("no extra spacing when no user props - lucide", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "lucide",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CheckIcon } from "lucide-react"

      export function Component() {
        return <CheckIcon />
      }"
    `)
  })

  test("no extra spacing when no user props - hugeicons", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "hugeicons",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { HugeiconsIcon } from "@hugeicons/react"
      import { Tick02Icon } from "@hugeicons/core-free-icons"

      export function Component() {
        return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      }"
    `)
  })

  test("removes IconPlaceholder import after transformation", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
        config: {
          ...testConfig,
          iconLibrary: "lucide",
        },
      },
      [transformIcons]
    )

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CheckIcon } from "lucide-react"

      export function Component() {
        return <CheckIcon />
      }"
    `)
  })

  test("does not transform for invalid icon library", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "invalid-library",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

      export function Component() {
        return <IconPlaceholder lucide="CheckIcon" />
      }"
    `)
  })

  test("does not forward library-specific props (lucide)", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" className="size-4" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "lucide",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CheckIcon } from "lucide-react"

      export function Component() {
        return <CheckIcon className="size-4" />
      }"
    `)
  })

  test("does not forward library-specific props (tabler)", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder tabler="IconCheck" lucide="CheckIcon" hugeicons="Tick02Icon" className="size-4" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "tabler",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { IconCheck } from "@tabler/icons-react"

      export function Component() {
        return <IconCheck className="size-4" />
      }"
    `)
  })

  test("does not forward library-specific props (hugeicons)", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" lucide="CheckIcon" tabler="IconCheck" className="size-4" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "hugeicons",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { HugeiconsIcon } from "@hugeicons/react"
      import { Tick02Icon } from "@hugeicons/core-free-icons"

      export function Component() {
        return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
      }"
    `)
  })
})

async function transformIconsIn(raw: string, iconLibrary?: string) {
  return transform(
    {
      filename: "test.tsx",
      raw,
      config: { ...testConfig, iconLibrary },
    },
    [transformIcons]
  )
}

// A real registry file: multi-line element, user attributes and a spread.
const spinnerSource = `import { cn } from "cn"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconPlaceholder
      lucide="Loader2Icon"
      tabler="IconLoader"
      hugeicons="Loading03Icon"
      phosphor="SpinnerIcon"
      remixicon="RiLoaderLine"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }`

// A real registry file: multi-line element with only library props.
const checkboxSource = `"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="cn-checkbox-indicator grid place-content-center text-current transition-none"
      >
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }`

describe("transformIcons characterization", () => {
  describe("registry spinner (multi-line element with user attributes)", () => {
    test("lucide", async () => {
      // Current behavior: the blank line between the two import groups is dropped.
      expect(await transformIconsIn(spinnerSource, "lucide"))
        .toMatchInlineSnapshot(`
        "import { cn } from "cn"
        import { Loader2Icon } from "lucide-react"

        function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
          return (
            <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
          )
        }

        export { Spinner }"
      `)
    })

    test("tabler", async () => {
      expect(await transformIconsIn(spinnerSource, "tabler"))
        .toMatchInlineSnapshot(`
        "import { cn } from "cn"
        import { IconLoader } from "@tabler/icons-react"

        function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
          return (
            <IconLoader data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
          )
        }

        export { Spinner }"
      `)
    })

    test("hugeicons", async () => {
      expect(await transformIconsIn(spinnerSource, "hugeicons"))
        .toMatchInlineSnapshot(`
        "import { cn } from "cn"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Loading03Icon } from "@hugeicons/core-free-icons"

        function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
          return (
            <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
          )
        }

        export { Spinner }"
      `)
    })

    test("phosphor drops the usage strokeWidth default", async () => {
      // Current behavior: phosphor's usage default strokeWidth={2} is never applied.
      expect(await transformIconsIn(spinnerSource, "phosphor"))
        .toMatchInlineSnapshot(`
        "import { cn } from "cn"
        import { SpinnerIcon } from "@phosphor-icons/react"

        function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
          return (
            <SpinnerIcon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
          )
        }

        export { Spinner }"
      `)
    })

    test("remixicon", async () => {
      expect(await transformIconsIn(spinnerSource, "remixicon"))
        .toMatchInlineSnapshot(`
        "import { cn } from "cn"
        import { RiLoaderLine } from "@remixicon/react"

        function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
          return (
            <RiLoaderLine data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
          )
        }

        export { Spinner }"
      `)
    })
  })

  describe("registry checkbox (multi-line element with only library props)", () => {
    test("lucide keeps the newline before the closing slash", async () => {
      expect(await transformIconsIn(checkboxSource, "lucide"))
        .toMatchInlineSnapshot(`
        ""use client"

        import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
        import { cn } from "cn"
        import { CheckIcon } from "lucide-react"

        function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
          return (
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className={cn(
                "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              {...props}
            >
              <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="cn-checkbox-indicator grid place-content-center text-current transition-none"
              >
                <CheckIcon
                />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          )
        }

        export { Checkbox }"
      `)
    })

    test("hugeicons collapses the element onto one line", async () => {
      expect(await transformIconsIn(checkboxSource, "hugeicons"))
        .toMatchInlineSnapshot(`
        ""use client"

        import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
        import { cn } from "cn"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
          return (
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className={cn(
                "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              {...props}
            >
              <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="cn-checkbox-indicator grid place-content-center text-current transition-none"
              >
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          )
        }

        export { Checkbox }"
      `)
    })

    test("phosphor", async () => {
      expect(await transformIconsIn(checkboxSource, "phosphor"))
        .toMatchInlineSnapshot(`
        ""use client"

        import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
        import { cn } from "cn"
        import { CheckIcon } from "@phosphor-icons/react"

        function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
          return (
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className={cn(
                "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              {...props}
            >
              <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="cn-checkbox-indicator grid place-content-center text-current transition-none"
              >
                <CheckIcon
                />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          )
        }

        export { Checkbox }"
      `)
    })

    test("remixicon", async () => {
      expect(await transformIconsIn(checkboxSource, "remixicon"))
        .toMatchInlineSnapshot(`
        ""use client"

        import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
        import { cn } from "cn"
        import { RiCheckLine } from "@remixicon/react"

        function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
          return (
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className={cn(
                "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              {...props}
            >
              <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="cn-checkbox-indicator grid place-content-center text-current transition-none"
              >
                <RiCheckLine
                />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          )
        }

        export { Checkbox }"
      `)
    })
  })

  describe("attributes", () => {
    test("collapses a multi-line attribute list onto one line", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <IconPlaceholder
      lucide="CheckIcon"
      className="size-4"
      aria-hidden="true"
    />
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return (
            <CheckIcon className="size-4" aria-hidden="true" />
          )
        }"
      `)
    })

    test("re-indents a multi-line attribute value (lucide)", async () => {
      // Current behavior: lines after the first get extra indentation from ts-morph.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder
        lucide="CheckIcon"
        className={cn(
          "size-4",
          active && "text-primary"
        )}
      />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return (
            <div>
              <CheckIcon className={cn(
                            "size-4",
                            active && "text-primary"
                          )} />
            </div>
          )
        }"
      `)
    })

    test("re-indents a multi-line attribute value (hugeicons)", async () => {
      // Current behavior: lines after the first get extra indentation from ts-morph.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder
        hugeicons="Tick02Icon"
        className={cn(
          "size-4",
          active && "text-primary"
        )}
      />
    </div>
  )
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return (
            <div>
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className={cn(
                            "size-4",
                            active && "text-primary"
                          )} />
            </div>
          )
        }"
      `)
    })

    test("keeps user attributes before and after the library prop", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder className="size-4" lucide="CheckIcon" data-icon="inline-start" />
      <IconPlaceholder className="size-4" tabler="IconCheck" lucide="XIcon" />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon, XIcon } from "lucide-react"

        export function Component() {
          return (
            <div>
              <CheckIcon className="size-4" data-icon="inline-start" />
              <XIcon className="size-4" />
            </div>
          )
        }"
      `)
    })

    test("puts default props before user attributes (hugeicons)", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder className="size-4" hugeicons="Tick02Icon" data-icon="inline-start" />
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" data-icon="inline-start" />
        }"
      `)
    })

    test("keeps spread attributes (lucide)", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component(props: IconProps) {
  return (
    <div>
      <IconPlaceholder {...props} lucide="CheckIcon" />
      <IconPlaceholder lucide="XIcon" {...props} className="size-4" />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon, XIcon } from "lucide-react"

        export function Component(props: IconProps) {
          return (
            <div>
              <CheckIcon {...props} />
              <XIcon {...props} className="size-4" />
            </div>
          )
        }"
      `)
    })

    test("keeps spread attributes (hugeicons)", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component(props: IconProps) {
  return <IconPlaceholder {...props} hugeicons="Tick02Icon" strokeWidth={1.5} />
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component(props: IconProps) {
          return <HugeiconsIcon icon={Tick02Icon} {...props} strokeWidth={1.5} />
        }"
      `)
    })

    test("accepts a single-quoted library prop", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide='CheckIcon' className='size-4' />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon className='size-4' />
        }"
      `)
    })

    test("skips boolean and empty library props", async () => {
      // Current behavior: the placeholder import is removed although both elements remain.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder lucide />
      <IconPlaceholder lucide="" />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <IconPlaceholder lucide />
              <IconPlaceholder lucide="" />
            </div>
          )
        }"
      `)
    })

    test("throws on a non-literal library prop (lucide)", async () => {
      // Current behavior: the expression text becomes the tag name and ts-morph throws.
      await expect(
        transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide={icon.lucide} />
}`,
          "lucide"
        )
      ).rejects.toThrow(/^Manipulation error: A syntax error was inserted\./)
    })

    test("throws on a quoted expression library prop (lucide)", async () => {
      // Current behavior: only bare quotes are stripped, so {"CheckIcon"} becomes the tag name.
      await expect(
        transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide={"CheckIcon"} />
}`,
          "lucide"
        )
      ).rejects.toThrow(/^Manipulation error: A syntax error was inserted\./)
    })

    test("emits invalid code for a non-literal library prop (hugeicons)", async () => {
      // Current behavior: invalid import and icon value; only the second import keeps its semicolon.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <IconPlaceholder
      lucide={icon.lucide}
      hugeicons={icon.hugeicons}
    />
  )
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { {icon.hugeicons} } from "@hugeicons/core-free-icons";

        export function Component() {
          return (
            <HugeiconsIcon icon={{icon.hugeicons}} strokeWidth={2} />
          )
        }"
      `)
    })
  })

  describe("elements", () => {
    test("ignores other self-closing elements and non-self-closing placeholders", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <Spinner />
      <IconPlaceholder lucide="CheckIcon"></IconPlaceholder>
      <Button icon={<IconPlaceholder lucide="XIcon" />} />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { XIcon } from "lucide-react"

        export function Component() {
          return (
            <div>
              <Spinner />
              <IconPlaceholder lucide="CheckIcon"></IconPlaceholder>
              <Button icon={<XIcon />} />
            </div>
          )
        }"
      `)
    })

    test("transforms only icons with the library prop and dedupes names", async () => {
      // Current behavior: the placeholder import is removed although one IconPlaceholder remains.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder lucide="CheckIcon" />
      <IconPlaceholder tabler="IconX" />
      <IconPlaceholder lucide="CheckIcon" className="size-4" />
      <IconPlaceholder lucide="ArrowDownIcon" />
    </div>
  )
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon, ArrowDownIcon } from "lucide-react"

        export function Component() {
          return (
            <div>
              <CheckIcon />
              <IconPlaceholder tabler="IconX" />
              <CheckIcon className="size-4" />
              <ArrowDownIcon />
            </div>
          )
        }"
      `)
    })

    test("does not add an import when no icon matches the library", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder tabler="IconX" />
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <IconPlaceholder tabler="IconX" />
        }"
      `)
    })

    test("emits invalid code for non-literal props on a multi-line element (registry icon-preview-grid)", async () => {
      // Current behavior: the expression text becomes the tag name and an import name.
      const raw = `"use client"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function Grid() {
  return (
    <div>
      {PREVIEW_ICONS.map((icon, index) => (
        <div key={index}>
          <IconPlaceholder
            lucide={icon.lucide}
            tabler={icon.tabler}
            hugeicons={icon.hugeicons}
          />
        </div>
      ))}
    </div>
  )
}`
      expect(await transformIconsIn(raw, "lucide")).toMatchInlineSnapshot(`
        "import { {icon.lucide} } from "lucide-react";

        "use client"

        export function Grid() {
          return (
            <div>
              {PREVIEW_ICONS.map((icon, index) => (
                <div key={index}>
                  <{icon.lucide}
                  />
                </div>
              ))}
            </div>
          )
        }"
      `)
    })

    test("throws when a replaced placeholder holds an element in a prop", async () => {
      // Current behavior: ts-morph forgets the nested element and throws when it reaches it.
      await expect(
        transformIconsIn(
          `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const icon = (
  <IconPlaceholder
    render={<span className="a" />}
    lucide="CheckIcon"
    tabler="IconCheck"
  />
)
`,
          "tabler"
        )
      ).rejects.toThrow(
        /^Attempted to get information from a node that was removed or forgotten\./
      )
    })

    test("is a no-op for a legacy icon library", async () => {
      const raw = `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" radix="CheckIcon" />
}`
      expect(await transformIconsIn(raw, "radix")).toBe(raw)
    })
  })

  describe("imports", () => {
    test("inserts the new import above use client when the placeholder import was the only import", async () => {
      // Current behavior: the new import lands above "use client" and keeps its semicolon.
      expect(
        await transformIconsIn(
          `"use client"

import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import { CheckIcon } from "lucide-react";

        "use client"

        export function Component() {
          return <CheckIcon />
        }"
      `)
    })

    test("inserts both hugeicons imports above use client when the placeholder import was the only import", async () => {
      // Current behavior: the new imports land above "use client" and keep their semicolons.
      expect(
        await transformIconsIn(
          `"use client"

import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" />
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import { HugeiconsIcon } from "@hugeicons/react";
        import { Tick02Icon } from "@hugeicons/core-free-icons";

        "use client"

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        }"
      `)
    })

    test("inserts the new import at the top when the placeholder import was the only import", async () => {
      expect(
        await transformIconsIn(
          `import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import { CheckIcon } from "lucide-react";

        export function Component() {
          return <CheckIcon />
        }"
      `)
    })

    test("edits the imports after a placeholder between them", async () => {
      expect(
        await transformIconsIn(
          `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
export const icon = <IconPlaceholder lucide="CheckIcon" />
import { cn } from "@/lib/utils"
`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "export const icon = <CheckIcon />
        import { cn } from "@/lib/utils"
        import { CheckIcon } from "lucide-react"
        "
      `)
    })

    test("drops a leading comment header", async () => {
      // Current behavior: the runner returns getText(), which drops the leading comment.
      expect(
        await transformIconsIn(
          `/**
 * Icon demo.
 */
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon />
        }"
      `)
    })

    test("orphans the leading comment and drops the trailing comment of the removed import", async () => {
      // Current behavior: the removed import's own-line comment stays behind; its trailing comment is lost.
      expect(
        await transformIconsIn(
          `"use client"

// React.
import * as React from "react"
// The placeholder is swapped for the icon library.
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder" // trailing
/* Utils. */
import { cn } from "@/lib/utils"

// Component.
export function Component() {
  return <IconPlaceholder lucide="CheckIcon" className={cn("size-4")} />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        ""use client"

        // React.
        import * as React from "react"
        // The placeholder is swapped for the icon library.
        /* Utils. */
        import { cn } from "@/lib/utils"
        import { CheckIcon } from "lucide-react"

        // Component.
        export function Component() {
          return <CheckIcon className={cn("size-4")} />
        }"
      `)
    })

    test("keeps other named imports from the icon-placeholder module", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder, iconSize } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" className={iconSize} />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { iconSize } from "@/app/(create)/create/components/icon-placeholder"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon className={iconSize} />
        }"
      `)
    })

    test("removes the placeholder from a multi-line specifier list", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import {
  IconPlaceholder,
  iconSize,
  type IconPlaceholderProps,
} from "@/app/(create)/create/components/icon-placeholder"
import {
  Button,
  buttonVariants,
} from "@/components/ui/button"

export function Component(props: IconPlaceholderProps) {
  return <IconPlaceholder lucide="CheckIcon" className={iconSize} />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import {
          iconSize,
          type IconPlaceholderProps,
        } from "@/app/(create)/create/components/icon-placeholder"
        import {
          Button,
          buttonVariants,
        } from "@/components/ui/button"
        import { CheckIcon } from "lucide-react"

        export function Component(props: IconPlaceholderProps) {
          return <CheckIcon className={iconSize} />
        }"
      `)
    })

    test("removes the placeholder when it is last in a multi-line specifier list", async () => {
      // Current behavior: the trailing comma of the list is dropped.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import {
  iconSize,
  IconPlaceholder,
} from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" className={iconSize} />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import {
          iconSize
        } from "@/app/(create)/create/components/icon-placeholder"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon className={iconSize} />
        }"
      `)
    })

    test("removes a default import from the icon-placeholder module", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import IconPlaceholder from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <CheckIcon />
        }"
      `)
    })

    test("removes a default import together with the placeholder specifier", async () => {
      // Current behavior: the default import is removed too once no named imports remain.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import Icons, { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <Icons.Root><IconPlaceholder lucide="CheckIcon" /></Icons.Root>
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <Icons.Root><CheckIcon /></Icons.Root>
        }"
      `)
    })

    test("adds a separate import when the library is already imported", async () => {
      // Current behavior: a second import from lucide-react is added instead of merging.
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { XIcon } from "lucide-react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <div><XIcon /><IconPlaceholder lucide="CheckIcon" /></div>
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { XIcon } from "lucide-react"
        import { CheckIcon } from "lucide-react"

        export function Component() {
          return <div><XIcon /><CheckIcon /></div>
        }"
      `)
    })

    test("normalizes blank lines after the removed import", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"


const sizes = ["size-4"]

export function Component() {
  return <IconPlaceholder lucide="CheckIcon" className={sizes[0]} />
}`,
          "lucide"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { CheckIcon } from "lucide-react"

        const sizes = ["size-4"]

        export function Component() {
          return <CheckIcon className={sizes[0]} />
        }"
      `)
    })

    test("removes a placeholder import between import groups", async () => {
      // Current behavior: the blank lines separating the import groups are dropped.
      expect(
        await transformIconsIn(
          `import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

import { Button } from "@/components/ui/button"

export function Component() {
  return <Button><IconPlaceholder hugeicons="Tick02Icon" /></Button>
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { Button } from "@/components/ui/button"
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <Button><HugeiconsIcon icon={Tick02Icon} strokeWidth={2} /></Button>
        }"
      `)
    })

    test("uses the first import to decide on semicolons (no semicolon first)", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react"
import { cn } from "@/lib/utils";
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" className={cn("size-4")} />;
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { cn } from "@/lib/utils";
        import { HugeiconsIcon } from "@hugeicons/react"
        import { Tick02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className={cn("size-4")} />;
        }"
      `)
    })

    test("uses the first import to decide on semicolons (semicolon first)", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react";
import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" className={cn("size-4")} />
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react";
        import { cn } from "@/lib/utils"
        import { HugeiconsIcon } from "@hugeicons/react";
        import { Tick02Icon } from "@hugeicons/core-free-icons";

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className={cn("size-4")} />
        }"
      `)
    })

    test("keeps semicolons on hugeicons imports in a semicolon file", async () => {
      expect(
        await transformIconsIn(
          `import * as React from "react";
import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder hugeicons="Tick02Icon" />;
}`,
          "hugeicons"
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react";
        import { HugeiconsIcon } from "@hugeicons/react";
        import { Tick02Icon } from "@hugeicons/core-free-icons";

        export function Component() {
          return <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />;
        }"
      `)
    })
  })

  describe("line endings", () => {
    test("CRLF input (lucide)", async () => {
      // Current behavior: the rewritten import region uses LF while the rest keeps CRLF.
      expect(
        JSON.stringify(
          await transformIconsIn(
            [
              `import * as React from "react"`,
              `import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"`,
              ``,
              `export function Component() {`,
              `  return (`,
              `    <IconPlaceholder`,
              `      lucide="CheckIcon"`,
              `      className="size-4"`,
              `    />`,
              `  )`,
              `}`,
            ].join("\r\n"),
            "lucide"
          )
        )
      ).toMatchInlineSnapshot(
        `""import * as React from \\"react\\"\\nimport { CheckIcon } from \\"lucide-react\\"\\n\\nexport function Component() {\\r\\n  return (\\r\\n    <CheckIcon className=\\"size-4\\" />\\r\\n  )\\r\\n}""`
      )
    })

    test("CRLF input (hugeicons)", async () => {
      // Current behavior: re-indented replacement lines and the import region use LF.
      expect(
        JSON.stringify(
          await transformIconsIn(
            [
              `import * as React from "react"`,
              `import { IconPlaceholder } from "@/app/(create)/create/components/icon-placeholder"`,
              ``,
              `export function Component() {`,
              `  return (`,
              `    <IconPlaceholder`,
              `      hugeicons="Tick02Icon"`,
              `      className={cn(`,
              `        "size-4"`,
              `      )}`,
              `    />`,
              `  )`,
              `}`,
            ].join("\r\n"),
            "hugeicons"
          )
        )
      ).toMatchInlineSnapshot(
        `""import * as React from \\"react\\"\\nimport { HugeiconsIcon } from \\"@hugeicons/react\\"\\nimport { Tick02Icon } from \\"@hugeicons/core-free-icons\\"\\n\\nexport function Component() {\\r\\n  return (\\r\\n    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className={cn(\\n              \\"size-4\\"\\n            )} />\\r\\n  )\\r\\n}""`
      )
    })
  })
})
