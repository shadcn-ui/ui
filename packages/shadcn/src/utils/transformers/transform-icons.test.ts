import { type Config } from "@/src/utils/get-config"
import { transformIcons } from "@/src/utils/transformers/transform-icons"
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
