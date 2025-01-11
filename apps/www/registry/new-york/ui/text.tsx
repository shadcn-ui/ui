import * as React from "react"
import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const shared = {
  p: "leading-7 [&:not(:first-child)]:mt-6",
  l: "my-6 ml-6 list-disc [&>li]:mt-2",
}

const textVariants = cva("", {
  defaultVariants: { variant: "p" },
  variants: {
    variant: {
      a: "text-primary font-medium underline underline-offset-4",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: shared.p,
      p: shared.p,
      small: "text-sm font-medium leading-none",
      ul: shared.l,
      ol: shared.l,
      code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-muted-foreground text-xl",
      large: "text-lg font-semibold",
      muted: "text-muted-foreground text-sm",
    },
  },
})

interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textVariants> {
  variant: "a"
  asChild?: boolean
  ref?: React.Ref<HTMLAnchorElement>
}

interface BaseProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  variant?: Exclude<VariantProps<typeof textVariants>["variant"], "a">
  asChild?: boolean
  ref?: React.Ref<HTMLElement>
}

type TextProps = AnchorProps | BaseProps

const variantToTag: Record<
  NonNullable<VariantProps<typeof textVariants>["variant"]>,
  HTMLElement["tagName"]
> = {
  a: "a",
  blockquote: "blockquote",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  p: "p",
  small: "small",
  code: "code",
  ul: "ul",
  ol: "ol",
  lead: "p",
  large: "div",
  muted: "p",
}

const Text = forwardRef<HTMLAnchorElement | HTMLElement, TextProps>(
  (props, ref) => {
    const { variant, asChild, className, ...rest } = props
    const Component = asChild ? Slot : variantToTag[variant ?? "p"]

    if (variant === "a") {
      return (
        <Component
          ref={ref}
          className={cn(textVariants({ variant }), className)}
          {...rest}
        />
      )
    }

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant }), className)}
        {...rest}
      />
    )
  }
)

Text.displayName = "Text"

export { Text, textVariants }
