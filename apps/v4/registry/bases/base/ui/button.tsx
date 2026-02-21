"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const buttonVariants = cva(
  "cn-button inline-flex items-center justify-center whitespace-nowrap  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
        outline: "cn-button-variant-outline",
        secondary: "cn-button-variant-secondary",
        ghost: "cn-button-variant-ghost",
        destructive: "cn-button-variant-destructive",
        link: "cn-button-variant-link",
      },
      size: {
        default: "cn-button-size-default",
        xs: "cn-button-size-xs",
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
        icon: "cn-button-size-icon",
        "icon-xs": "cn-button-size-icon-xs",
        "icon-sm": "cn-button-size-icon-sm",
        "icon-lg": "cn-button-size-icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  render,
  role,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const isRenderingAsLink =
    nativeButton === false &&
    render &&
    React.isValidElement(render) &&
    render.type === "a"

  const finalRender =
    isRenderingAsLink && !role
      ? React.cloneElement(render, { role: "link" })
      : render

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={nativeButton}
      render={finalRender}
      role={role}
      {...props}
    />
  )
}

export { Button, buttonVariants }
