"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/registry/new-york-v4/ui/button"

// Renders siblings of the pre, not a positioned wrapper, so the copy button
// and the controls stay anchored to the figure.
export function CodeCollapsiblePre({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  const id = React.useId()
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <>
      <pre
        id={id}
        data-state={isOpened ? "open" : "closed"}
        className={cn(
          className,
          "data-[state=closed]:max-h-64 data-[state=closed]:overflow-y-hidden"
        )}
        {...props}
      >
        {children}
      </pre>
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={isOpened}
        aria-controls={id}
        className="absolute top-1.5 right-10 z-10 h-7 rounded-md px-2 text-muted-foreground"
        onClick={() => setIsOpened(!isOpened)}
      >
        {isOpened ? "Collapse" : "Expand"}
      </Button>
      {!isOpened && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex h-20 items-center justify-center bg-gradient-to-b from-code/70 to-code text-sm text-muted-foreground"
          onClick={() => setIsOpened(true)}
        >
          Expand
        </button>
      )}
    </>
  )
}
