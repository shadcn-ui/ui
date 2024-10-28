"use client"

import React, { PropsWithChildren, useRef } from "react"
import Link, { LinkProps } from "next/link"

import { cn } from "@/lib/utils"

export function ChartsNavItem({
  children,
  className,
  isActive,
  ...props
}: PropsWithChildren<
  LinkProps &
    React.HTMLAttributes<HTMLAnchorElement> & {
      isActive: boolean
    }
>) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  if (isActive && linkRef.current) {
    linkRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    })
  }

  return (
    <Link
      {...props}
      ref={linkRef}
      className={cn(
        "flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
        isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  )
}
