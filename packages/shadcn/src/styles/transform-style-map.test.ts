import { Project, ScriptKind } from "ts-morph"
import { describe, expect, it } from "vitest"

import { type StyleMap } from "./create-style-map"
import { transformStyleMap } from "./transform-style-map"

const baseStyleMap: StyleMap = {
  "cn-foo": "bg-background gap-4 rounded-xl",
}

async function applyTransform(source: string, styleMap: StyleMap) {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  await transformStyleMap({ sourceFile, styleMap })

  return sourceFile.getText()
}

describe("transformStyleMap", () => {
  it("adds tailwind classes to existing cn call", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo existing-class", className)} {...props} />
  )
}
`

    const result = await applyTransform(source, baseStyleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("bg-background gap-4 rounded-xl existing-class", className)} {...props} />
        )
      }
      "
    `)
  })

  it("adds tailwind classes to string literal className", async () => {
    const source = `import * as React from "react"

function Foo(props: React.ComponentProps<"div">) {
  return <div className="cn-foo" {...props} />
}
`

    const result = await applyTransform(source, baseStyleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"

      function Foo(props: React.ComponentProps<"div">) {
        return <div className="bg-background gap-4 rounded-xl" {...props} />
      }
      "
    `)
  })

  it("applies base classes to cva base string", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cn-button inline-flex items-center",
  {
    variants: {
      variant: {
        default: "",
      },
    },
  }
)

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ className }))} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-button": "rounded-lg border text-sm",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "rounded-lg border text-sm inline-flex items-center",
        {
          variants: {
            variant: {
              default: "",
            },
          },
        }
      )

      function Button({ className, ...props }: React.ComponentProps<"button">) {
        return (
          <button className={cn(buttonVariants({ className }))} {...props} />
        )
      }
      "
    `)
  })

  it("applies variant classes to cva variant entries", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cn-button inline-flex items-center",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
      },
    },
  }
)

function Button({ className, variant = "default", ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-button-variant-default": "text-primary-foreground bg-primary",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "inline-flex items-center",
        {
          variants: {
            variant: {
              default: "text-primary-foreground bg-primary",
            },
          },
        }
      )

      function Button({ className, variant = "default", ...props }: React.ComponentProps<"button">) {
        return (
          <button className={cn(buttonVariants({ variant, className }))} {...props} />
        )
      }
      "
    `)
  })

  it("handles multiple cn-* classes in one className", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo cn-bar", className)} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-foo": "bg-background gap-4",
      "cn-bar": "rounded-xl border",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("bg-background gap-4 rounded-xl border", className)} {...props} />
        )
      }
      "
    `)
  })

  it("skips cn-* classes not in styleMap", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo cn-unknown", className)} {...props} />
  )
}
`

    const result = await applyTransform(source, baseStyleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("bg-background gap-4 rounded-xl", className)} {...props} />
        )
      }
      "
    `)
  })

  it("handles className with no cn-* classes", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("some-other-class", className)} {...props} />
  )
}
`

    const result = await applyTransform(source, baseStyleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("some-other-class", className)} {...props} />
        )
      }
      "
    `)
  })

  it("handles multiple cn-* classes in cn() arguments", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo", "cn-bar", className)} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-foo": "bg-background",
      "cn-bar": "rounded-xl",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("bg-background rounded-xl", className)} {...props} />
        )
      }
      "
    `)
  })

  it("handles size variants in cva", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cn-button inline-flex items-center",
  {
    variants: {
      size: {
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
      },
    },
  }
)

function Button({ className, size = "sm", ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ size, className }))} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-button-size-sm": "h-7 px-2.5",
      "cn-button-size-lg": "h-9 px-4",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "inline-flex items-center",
        {
          variants: {
            size: {
              sm: "h-7 px-2.5",
              lg: "h-9 px-4",
            },
          },
        }
      )

      function Button({ className, size = "sm", ...props }: React.ComponentProps<"button">) {
        return (
          <button className={cn(buttonVariants({ size, className }))} {...props} />
        )
      }
      "
    `)
  })

  it("handles button with base, variant, and size classes", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cn-button inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
        destructive: "cn-button-variant-destructive",
      },
      size: {
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
      },
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "sm",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-button": "rounded-lg border font-medium",
      "cn-button-variant-default": "bg-primary text-primary-foreground",
      "cn-button-variant-destructive":
        "bg-destructive text-destructive-foreground",
      "cn-button-size-sm": "h-8 px-3 text-sm",
      "cn-button-size-lg": "h-10 px-6 text-base",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva(
        "rounded-lg border font-medium inline-flex items-center justify-center",
        {
          variants: {
            variant: {
              default: "bg-primary text-primary-foreground",
              destructive: "bg-destructive text-destructive-foreground",
            },
            size: {
              sm: "h-8 px-3 text-sm",
              lg: "h-10 px-6 text-base",
            },
          },
        }
      )

      function Button({
        className,
        variant = "default",
        size = "sm",
        ...props
      }: React.ComponentProps<"button">) {
        return (
          <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
        )
      }
      "
    `)
  })

  it("removes empty string arguments from cn() calls", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo", "", "existing-class", "")} {...props} />
  )
}
`

    const result = await applyTransform(source, baseStyleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo({ className, ...props }: { className?: string }) {
        return (
          <div className={cn("bg-background gap-4 rounded-xl", "existing-class")} {...props} />
        )
      }
      "
    `)
  })

  it("prevents duplicate application when cn-* class is in both cva and className", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("cn-button", {
  variants: {
    variant: {
      default: "",
    },
  },
})

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ className }), "cn-button")} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-button": "rounded-lg border",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const buttonVariants = cva("rounded-lg border", {
        variants: {
          variant: {
            default: "",
          },
        },
      })

      function Button({ className, ...props }: React.ComponentProps<"button">) {
        return (
          <button className={cn(buttonVariants({ className }))} {...props} />
        )
      }
      "
    `)
  })

  it("applies styles to multiple occurrences of the same cn-* class", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo() {
  return (
    <section>
      <div className="cn-foo" />
      <div className={cn("cn-foo", "extra")} />
    </section>
  )
}
`

    const result = await applyTransform(source, {
      "cn-foo": "bg-background gap-4 rounded-xl",
    })

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Foo() {
        return (
          <section>
            <div className="bg-background gap-4 rounded-xl" />
            <div className={cn("bg-background gap-4 rounded-xl", "extra")} />
          </section>
        )
      }
      "
    `)
  })

  it("applies styles to cn-* classes inside mergeProps within useRender", async () => {
    const source = `import * as React from "react"
import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { cn } from "@/lib/utils"

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "cn-button-group-text flex items-center [&_svg]:pointer-events-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}
`

    const styleMap: StyleMap = {
      "cn-button-group-text": "text-sm font-medium",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { mergeProps } from "@base-ui-components/react/merge-props"
      import { useRender } from "@base-ui-components/react/use-render"
      import { cn } from "@/lib/utils"

      function ButtonGroupText({
        className,
        render,
        ...props
      }: useRender.ComponentProps<"div">) {
        return useRender({
          defaultTagName: "div",
          props: mergeProps<"div">(
            {
              className: cn(
                "text-sm font-medium flex items-center [&_svg]:pointer-events-none",
                className
              ),
            },
            props
          ),
          render,
          state: {
            slot: "button-group-text",
          },
        })
      }
      "
    `)
  })

  it("preserves allowlisted classes even when not in styleMap", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("cn-menu-target cn-foo", className)} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-foo": "bg-background rounded-lg",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={cn("bg-background rounded-lg cn-menu-target", className)} {...props} />
        )
      }
      "
    `)
  })

  it("preserves allowlisted classes even when in styleMap", async () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("cn-menu-target", className)} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-menu-target": "z-50 origin-top",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils"

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={cn("z-50 origin-top cn-menu-target", className)} {...props} />
        )
      }
      "
    `)
  })

  it("preserves allowlisted classes in mergeProps within useRender", async () => {
    const source = `import * as React from "react"
import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { cn } from "@/lib/utils"

function MenuContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "cn-menu-target cn-menu-content flex items-center",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "menu-content",
    },
  })
}
`

    const styleMap: StyleMap = {
      "cn-menu-content": "bg-background rounded-md",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { mergeProps } from "@base-ui-components/react/merge-props"
      import { useRender } from "@base-ui-components/react/use-render"
      import { cn } from "@/lib/utils"

      function MenuContent({
        className,
        render,
        ...props
      }: useRender.ComponentProps<"div">) {
        return useRender({
          defaultTagName: "div",
          props: mergeProps<"div">(
            {
              className: cn(
                "bg-background rounded-md cn-menu-target flex items-center",
                className
              ),
            },
            props
          ),
          render,
          state: {
            slot: "menu-content",
          },
        })
      }
      "
    `)
  })

  it("preserves allowlisted classes in cva base string", async () => {
    const source = `import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const menuVariants = cva(
  "cn-menu-target cn-menu inline-flex items-center",
  {
    variants: {
      variant: {
        default: "",
      },
    },
  }
)

function Menu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(menuVariants({ className }))} {...props} />
  )
}
`

    const styleMap: StyleMap = {
      "cn-menu": "bg-background rounded-lg",
    }

    const result = await applyTransform(source, styleMap)

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"

      const menuVariants = cva(
        "bg-background rounded-lg cn-menu-target inline-flex items-center",
        {
          variants: {
            variant: {
              default: "",
            },
          },
        }
      )

      function Menu({ className, ...props }: React.ComponentProps<"div">) {
        return (
          <div className={cn(menuVariants({ className }))} {...props} />
        )
      }
      "
    `)
  })
})
