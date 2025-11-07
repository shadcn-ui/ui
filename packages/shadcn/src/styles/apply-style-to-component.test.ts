import { describe, expect, it } from "vitest"

import { applyStyleToComponent } from "./apply-style-to-component"
import { type StyleMap } from "./parse-style"

const baseStyleMap: StyleMap = {
  "cn-foo": "bg-background gap-4 rounded-xl",
}

describe("applyStyleToComponent", () => {
  it("adds tailwind classes to existing cn call", () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo existing-class", className)} {...props} />
  )
}
`

    const result = applyStyleToComponent({ source, styleMap: baseStyleMap })

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

  it("adds tailwind classes to string literal className", () => {
    const source = `import * as React from "react"

function Foo(props: React.ComponentProps<"div">) {
  return <div className="cn-foo" {...props} />
}
`

    const result = applyStyleToComponent({ source, styleMap: baseStyleMap })

    expect(result).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { cn } from "@/lib/utils";

      function Foo(props: React.ComponentProps<"div">) {
        return <div className="bg-background gap-4 rounded-xl" {...props} />
      }
      "
    `)
  })

  it("applies base classes to cva base string", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("applies variant classes to cva variant entries", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("handles multiple cn-* classes in one className", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("skips cn-* classes not in styleMap", () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo cn-unknown", className)} {...props} />
  )
}
`

    const result = applyStyleToComponent({ source, styleMap: baseStyleMap })

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

  it("handles className with no cn-* classes", () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("some-other-class", className)} {...props} />
  )
}
`

    const result = applyStyleToComponent({ source, styleMap: baseStyleMap })

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

  it("handles multiple cn-* classes in cn() arguments", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("handles size variants in cva", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("handles button with base, variant, and size classes", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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

  it("removes empty string arguments from cn() calls", () => {
    const source = `import * as React from "react"
import { cn } from "@/lib/utils"

function Foo({ className, ...props }: { className?: string }) {
  return (
    <div className={cn("cn-foo", "", "existing-class", "")} {...props} />
  )
}
`

    const result = applyStyleToComponent({ source, styleMap: baseStyleMap })

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

  it("prevents duplicate application when cn-* class is in both cva and className", () => {
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

    const result = applyStyleToComponent({ source, styleMap })

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
})
