import type { Config } from "@/src/utils/get-config"
import { describe, expect, test } from "vitest"

import { transform } from "."

const config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "",
    css: "app/globals.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
} as Config

describe("transform() output text", () => {
  // The runner returns ts-morph's SourceFile#getText(), which starts at the
  // first token: leading trivia (comments, blank lines, BOM, shebang) is lost.
  test("drops a leading line comment", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `// @ts-nocheck
import * as React from "react"

export const a = 1
`,
          config,
        },
        []
      )
    ).toBe(`import * as React from "react"

export const a = 1
`)
  })

  test("drops a leading license block comment", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `/**
 * @license MIT
 */

"use client"

import * as React from "react"
`,
          config,
        },
        []
      )
    ).toMatchInlineSnapshot(`
      ""use client"

      import * as React from "react"
      "
    `)
  })

  test("drops leading blank lines", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `

  import * as React from "react"
`,
          config,
        },
        []
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      "
    `)
  })

  test("drops a byte order mark", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `\uFEFFimport * as React from "react"
`,
          config,
        },
        []
      )
    ).toBe(`import * as React from "react"
`)
  })

  test("drops a shebang line", async () => {
    expect(
      await transform(
        {
          filename: "bin.ts",
          raw: `#!/usr/bin/env node
// cli entry
console.log("hello")
`,
          config,
        },
        []
      )
    ).toMatchInlineSnapshot(`
      "console.log("hello")
      "
    `)
  })

  test("keeps comments that follow the first token and trailing whitespace", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `import * as React from "react" // react

// helpers
export const a = 1 /* trailing */

   `,
          config,
        },
        []
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react" // react

      // helpers
      export const a = 1 /* trailing */

         "
    `)
  })

  test("keeps CRLF line endings", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `// header\r\nimport * as React from "react"\r\n\r\nexport const a = 1\r\n`,
          config,
        },
        []
      )
    ).toBe(`import * as React from "react"\r\n\r\nexport const a = 1\r\n`)
  })

  test("returns an empty string for whitespace or comment only input", async () => {
    expect(await transform({ filename: "empty.ts", raw: ``, config }, [])).toBe(
      ``
    )
    expect(
      await transform(
        { filename: "empty.ts", raw: `// only a comment\n\n`, config },
        []
      )
    ).toMatchInlineSnapshot(`""`)
  })

  // With transformJsx the runner returns transformJsx's result, which reads
  // getFullText(), so leading trivia survives when config.tsx is true.
  test("transformJsx with tsx: true keeps leading comments and shebang", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `// @ts-nocheck
/* license */

"use client"

import * as React from "react"
`,
          config: { ...config, tsx: true },
          transformJsx: true,
        },
        []
      )
    ).toBe(`// @ts-nocheck
/* license */

"use client"

import * as React from "react"
`)

    // Current behavior: the BOM is dropped even though getFullText() is used.
    expect(
      await transform(
        {
          filename: "bin.ts",
          raw: `\uFEFF#!/usr/bin/env node
console.log("hello")
`,
          config: { ...config, tsx: true },
          transformJsx: true,
        },
        []
      )
    ).toBe(`#!/usr/bin/env node
console.log("hello")
`)
  })

  test("transformJsx: false behaves like an omitted flag", async () => {
    expect(
      await transform(
        {
          filename: "button.tsx",
          raw: `// @ts-nocheck
const a: string = "a"
`,
          config: { ...config, tsx: false },
          transformJsx: false,
        },
        []
      )
    ).toBe(`const a: string = "a"
`)
  })
})

describe("transform() transformer list", () => {
  const raw = `"use client"

import * as React from "react"
import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"

export function Toolbar({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("cn-toolbar flex gap-2", className)}>
      <Button className="cn-toolbar-button">Save</Button>
    </div>
  )
}
`

  test("an empty transformer list returns the input text", async () => {
    expect(
      await transform(
        {
          filename: "toolbar.tsx",
          raw,
          config: {
            ...config,
            aliases: { ...config.aliases, ui: "~/ui" },
          },
        },
        []
      )
    ).toBe(raw)
  })

  test("the default transformer list runs when no list is passed", async () => {
    expect(
      await transform({
        filename: "toolbar.tsx",
        raw,
        config: {
          ...config,
          aliases: { ...config.aliases, ui: "~/ui", utils: "~/lib/utils" },
        },
      })
    ).toMatchInlineSnapshot(`
      ""use client"

      import * as React from "react"
      import { Button } from "~/ui/button"
      import { cn } from "~/lib/utils"

      export function Toolbar({ className }: React.ComponentProps<"div">) {
        return (
          <div className={cn("flex gap-2", className)}>
            <Button>Save</Button>
          </div>
        )
      }
      "
    `)
  })

  test("a filename with nested directories", async () => {
    expect(
      await transform({
        filename: "ui/button.tsx",
        raw: `import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/registry/new-york/lib/utils"
import { Label } from "@/registry/new-york/ui/label"
`,
        config: {
          ...config,
          aliases: { ...config.aliases, ui: "~/ui", utils: "~/lib/utils" },
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Slot } from "@radix-ui/react-slot"
      import { cn } from "~/lib/utils"
      import { Label } from "~/ui/label"
      "
    `)

    expect(
      await transform({
        filename: "app/(app)/examples/forms/page.tsx",
        raw: `import { Label } from "@/registry/new-york/ui/label"
`,
        config: {
          ...config,
          aliases: { ...config.aliases, ui: "~/ui" },
        },
      })
    ).toMatchInlineSnapshot(`
      "import { Label } from "~/ui/label"
      "
    `)
  })
})

describe("transform() non-TS inputs", () => {
  test("a .css file", async () => {
    expect(
      await transform({
        filename: "app/globals.css",
        raw: `/* Global styles */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --font-sans: "Inter", sans-serif;
}

:root {
  --background: oklch(1 0 0);
}
`,
        config,
      })
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";
      @import "tw-animate-css";

      @custom-variant dark (&:is(.dark *));

      @theme inline {
        --color-background: var(--background);
        --font-sans: "Inter", sans-serif;
      }

      :root {
        --background: oklch(1 0 0);
      }
      "
    `)
  })

  test("a .json file", async () => {
    expect(
      await transform({
        filename: "components.json",
        raw: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
`,
        config,
      })
    ).toMatchInlineSnapshot(`
      "{
        "$schema": "https://ui.shadcn.com/schema.json",
        "style": "new-york",
        "aliases": {
          "components": "@/components",
          "utils": "@/lib/utils"
        }
      }
      "
    `)
  })

  // The .mdx file is parsed as TSX. transformImport skips it (extension), but
  // transformIcons rewrites any IconPlaceholder that parses as a JSX element.
  test("an .mdx file with an IconPlaceholder inside a JSX block", async () => {
    expect(
      await transform({
        filename: "docs/button.mdx",
        raw: `import { Button } from "@/registry/new-york/ui/button"

# Button

<Button>
  <IconPlaceholder lucide="ArrowRightIcon" />
</Button>
`,
        config: { ...config, iconLibrary: "lucide" },
      })
    ).toBe(`import { Button } from "@/registry/new-york/ui/button"
import { ArrowRightIcon } from "lucide-react"

# Button

<Button>
  <ArrowRightIcon />
</Button>
`)
  })

  test("an .mdx file with frontmatter and an IconPlaceholder", async () => {
    // Current behavior: the icon import is inserted above the frontmatter.
    expect(
      await transform({
        filename: "docs/callout.mdx",
        raw: `---
title: Callout
---

<Callout>
  <IconPlaceholder lucide="InfoIcon" /> Note
</Callout>
`,
        config: { ...config, iconLibrary: "lucide" },
      })
    ).toBe(`import { InfoIcon } from "lucide-react";

---
title: Callout
---

<Callout>
  <InfoIcon /> Note
</Callout>
`)
  })

  test("an .mdx file with an IconPlaceholder inline in prose", async () => {
    // Current behavior: `Press <IconPlaceholder` does not parse as JSX, so
    // the placeholder is left as is.
    expect(
      await transform({
        filename: "docs/button.mdx",
        raw: `# Button

Press <IconPlaceholder lucide="ArrowRightIcon" /> to continue.
`,
        config: { ...config, iconLibrary: "lucide" },
      })
    ).toBe(`# Button

Press <IconPlaceholder lucide="ArrowRightIcon" /> to continue.
`)
  })

  test("non-TS inputs throw on the transformJsx path (tsx: false)", async () => {
    // Current behavior: Babel cannot parse CSS or JSON, so transform() rejects.
    await expect(
      transform({
        filename: "app/globals.css",
        raw: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}
`,
        config: { ...config, tsx: false },
        transformJsx: true,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[SyntaxError: \`import\` can only be used in \`import()\` or \`import.meta\`. (1:1)]`
    )

    await expect(
      transform({
        filename: "components.json",
        raw: `{
  "style": "new-york"
}
`,
        config: { ...config, tsx: false },
        transformJsx: true,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[SyntaxError: Missing semicolon. (2:9)]`
    )
  })
})
