import { type Config } from "@/src/utils/get-config"
import { transformMenu } from "@/src/utils/transformers/transform-menu"
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

describe("transformMenu", () => {
  describe("menuColor is inverted", () => {
    test("replaces cn-menu-target with dark in string literal", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "inverted",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="dark p-4">Content</div>
        }"
      `)
    })

    test("replaces cn-menu-target with dark in cn() call", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("cn-menu-target", "p-4")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "inverted",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("dark", "p-4")}>Content</div>
        }"
      `)
    })

    test("handles multiple occurrences", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <div className="cn-menu-target p-4">First</div>
      <div className={cn("cn-menu-target", "mt-2")}>Second</div>
    </div>
  )
}`,
            config: {
              ...testConfig,
              menuColor: "inverted",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <div className="dark p-4">First</div>
              <div className={cn("dark", "mt-2")}>Second</div>
            </div>
          )
        }"
      `)
    })
  })

  describe("menuColor is default or not set", () => {
    test("removes cn-menu-target from string literal", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="p-4">Content</div>
        }"
      `)
    })

    test("removes cn-menu-target when menuColor is not set", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target p-4">Content</div>
}`,
            config: testConfig,
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="p-4">Content</div>
        }"
      `)
    })

    test("removes cn-menu-target from cn() call and cleans up empty string", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("cn-menu-target", "p-4")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("p-4")}>Content</div>
        }"
      `)
    })

    test("cleans up cn-menu-target at the end of cn() call", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("p-4", "cn-menu-target")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("p-4")}>Content</div>
        }"
      `)
    })

    test("cleans up cn-menu-target in the middle of cn() call", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("p-4", "cn-menu-target", "mt-2")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("p-4","mt-2")}>Content</div>
        }"
      `)
    })

    test("handles multiple occurrences when removing", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <div className="cn-menu-target p-4">First</div>
      <div className={cn("cn-menu-target", "mt-2")}>Second</div>
    </div>
  )
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <div className="p-4">First</div>
              <div className={cn("mt-2")}>Second</div>
            </div>
          )
        }"
      `)
    })
  })

  test("does not modify className without cn-menu-target", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"

export function Component() {
  return <div className="p-4 mt-2">Content</div>
}`,
          config: {
            ...testConfig,
            menuColor: "inverted",
          },
        },
        [transformMenu]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      export function Component() {
        return <div className="p-4 mt-2">Content</div>
      }"
    `)
  })

  describe("menuColor is default-translucent", () => {
    test("inlines cn-menu-translucent styles", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target cn-menu-translucent p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default-translucent",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="p-4 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!">Content</div>
        }"
      `)
    })

    test("inlines cn-menu-translucent styles in cn() call", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("cn-menu-target cn-menu-translucent", "p-4")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default-translucent",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!","p-4")}>Content</div>
        }"
      `)
    })
  })

  describe("menuColor is inverted-translucent", () => {
    test("replaces cn-menu-target with dark and inlines cn-menu-translucent", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target cn-menu-translucent p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "inverted-translucent",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="dark p-4 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!">Content</div>
        }"
      `)
    })

    test("replaces cn-menu-target with dark and inlines cn-menu-translucent in cn() call", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className={cn("cn-menu-target cn-menu-translucent", "p-4")}>Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "inverted-translucent",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className={cn("dark animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!", "p-4")}>Content</div>
        }"
      `)
    })
  })

  describe("menuColor is inverted removes cn-menu-translucent", () => {
    test("replaces cn-menu-target with dark and removes cn-menu-translucent", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target cn-menu-translucent p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "inverted",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="dark p-4">Content</div>
        }"
      `)
    })
  })

  describe("menuColor is default removes cn-menu-translucent", () => {
    test("removes both cn-menu-target and cn-menu-translucent", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return <div className="cn-menu-target cn-menu-translucent p-4">Content</div>
}`,
            config: {
              ...testConfig,
              menuColor: "default",
            },
          },
          [transformMenu]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return <div className="p-4">Content</div>
        }"
      `)
    })
  })

  test("preserves semicolons", async () => {
    expect(
      await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react";

export function Component() {
  return <div className="cn-menu-target p-4">Content</div>;
}`,
          config: {
            ...testConfig,
            menuColor: "inverted",
          },
        },
        [transformMenu]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react";

      export function Component() {
        return <div className="dark p-4">Content</div>;
      }"
    `)
  })
})
