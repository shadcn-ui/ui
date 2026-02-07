import { type Config } from "@/src/utils/get-config"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { describe, expect, test } from "vitest"

import { transform } from "../transformers"

const baseConfig: Config = {
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

describe("transformImport", () => {
  describe("utils import transformation", () => {
    test("transforms @/lib/utils to configured utils alias", async () => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: baseConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "@/lib/utils"')
    })

    test("transforms @/lib/utils to custom utils alias with @ prefix", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/custom/path/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "@/custom/path/utils"')
    })

    test("transforms @/lib/utils to custom utils alias with /app/ prefix", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/function/lib/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "/app/function/lib/utils"')
    })

    test("transforms @/lib/utils to simple path without lib/utils suffix", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/function",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "/app/function"')
    })

    test("transforms @/lib/utils to custom named file", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/helpers/cn",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "@/helpers/cn"')
    })

    test("handles multiple imports including utils", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/lib/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Component() {
  return <Button className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "/app/lib/utils"')
      expect(result).toContain(
        'import { Button } from "@/components/ui/button"'
      )
    })

    test("preserves other imports when transforming utils", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/core/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { useState } from "react"
import { cn, clsx } from "@/lib/utils"
import { formatDate } from "@/lib/date"

export function Component() {
  return <div />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn, clsx } from "@/core/utils"')
      expect(result).toContain('import { formatDate } from "@/lib/date"')
    })

    test("transforms utils with nested path alias", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/shared/utilities/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "@/shared/utilities/utils"')
    })

    test("does not transform non-cn imports from @/lib/utils", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/custom/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { helperFunction } from "@/lib/utils"`,
          config: customConfig,
        },
        [transformImport]
      )

      // Non-cn imports should not be transformed to custom utils path
      // They should use the lib alias transformation
      expect(result).toContain('import { helperFunction } from "@/lib/utils"')
    })

    test("transforms only cn import when mixed with other imports", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"
import { otherUtil } from "@/lib/other"`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "/app/utils"')
      expect(result).toContain('import { otherUtil } from "@/lib/other"')
    })
  })

  describe("component imports", () => {
    test("transforms @/registry imports to component alias", async () => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/registry/new-york/ui/button"`,
          config: baseConfig,
        },
        [transformImport]
      )

      expect(result).toContain(
        'import { Button } from "@/components/ui/button"'
      )
    })

    test("transforms component imports with custom alias", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          components: "/src/components",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/registry/new-york/ui/button"`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain(
        'import { Button } from "/src/components/ui/button"'
      )
    })
  })

  describe("preserves formatting", () => {
    test("preserves semicolons", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/custom/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils";

export function Component() {
  return <div />;
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(result).toContain('import { cn } from "@/custom/utils";')
    })

    test("preserves quotes style", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "@/custom/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from '@/lib/utils'`,
          config: customConfig,
        },
        [transformImport]
      )

      // ts-morph normalizes to double quotes
      expect(result).toContain("import { cn } from '@/custom/utils'")
    })
  })

  describe("edge cases", () => {
    test("handles empty config.aliases.utils", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"`,
          config: customConfig,
        },
        [transformImport]
      )

      // Should not transform if utils alias is empty
      expect(result).toContain('import { cn } from "@/lib/utils"')
    })

    test("handles remote imports", async () => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"`,
          config: baseConfig,
          isRemote: true,
        },
        [transformImport]
      )

      // Remote imports get transformed to the configured utils alias
      expect(result).toContain('import { cn } from "@/lib/utils"')
    })

    test("transforms registry lib utils imports to configured utils alias", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/function/lib/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/registry/new-york-v4/lib/utils"

export function Component() {
  return <div className={cn("test")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      // Should transform registry lib imports to custom utils alias
      expect(result).toContain('import { cn } from "/app/function/lib/utils"')
    })

    test("transforms sidebar registry imports without lib alias (issue #8648)", async () => {
      // This is the exact scenario from the bug report where sidebar.tsx
      // was generating @/pkg/components/lib/utils instead of @/pkg/lib/utils
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          components: "@/pkg/components",
          utils: "@/pkg/lib/utils",
          hooks: "@/pkg/lib/hooks",
        },
        resolvedPaths: {
          ...baseConfig.resolvedPaths,
          components: "/pkg/components",
          utils: "/pkg/lib/utils",
          hooks: "/pkg/lib/hooks",
        },
      }

      const result = await transform(
        {
          filename: "sidebar.tsx",
          raw: `import { cn } from "@/registry/new-york-v4/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

export function Sidebar() {
  return <Button className={cn("sidebar")} />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      // Should transform to utils alias, NOT components/lib/utils
      expect(result).toContain('import { cn } from "@/pkg/lib/utils"')
      expect(result).not.toContain("@/pkg/components/lib/utils")
      // Button import should still work
      expect(result).toContain(
        'import { Button } from "@/pkg/components/ui/button"'
      )
    })

    test("only transforms cn imports from lib/utils", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          utils: "/app/utils",
        },
      }

      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { someHelper } from "@/lib/helpers"
import { cn } from "@/lib/utils"`,
          config: customConfig,
        },
        [transformImport]
      )

      // Should transform cn from utils
      expect(result).toContain('import { cn } from "/app/utils"')
      // Should not transform other lib imports (no lib alias transform for non-registry imports)
      expect(result).toContain('import { someHelper } from "@/lib/helpers"')
    })

    test("transforms multiple component files with custom utils alias", async () => {
      const customConfig: Config = {
        ...baseConfig,
        aliases: {
          ...baseConfig.aliases,
          components: "/src/components",
          utils: "/src/lib/utils",
        },
      }

      // Simulating button component
      const buttonResult = await transform(
        {
          filename: "button.tsx",
          raw: `import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

export function Button() {
  return <div />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      // Simulating alert component
      const alertResult = await transform(
        {
          filename: "alert.tsx",
          raw: `import { cn } from "@/lib/utils"

export function Alert() {
  return <div />
}`,
          config: customConfig,
        },
        [transformImport]
      )

      expect(buttonResult).toContain('import { cn } from "/src/lib/utils"')
      expect(alertResult).toContain('import { cn } from "/src/lib/utils"')
    })
  })
})
