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
    config: "tailwind.config.ts",
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
    tailwindConfig: "tailwind.config.ts",
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder icon="CheckIcon" /></div>
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" className="size-4" aria-label="check" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder icon="CheckIcon" />
      <IconPlaceholder icon="ArrowDownIcon" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />;
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder icon="CheckIcon" /></div>
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" className="size-4" aria-label="check" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder icon="CheckIcon" />
      <IconPlaceholder icon="ArrowDownIcon" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder";

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />;
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <div><IconPlaceholder icon="CheckIcon" /></div>
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
        import { Tick01Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <div><HugeiconsIcon icon={Tick01Icon} strokeWidth={2} /></div>
        }"
      `)
    })

    test("preserves className and other props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" className="size-4" />
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
        import { Tick01Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} className="size-4" />
        }"
      `)
    })

    test("does not add strokeWidth if already present", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" strokeWidth={4} />
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
        import { Tick01Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return <HugeiconsIcon icon={Tick01Icon} strokeWidth={4} />
        }"
      `)
    })

    test("handles multiple icons", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return (
    <div>
      <IconPlaceholder icon="CheckIcon" />
      <IconPlaceholder icon="ArrowDownIcon" />
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
        import { Tick01Icon, ArrowDown02Icon } from "@hugeicons/core-free-icons"

        export function Component() {
          return (
            <div>
              <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />
}`,
          config: testConfig,
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

      export function Component() {
        return <IconPlaceholder icon="CheckIcon" />
      }"
    `)
  })

  test("skips icons not in mapping", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="NonExistentIcon" />
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
        return <IconPlaceholder icon="NonExistentIcon" />
      }"
    `)
  })

  test("handles props with spaces in values", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" aria-label="check icon here" className="size-4" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />
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
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />
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
      import { Tick01Icon } from "@hugeicons/core-free-icons"

      export function Component() {
        return <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} />
      }"
    `)
  })

  test("throws InvalidConfigIconLibraryError for invalid icon library", async () => {
    await expect(
      transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export function Component() {
  return <IconPlaceholder icon="CheckIcon" />
}`,
          config: {
            ...testConfig,
            iconLibrary: "invalid-library",
          },
        },
        [transformIcons]
      )
    ).rejects.toMatchObject({
      name: "InvalidConfigIconLibraryError",
      message: 'Invalid icon library "invalid-library". Valid options are: lucide, tabler, hugeicons',
      code: "INVALID_CONFIG",
    })
  })
})
