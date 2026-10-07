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

function menu(raw: string, menuColor?: Config["menuColor"]) {
  return transform(
    { filename: "test.tsx", raw, config: { ...testConfig, menuColor } },
    [transformMenu]
  )
}

// From apps/v4/registry/bases/radix/ui/dropdown-menu.tsx and select.tsx.
const MULTI_LINE_CN = `function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "cn-dropdown-menu-content cn-menu-target cn-menu-translucent z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "cn-select-content cn-menu-target cn-menu-translucent relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}
`

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

  describe("multi-line cn() from real components", () => {
    test("menuColor is not set", async () => {
      // Current behavior: the initializer collapses to one line, spaces next to
      // double quotes are removed (==="popper"&&) and "className )" is left.
      expect(await menu(MULTI_LINE_CN)).toMatchInlineSnapshot(`
        "function DropdownMenuContent({
          className,
          align = "start",
          sideOffset = 4,
          ...props
        }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
          return (
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn("cn-dropdown-menu-content z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden", className )}
                {...props}
              />
            </DropdownMenuPrimitive.Portal>
          )
        }

        function SelectContent({
          className,
          children,
          position = "item-aligned",
          align = "center",
          ...props
        }: React.ComponentProps<typeof SelectPrimitive.Content>) {
          return (
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === "item-aligned"}
                className={cn("cn-select-content relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
                position={position}
                align={align}
                {...props}
              >
                {children}
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          )
        }
        "
      `)
    })

    test("menuColor is default", async () => {
      expect(await menu(MULTI_LINE_CN, "default")).toMatchInlineSnapshot(`
        "function DropdownMenuContent({
          className,
          align = "start",
          sideOffset = 4,
          ...props
        }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
          return (
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn("cn-dropdown-menu-content z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden", className )}
                {...props}
              />
            </DropdownMenuPrimitive.Portal>
          )
        }

        function SelectContent({
          className,
          children,
          position = "item-aligned",
          align = "center",
          ...props
        }: React.ComponentProps<typeof SelectPrimitive.Content>) {
          return (
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === "item-aligned"}
                className={cn("cn-select-content relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
                position={position}
                align={align}
                {...props}
              >
                {children}
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          )
        }
        "
      `)
    })

    test("menuColor is inverted", async () => {
      expect(await menu(MULTI_LINE_CN, "inverted")).toMatchInlineSnapshot(`
        "function DropdownMenuContent({
          className,
          align = "start",
          sideOffset = 4,
          ...props
        }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
          return (
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn("cn-dropdown-menu-content dark z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden", className )}
                {...props}
              />
            </DropdownMenuPrimitive.Portal>
          )
        }

        function SelectContent({
          className,
          children,
          position = "item-aligned",
          align = "center",
          ...props
        }: React.ComponentProps<typeof SelectPrimitive.Content>) {
          return (
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === "item-aligned"}
                className={cn("cn-select-content dark relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
                position={position}
                align={align}
                {...props}
              >
                {children}
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          )
        }
        "
      `)
    })

    test("menuColor is default-translucent", async () => {
      expect(await menu(MULTI_LINE_CN, "default-translucent"))
        .toMatchInlineSnapshot(`
        "function DropdownMenuContent({
          className,
          align = "start",
          sideOffset = 4,
          ...props
        }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
          return (
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn("cn-dropdown-menu-content z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!", className )}
                {...props}
              />
            </DropdownMenuPrimitive.Portal>
          )
        }

        function SelectContent({
          className,
          children,
          position = "item-aligned",
          align = "center",
          ...props
        }: React.ComponentProps<typeof SelectPrimitive.Content>) {
          return (
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === "item-aligned"}
                className={cn("cn-select-content z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
                position={position}
                align={align}
                {...props}
              >
                {children}
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          )
        }
        "
      `)
    })

    test("menuColor is inverted-translucent", async () => {
      // Current behavior: setInitializer re-indents the continuation lines.
      expect(await menu(MULTI_LINE_CN, "inverted-translucent"))
        .toMatchInlineSnapshot(`
        "function DropdownMenuContent({
          className,
          align = "start",
          sideOffset = 4,
          ...props
        }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
          return (
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn(
                                          "cn-dropdown-menu-content dark z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!",
                                          className
                                        )}
                {...props}
              />
            </DropdownMenuPrimitive.Portal>
          )
        }

        function SelectContent({
          className,
          children,
          position = "item-aligned",
          align = "center",
          ...props
        }: React.ComponentProps<typeof SelectPrimitive.Content>) {
          return (
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === "item-aligned"}
                className={cn(
                                          "cn-select-content dark z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!",
                                          position === "popper" &&
                                            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                                          className
                                        )}
                position={position}
                align={align}
                {...props}
              >
                {children}
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          )
        }
        "
      `)
    })
  })

  describe("edge cases", () => {
    const EDGE_CASES = `export function Component({ className, open }) {
  return (
    <>
      <div className={cn(
        "cn-menu-target",
        className
      )} />
      <div className={\`cn-menu-target   p-4
        mt-2\`} />
      <div className={cn(\`cn-menu-target cn-menu-translucent p-4\`, className)} />
      <div className={\`cn-menu-target \${className}\`} />
      <div className='cn-menu-target cn-menu-translucent p-4' />
      <div className={open ? "cn-menu-target p-4" : "p-2"} />
      <div className />
      <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
    </>
  )
}
`

    test("menuColor is not set", async () => {
      // Current behavior: whitespace inside template literals is collapsed,
      // leading spaces stay outside double quotes, and "cn( className )" is left.
      expect(await menu(EDGE_CASES)).toMatchInlineSnapshot(`
        "export function Component({ className, open }) {
          return (
            <>
              <div className={cn( className )} />
              <div className={\` p-4 mt-2\`} />
              <div className={cn(\` p-4\`, className)} />
              <div className={\` \${className}\`} />
              <div className=' p-4' />
              <div className={open ?"p-4":"p-2"} />
              <div className />
              <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
            </>
          )
        }
        "
      `)
    })

    test("menuColor is default", async () => {
      expect(await menu(EDGE_CASES, "default")).toMatchInlineSnapshot(`
        "export function Component({ className, open }) {
          return (
            <>
              <div className={cn( className )} />
              <div className={\` p-4 mt-2\`} />
              <div className={cn(\` p-4\`, className)} />
              <div className={\` \${className}\`} />
              <div className=' p-4' />
              <div className={open ?"p-4":"p-2"} />
              <div className />
              <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
            </>
          )
        }
        "
      `)
    })

    test("menuColor is inverted", async () => {
      // Current behavior: setInitializer re-indents the multi-line cn( too.
      expect(await menu(EDGE_CASES, "inverted")).toMatchInlineSnapshot(`
        "export function Component({ className, open }) {
          return (
            <>
              <div className={cn(
                                    "dark",
                                    className
                                  )} />
              <div className={\`dark   p-4
                mt-2\`} />
              <div className={cn(\`dark p-4\`, className)} />
              <div className={\`dark \${className}\`} />
              <div className='dark p-4' />
              <div className={open ? "dark p-4" : "p-2"} />
              <div className />
              <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
            </>
          )
        }
        "
      `)
    })

    test("menuColor is default-translucent", async () => {
      // Current behavior: cn-menu-translucent is only inlined in double quotes.
      expect(await menu(EDGE_CASES, "default-translucent"))
        .toMatchInlineSnapshot(`
        "export function Component({ className, open }) {
          return (
            <>
              <div className={cn( className )} />
              <div className={\` p-4 mt-2\`} />
              <div className={cn(\` cn-menu-translucent p-4\`, className)} />
              <div className={\` \${className}\`} />
              <div className=' cn-menu-translucent p-4' />
              <div className={open ?"p-4":"p-2"} />
              <div className />
              <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
            </>
          )
        }
        "
      `)
    })

    test("menuColor is inverted-translucent", async () => {
      expect(await menu(EDGE_CASES, "inverted-translucent"))
        .toMatchInlineSnapshot(`
        "export function Component({ className, open }) {
          return (
            <>
              <div className={cn(
                                    "dark",
                                    className
                                  )} />
              <div className={\`dark   p-4
                mt-2\`} />
              <div className={cn(\`dark cn-menu-translucent p-4\`, className)} />
              <div className={\`dark \${className}\`} />
              <div className='dark cn-menu-translucent p-4' />
              <div className={open ? "dark p-4" : "p-2"} />
              <div className />
              <div data-class="cn-menu-target" classNames={{ content: "cn-menu-target" }} />
            </>
          )
        }
        "
      `)
    })
  })

  describe("ts-morph errors", () => {
    test("throws at an attribute inside a className it rewrote", async () => {
      // Current behavior: ts-morph forgets the nodes of the initializer it
      // replaced, and fails at the next attribute, which was one of them.
      await expect(
        menu(
          `<a className={cn("x", y && <b className="cn-menu-target" />)} />\n`,
          "inverted"
        )
      ).rejects.toThrow(
        "Attempted to get information from a node that was removed or forgotten."
      )
    })

    test("throws when a collapsed className ends in a line comment", async () => {
      // Current behavior: collapsing the whitespace puts the rest of the
      // className in the comment.
      await expect(
        menu(
          `<a\n  className={cn(\n    // the target\n    "cn-menu-target z-50",\n    className\n  )}\n/>\n`
        )
      ).rejects.toThrow("Manipulation error: A syntax error was inserted.")
    })
  })

  describe("CRLF input", () => {
    const CRLF =
      'export function Content({ className }) {\r\n  return (\r\n    <Content\r\n      className={cn(\r\n        "cn-menu-target cn-menu-translucent z-50",\r\n        className\r\n      )}\r\n    />\r\n  )\r\n}\r\n'

    test("menuColor is not set", async () => {
      // Current behavior: the multi-line initializer collapses, dropping CRLF.
      expect(JSON.stringify(await menu(CRLF))).toMatchInlineSnapshot(
        `""export function Content({ className }) {\\r\\n  return (\\r\\n    <Content\\r\\n      className={cn(\\"z-50\\", className )}\\r\\n    />\\r\\n  )\\r\\n}\\r\\n""`
      )
    })

    test("menuColor is default", async () => {
      expect(JSON.stringify(await menu(CRLF, "default"))).toMatchInlineSnapshot(
        `""export function Content({ className }) {\\r\\n  return (\\r\\n    <Content\\r\\n      className={cn(\\"z-50\\", className )}\\r\\n    />\\r\\n  )\\r\\n}\\r\\n""`
      )
    })

    test("menuColor is inverted", async () => {
      expect(
        JSON.stringify(await menu(CRLF, "inverted"))
      ).toMatchInlineSnapshot(
        `""export function Content({ className }) {\\r\\n  return (\\r\\n    <Content\\r\\n      className={cn(\\"dark z-50\\", className )}\\r\\n    />\\r\\n  )\\r\\n}\\r\\n""`
      )
    })

    test("menuColor is default-translucent", async () => {
      expect(
        JSON.stringify(await menu(CRLF, "default-translucent"))
      ).toMatchInlineSnapshot(
        `""export function Content({ className }) {\\r\\n  return (\\r\\n    <Content\\r\\n      className={cn(\\"z-50 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!\\", className )}\\r\\n    />\\r\\n  )\\r\\n}\\r\\n""`
      )
    })

    test("menuColor is inverted-translucent", async () => {
      // Current behavior: the rewritten span is re-indented and switches to LF.
      expect(
        JSON.stringify(await menu(CRLF, "inverted-translucent"))
      ).toMatchInlineSnapshot(
        `""export function Content({ className }) {\\r\\n  return (\\r\\n    <Content\\r\\n      className={cn(\\n                        \\"dark z-50 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!\\",\\n                        className\\n                      )}\\r\\n    />\\r\\n  )\\r\\n}\\r\\n""`
      )
    })
  })
})
