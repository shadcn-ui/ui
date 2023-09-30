
import { cn } from "@/lib/utils"
import React from "react"

function HeaderBranding({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        `flex items-start gap-2 `,
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

function HeaderMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn(
      "flex items-center gap-2",
      className
    )}
      {...props}>
      {children}
    </section>
  )
}

function HeaderAction({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn(
      "flex items-end gap-2 ",
      className
    )}
      {...props}>
      {children}
    </section >
  )
}

export { HeaderBranding, HeaderMenu, HeaderAction }
