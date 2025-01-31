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
import { Foo } from "bar"
    import { Button } from "@/components/ui/button"
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
          components: "@custom-alias/components",
          utils: "@custom-alias/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()
})

test("transform import - multi path aliases", async () => {
  const aliases = {
    "components": "@custom-alias/nested/ui/components/ui",
    "utils": "@custom-alias/nested/ui/lib/utils",
    "ui": "@custom-alias/nested/ui/components/ui",
    "hooks": "@custom-alias/nested/ui/hooks",
    "lib": "@custom-alias/nested/ui/lib"
  }
  const actual = await transform({
    filename: "test.ts",
    raw: `import * as React from "react"
import { Foo } from "bar"
  import { Button } from "@/registry/new-york/ui/button"
  import { Label} from "ui/label"
  import { Box } from "@/registry/new-york/box"
  import { useIsMobile } from "@/registry/new-york/hooks/use-mobile"

  import { bar } from "@/registry/new-york/lib/bar"
  import { cn } from "@/lib/utils"
  `,
    config: {
      tsx: true,
      aliases,
    },
  })

  expect(actual).toContain(`import { cn } from "${aliases.utils}"`)
  expect(actual).toContain(`import { Button } from "${aliases.ui}/button"`)
  expect(actual).toContain(`import { Box } from "${aliases.components}/box"`)
  expect(actual).toContain(`import { useIsMobile } from "${aliases.hooks}/use-mobile"`)
  expect(actual).toContain(`import { bar } from "${aliases.lib}/bar"`)
})
