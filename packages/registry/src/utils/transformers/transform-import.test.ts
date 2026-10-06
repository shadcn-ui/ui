import type { Config } from "@/src/utils/get-config"
import { describe, expect, it } from "vitest"

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

it.each([
  {
    name: "default aliases",
    isRemote: false,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
  },
  {
    name: "monorepo aliases",
    isRemote: false,
    aliases: {
      components: "@workspace/ui/components",
      utils: "@workspace/ui/lib/utils",
      ui: "@workspace/ui/components",
      lib: "@workspace/ui/lib",
      hooks: "@workspace/ui/hooks",
    },
  },
  {
    name: "package imports aliases",
    isRemote: false,
    aliases: {
      components: "#components",
      utils: "#lib/utils",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
    },
  },
  {
    name: "remote registry",
    isRemote: true,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
  },
])(
  "leaves the cn package import untouched: $name",
  async ({ aliases, isRemote }) => {
    const result = await transform({
      filename: "test.ts",
      raw: `import { cn } from "cn"
import { Button } from "@/registry/new-york/ui/button"
`,
      config: {
        tsx: true,
        aliases,
      } as Config,
      isRemote,
    })

    expect(result).toContain(`import { cn } from "cn"`)
    expect(result).not.toContain("lib/utils")
  }
)

describe("transformImport characterization", () => {
  const config = {
    tsx: true,
    aliases: {
      components: "~/components",
      ui: "~/components/ui",
      utils: "~/lib/utils",
      lib: "~/lib",
      hooks: "~/hooks",
    },
  } as Config

  const raw = `import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"
`

  it.each([
    {
      filename: "button.tsx",
      expected: `import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
`,
    },
    {
      filename: "button.ts",
      expected: `import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
`,
    },
    // Current behavior: .js/.jsx pass the extension check, but ts-morph
    // collects no import literals for them (allowJs is off), so nothing changes.
    { filename: "button.js", expected: raw },
    { filename: "button.jsx", expected: raw },
    // These fail the extension check (getExtension() returns ".d.ts" for .d.ts).
    { filename: "button.mjs", expected: raw },
    { filename: "button.mts", expected: raw },
    { filename: "button.d.ts", expected: raw },
    { filename: "button.css", expected: raw },
    { filename: "button.mdx", expected: raw },
  ])("filename extension: $filename", async ({ filename, expected }) => {
    expect(await transform({ filename, raw, config })).toBe(expected)
  })

  it("leaves CSS @import specifiers alone", async () => {
    const css = `@import "tailwindcss";
@import "@/registry/new-york/styles/theme.css";
`
    expect(await transform({ filename: "globals.css", raw: css, config })).toBe(
      css
    )
  })

  it("keeps single quotes and semicolons", async () => {
    expect(
      await transform({
        filename: "button.tsx",
        raw: `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Badge } from '@/registry/new-york/ui/badge';
export { Label } from '@/components/ui/label';
`,
        config,
      })
    ).toMatchInlineSnapshot(`
      "import * as React from 'react';
      import { Slot } from '@radix-ui/react-slot';
      import { cn } from '~/lib/utils';
      import { Badge } from '~/components/ui/badge';
      export { Label } from '~/components/ui/label';
      "
    `)
  })

  it("keeps CRLF line endings", async () => {
    expect(
      await transform({
        filename: "button.tsx",
        raw: `import * as React from "react"\r\nimport { Button } from "@/registry/new-york/ui/button"\r\nimport { cn } from "@/lib/utils"\r\n\r\nexport { Button, cn }\r\n`,
        config,
      })
    ).toBe(
      `import * as React from "react"\r\nimport { Button } from "~/components/ui/button"\r\nimport { cn } from "~/lib/utils"\r\n\r\nexport { Button, cn }\r\n`
    )
  })

  it("rewrites every import literal kind ts-morph collects", async () => {
    expect(
      await transform({
        filename: "kinds.tsx",
        raw: `import Default from "@/components/foo"
import type { Props } from "@/components/ui/button"
import "@/styles/globals.css"
import * as Icons from "@/registry/new-york/icons"
import json from "@/lib/data.json" with { type: "json" }
export * from "@/lib/helpers"
export * as mobile from "@/hooks/use-mobile"
export { a } from "@/hooks/use-a"
export type { B } from "@/components/b"
import legacy = require("@/lib/legacy")
const lazy = import("@/components/lazy")
const tpl = import(\`@/components/template\`)
type Mod = typeof import("@/components/mod")
type Named = import("@/components/named").Named
const required = require("@/lib/required")
const notAnImport = "@/components/string"
declare module "@/components/augmented" {
  import { X } from "@/components/x"
}
`,
        config,
      })
    ).toMatchInlineSnapshot(`
      "import Default from "~/components/foo"
      import type { Props } from "~/components/ui/button"
      import "~/styles/globals.css"
      import * as Icons from "~/components/icons"
      import json from "~/lib/data.json" with { type: "json" }
      export * from "~/lib/helpers"
      export * as mobile from "~/hooks/use-mobile"
      export { a } from "~/hooks/use-a"
      export type { B } from "~/components/b"
      import legacy = require("~/lib/legacy")
      const lazy = import("~/components/lazy")
      const tpl = import(\`~/components/template\`)
      type Mod = typeof import("~/components/mod")
      type Named = import("~/components/named").Named
      const required = require("@/lib/required")
      const notAnImport = "@/components/string"
      declare module "@/components/augmented" {
        import { X } from "@/components/x"
      }
      "
    `)
  })

  it("isRemote treats @/ imports as coming from a registry", async () => {
    expect(
      await transform({
        filename: "remote.tsx",
        raw: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import { useMobile } from "@/hooks/use-mobile"
import { Card } from "@/registry/new-york/ui/card"
import { helper } from "./helper"
import { data } from "@/data/items"
`,
        config,
        isRemote: true,
      })
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { Button } from "~/components/ui/button"
      import { Sidebar } from "~/components/sidebar"
      import { cn } from "~/lib/utils"
      import { formatDate } from "~/lib/format"
      import { useMobile } from "~/hooks/use-mobile"
      import { Card } from "~/components/ui/card"
      import { helper } from "./helper"
      import { data } from "~/components/data/items"
      "
    `)
  })

  it("registry components, lib and hooks paths", async () => {
    expect(
      await transform({
        filename: "page.tsx",
        raw: `import { LoginForm } from "@/registry/new-york/blocks/login-01/components/login-form"
import { SiteHeader } from "@/registry/new-york/components/site-header"
import { formatDate } from "@/registry/new-york/lib/format"
import { cn } from "@/registry/new-york/lib/utils"
import { useMobile } from "@/registry/new-york/hooks/use-mobile"
import { Example } from "@/registry/new-york/examples/example"
`,
        config,
      })
    ).toMatchInlineSnapshot(`
      "import { LoginForm } from "~/components/login-form"
      import { SiteHeader } from "~/components/site-header"
      import { formatDate } from "~/lib/format"
      import { cn } from "~/lib/utils"
      import { useMobile } from "~/hooks/use-mobile"
      import { Example } from "~/components/examples/example"
      "
    `)
  })

  it("registry lib and hooks paths fall back to components without lib/hooks aliases", async () => {
    expect(
      await transform({
        filename: "page.tsx",
        raw: `import { formatDate } from "@/registry/new-york/lib/format"
import { cn } from "@/registry/new-york/lib/utils"
import { useMobile } from "@/registry/new-york/hooks/use-mobile"
import { Button } from "@/registry/new-york/ui/button"
`,
        config: {
          tsx: true,
          aliases: {
            components: "~/components",
            utils: "~/lib/utils",
          },
        } as Config,
      })
    ).toMatchInlineSnapshot(`
      "import { formatDate } from "~/components/lib/format"
      import { cn } from "~/lib/utils"
      import { useMobile } from "~/components/hooks/use-mobile"
      import { Button } from "~/components/ui/button"
      "
    `)
  })

  it("registry /ui match has no segment boundary", async () => {
    // Current behavior: "/ui" also matches the start of "/uikit".
    expect(
      await transform({
        filename: "page.tsx",
        raw: `import { Kit } from "@/registry/new-york/components/uikit"
`,
        config: {
          tsx: true,
          aliases: {
            components: "~/components",
            ui: "~/ui",
            utils: "~/lib/utils",
          },
        } as Config,
      })
    ).toMatchInlineSnapshot(`
      "import { Kit } from "~/uikit"
      "
    `)
  })

  it.each([
    { name: "# alias", utils: "#utils" },
    { name: "/lib/utils suffix", utils: "@acme/ui/lib/utils" },
    { name: "scoped package with subpath", utils: "@acme/ui/utils" },
    { name: "scoped alias without a name", utils: "@utils" },
    { name: "unscoped alias with a slash", utils: "~/utils" },
    { name: "unscoped alias without a slash", utils: "utils" },
  ])(
    "cn imports and the workspace alias derived from utils: $name",
    async ({ utils }) => {
      const result = await transform({
        filename: "button.tsx",
        raw: `import { cn } from "@/lib/utils"
import { cn as cx } from "@/registry/new-york/lib/utils"
import { cn as pkg } from "@acme/ui/lib/utils"
import { cn as local } from "~/lib/utils"
import { cn as bare } from "utils/lib/utils"
import { other } from "@acme/ui/lib/utils"
`,
        config: {
          tsx: true,
          aliases: {
            components: "~/components",
            utils,
          },
        } as Config,
      })
      expect(result).toMatchSnapshot()
    }
  )

  it("redirects cn imports that resolve to the literal @/lib/utils", async () => {
    // Contrived alias set: a hooks alias of "@/lib" maps "@/hooks/utils" to
    // "@/lib/utils", which then takes the utils alias only for cn imports.
    expect(
      await transform({
        filename: "button.tsx",
        raw: `import { cn } from "@/hooks/utils"
import { other } from "@/hooks/utils"
`,
        config: {
          tsx: true,
          aliases: {
            components: "@/components",
            hooks: "@/lib",
            utils: "~/lib/utils",
          },
        } as Config,
      })
    ).toMatchInlineSnapshot(`
      "import { cn } from "~/lib/utils"
      import { other } from "@/lib/utils"
      "
    `)
  })
})
