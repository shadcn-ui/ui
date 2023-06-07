import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"

test("transform import", async () => {
  expect(
    await transform(
      "test.ts",
      `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    `,
      {
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await transform(
      "test.ts",
      `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn, foo, bar } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      {
        aliases: {
          components: "~/src/components",
          utils: "~/lib",
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await transform(
      "test.ts",
      `import * as React from "react"
import { Foo } from "bar"
    import { Button } from "@/registry/new-york/ui/button"
    import { Label} from "ui/label"
    import { Box } from "@/registry/new-york/box"

    import { cn } from "@/lib/utils"
    import { bar } from "@/lib/utils/bar"
    `,
      {
        aliases: {
          components: "~/src/components",
          utils: "~/src/utils",
        },
      }
    )
  ).toMatchSnapshot()
})

test("transform rsc", async () => {
  expect(
    await transform(
      "test.ts",
      `import * as React from "react"
import { Foo } from "bar"
    `,
      {
        rsc: true,
      }
    )
  ).toMatchSnapshot()

  expect(
    await transform(
      "test.ts",
      `"use client"

      import * as React from "react"
import { Foo } from "bar"
    `,
      {
        rsc: true,
      }
    )
  ).toMatchSnapshot()

  expect(
    await transform(
      "test.ts",
      `"use client"

      import * as React from "react"
import { Foo } from "bar"
    `,
      {
        rsc: false,
      }
    )
  ).toMatchSnapshot()

  expect(
    await transform(
      "test.ts",
      `"use foo"

      import * as React from "react"
import { Foo } from "bar"

"use client"
    `,
      {
        rsc: false,
      }
    )
  ).toMatchSnapshot()
})
