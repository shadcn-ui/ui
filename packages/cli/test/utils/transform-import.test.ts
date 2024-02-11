import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"

test("transform import", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "neutral",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn, foo, bar } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      config: {
        tsx: true,
        aliases: {
          components: "~/src/components",
          utils: "~/lib",
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      config: {
        tsx: true,
        aliases: {
          components: "~/src/components",
          utils: "~/src/utils",
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      config: {
        tsx: true,
        aliases: {
          components: "~/src/components",
          utils: "~/src/utils",
          ui: "~/src/components",
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      config: {
        tsx: true,
        aliases: {
          components: "~/src/components",
          utils: "~/src/utils",
          ui: "~/src/ui",
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
    import { AlertDialog } from "@/registry/new-york/ui/alert-dialog"
    import { Toaster } from "@/registry/new-york/ui/toaster"
    import { useToast } from "@/registry/new-york/ui/use-toast"
    `,
      config: {
        tsx: true,
        case: "pascal",
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
        },
        aliases: {
          components: "@/components"
        },
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
      import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
      } from "@/registry/new-york/ui/dropdown-menu"
    `,
      config: {
        tsx: true,
        case: "snake",
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
        },
        aliases: {
          components: "@/components"
        },
      },
    })
  ).toMatchSnapshot()
})
