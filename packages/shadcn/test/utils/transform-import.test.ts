import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"


test('transform nested workspace folder for utils, website/src/utils', async () => {
  expect(
    await transform({
      filename: "test.ts",

      raw: `import { Button } from "website/src/components/ui/button"
      import { Box } from "website/src/components/box"
      import { cn } from "website/src/utils"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "neutral",
          cssVariables: true,
        },
        aliases: {
          components: "website/src/components",
          lib: "website/src/lib",
          utils: "website/src/utils",
        },
      },
    })
  ).toMatchInlineSnapshot(`
    "import { Button } from "website/src/components/ui/button"
          import { Box } from "website/src/components/box"
          import { cn } from "website/src/utils"
        "
  `)

})

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

test("transform import for monorepo", async () => {
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
          components: "@workspace/ui/components",
          utils: "@workspace/ui/lib/utils",
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
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "neutral",
          cssVariables: true,
        },
        aliases: {
          components: "@repo/ui/components",
          utils: "@repo/ui/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()
})

test("transform async/dynamic imports", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Button } from "@/registry/new-york/ui/button"

async function loadComponent() {
  const { cn } = await import("@/lib/utils")
  const module = await import("@/registry/new-york/ui/card")
  return module
}

function lazyLoad() {
  return import("@/registry/new-york/ui/dialog").then(module => module)
}
    `,
      config: {
        tsx: true,
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
      raw: `import { Button } from "@/registry/new-york/ui/button"

async function loadUtils() {
  const utils = await import("@/lib/utils")
  const { cn } = await import("@/lib/utils")
  return { utils, cn }
}

const dialogPromise = import("@/registry/new-york/ui/dialog")
const cardModule = import("@/registry/new-york/ui/card")
    `,
      config: {
        tsx: true,
        aliases: {
          components: "~/components",
          utils: "~/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()
})

test("transform dynamic imports with cn utility", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `async function loadCn() {
  const { cn } = await import("@/lib/utils")
  return cn
}

async function loadMultiple() {
  const utils1 = await import("@/lib/utils")
  const { cn, twMerge } = await import("@/lib/utils")
  const other = await import("@/lib/other")
}
    `,
      config: {
        tsx: true,
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
      raw: `async function loadWorkspaceCn() {
  const { cn } = await import("@/lib/utils")
  return cn
}
    `,
      config: {
        tsx: true,
        aliases: {
          components: "@workspace/ui/components",
          utils: "@workspace/ui/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()
})

test("transform re-exports with dynamic imports", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `export { cn } from "@/lib/utils"
export { Button } from "@/registry/new-york/ui/button"

async function load() {
  const module = await import("@/registry/new-york/ui/card")
  return module
}
    `,
      config: {
        tsx: true,
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    })
  ).toMatchSnapshot()
})
