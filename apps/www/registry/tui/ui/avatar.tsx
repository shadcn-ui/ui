"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"

const avatarVariants = cva(
  "bg-muted",
  {
    variants: {
      variant: {
        circular: "flex shrink-0 overflow-hidden rounded-full",
        rounded: "flex shrink-0 overflow-hidden rounded-md",
        dotCircular: "relative inline-block rounded-full",
        dotRounded: "relative inline-block rounded-md",
        ring:"flex shrink-0 overflow-hidden rounded-full ring-2 ring-white"
      },
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10",
        lg: "h-12 w-12 text-lg",
        xl: "h-14 w-14 text-xl"
      },
    },
    defaultVariants: {
      variant: "circular",
      size: "md"
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
  "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
  | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ variant, size, className, children, src, alt, color, ...props }, ref) => {
  const dotColor = (color?: string) => {
    return `absolute right-0 top-0 block h-2 w-2 rounded-full bg-${color}-400 ring-2 ring-white z-20`
  }
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        avatarVariants({ variant, size }),'inline-block',
        className
      )}
      {...props}
    >
      {src && <AvatarPrimitive.Image
        className={cn(avatarVariants({ variant, size }), className)}
        src={src}
        alt={alt}
      />}
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full"
        )}
      >
        {children}
      </AvatarPrimitive.Fallback>
      <span className={dotColor(color)} />
    </AvatarPrimitive.Root>
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
