import type { Config } from "@/src/utils/get-config"
import { expect, it } from "vitest"

import { transform } from "."

it("transform nested workspace folder for utils, website/src/utils", async () => {
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
      } as Config,
    })
  ).toMatchInlineSnapshot(`
    "import { Button } from "website/src/components/ui/button"
          import { Box } from "website/src/components/box"
          import { cn } from "website/src/utils"
        "
  `)
})

it.each([
  {
    name: "bare aliases",
    aliases: {
      components: "components",
      ui: "components/ui",
      lib: "lib",
      utils: "lib/utils",
    },
    buttonImport: `import { Button } from "components/ui/button"`,
    utilsImport: `import { cn } from "lib/utils"`,
  },
  {
    name: "path-like aliases",
    aliases: {
      components: "website/src/components",
      ui: "website/src/components/ui",
      lib: "website/src/lib",
      utils: "website/src/lib/utils",
    },
    buttonImport: `import { Button } from "website/src/components/ui/button"`,
    utilsImport: `import { cn } from "website/src/lib/utils"`,
  },
])(
  "transform import with non-sigil aliases: $name",
  async ({ aliases, buttonImport, utilsImport }) => {
    const result = await transform({
      filename: "test.ts",
      raw: `import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"
`,
      config: {
        tsx: true,
        aliases,
      } as Config,
    })

    expect(result).toContain(buttonImport)
    expect(result).toContain(utilsImport)
  }
)

it("transform import", async () => {
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
    })
  ).toMatchSnapshot()
})

it("transform import with configured package-import aliases", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import { Button } from "#app/components/ui/button"
import { cn } from "#app/lib/utils"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#app/components",
          ui: "#app/components/ui",
          lib: "#app/lib",
          utils: "#app/lib/utils",
        },
      } as Config,
    })
  ).toMatchInlineSnapshot(`
    "import { Button } from "#app/components/ui/button"
    import { cn } from "#app/lib/utils"
    "
  `)
})

it("transform import keeps exact #utils aliases", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import { cn } from "@/lib/utils"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          utils: "#utils",
          ui: "#components/ui",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toMatchInlineSnapshot(`
    "import { cn } from "#utils"
    "
  `)
})

it("transform import keeps #lib/utils aliases", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import { cn } from "@/lib/utils"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          utils: "#lib/utils",
          ui: "#components/ui",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toMatchInlineSnapshot(`
    "import { cn } from "#lib/utils"
    "
  `)
})

it("transform import for monorepo", async () => {
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
      } as Config,
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
      } as Config,
    })
  ).toMatchSnapshot()
})

it("transform package import aliases and #registry placeholders", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import { Button } from "#registry/new-york/ui/button"
import { Card } from "#/registry/new-york/ui/card"
import * as RegistryRoot from "#registry"
import * as RegistryRootCompat from "#/registry"
import { cn } from "#utils"
import { helper } from "#lib/helpers"
import { useThing } from "#hooks/use-thing"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          ui: "#components/ui",
          utils: "#utils",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toContain(`import { Button } from "#components/ui/button"`)

  expect(
    await transform({
      filename: "test.ts",
      raw: `import { Button } from "#registry/new-york/ui/button"
import { Card } from "#/registry/new-york/ui/card"
import * as RegistryRoot from "#registry"
import * as RegistryRootCompat from "#/registry"
import { cn } from "#utils"
import { helper } from "#lib/helpers"
import { useThing } from "#hooks/use-thing"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          ui: "#components/ui",
          utils: "#utils",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toContain(`import { Card } from "#components/ui/card"`)

  expect(
    await transform({
      filename: "test.ts",
      raw: `import { Button } from "#registry/new-york/ui/button"
import { Card } from "#/registry/new-york/ui/card"
import * as RegistryRoot from "#registry"
import * as RegistryRootCompat from "#/registry"
import { cn } from "#utils"
import { helper } from "#lib/helpers"
import { useThing } from "#hooks/use-thing"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          ui: "#components/ui",
          utils: "#utils",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toContain(`import { cn } from "#utils"`)

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as RegistryRoot from "#registry"
import * as RegistryRootCompat from "#/registry"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          ui: "#components/ui",
          utils: "#utils",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toContain(`import * as RegistryRoot from "#components"`)

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as RegistryRoot from "#registry"
import * as RegistryRootCompat from "#/registry"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          ui: "#components/ui",
          utils: "#utils",
          lib: "#lib",
          hooks: "#hooks",
        },
      } as Config,
    })
  ).toContain(`import * as RegistryRootCompat from "#components"`)
})

it("prefers explicit workspace utils alias over local lib alias", async () => {
  expect(
    await transform({
      filename: "test.tsx",
      raw: `import { cn } from "@/lib/utils"
import { helper } from "@/lib/helper"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          lib: "#lib",
          hooks: "#hooks",
          ui: "@workspace/ui/components",
          utils: "@workspace/ui/lib/utils",
        },
      } as Config,
    })
  ).toContain(`import { cn } from "@workspace/ui/lib/utils"`)
})

it("prefers explicit utils alias for registry lib utils imports", async () => {
  expect(
    await transform({
      filename: "login-form.tsx",
      raw: `import { cn } from "@/registry/new-york-v4/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
`,
      config: {
        tsx: true,
        aliases: {
          components: "#components",
          lib: "#lib",
          hooks: "#hooks",
          ui: "@workspace/ui/components",
          utils: "@workspace/ui/lib/utils",
        },
      } as Config,
    })
  ).toContain(`import { cn } from "@workspace/ui/lib/utils"`)
})

it("transform async/dynamic imports", async () => {
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
      } as Config,
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
      } as Config,
    })
  ).toMatchSnapshot()
})

it("transform dynamic imports with cn utility", async () => {
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
      } as Config,
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
      } as Config,
    })
  ).toMatchSnapshot()
})

it("does not rewrite foreign scoped package imports when project uses # aliases", async () => {
  const result = await transform({
    filename: "test.tsx",
    raw: `import { Analytics } from "@vercel/analytics/react"
import posthog from "posthog-js"
import { motion } from "motion/react"
import { Button } from "@/registry/new-york-v4/ui/button"
`,
    config: {
      tsx: true,
      aliases: {
        components: "#components",
        ui: "#components/ui",
        utils: "#utils",
        lib: "#lib",
        hooks: "#hooks",
      },
    } as Config,
  })

  expect(result).toContain(
    `import { Analytics } from "@vercel/analytics/react"`
  )
  expect(result).toContain(`import posthog from "posthog-js"`)
  expect(result).toContain(`import { motion } from "motion/react"`)
  expect(result).toContain(`import { Button } from "#components/ui/button"`)
})

it("does not rewrite workspace package exports when project uses # aliases", async () => {
  const result = await transform({
    filename: "test.tsx",
    raw: `import { Card } from "@workspace/ui/components/card"
import { useTheme } from "@workspace/ui/hooks/use-theme"
import { Button } from "@/registry/new-york-v4/ui/button"
`,
    config: {
      tsx: true,
      aliases: {
        components: "#components",
        ui: "@workspace/ui/components",
        utils: "@workspace/ui/lib/utils",
        lib: "#lib",
        hooks: "#hooks",
      },
    } as Config,
  })

  expect(result).toContain(
    `import { Card } from "@workspace/ui/components/card"`
  )
  expect(result).toContain(
    `import { useTheme } from "@workspace/ui/hooks/use-theme"`
  )
  expect(result).toContain(
    `import { Button } from "@workspace/ui/components/button"`
  )
})

it("transform re-exports with dynamic imports", async () => {
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
      } as Config,
    })
  ).toMatchSnapshot()
})
