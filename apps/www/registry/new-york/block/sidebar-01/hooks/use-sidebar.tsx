"use client"

import * as React from "react"

export function useSidebar() {
  const [state, setState] = React.useState<"closed" | "open">("open")

  return {
    open: state === "open",
    onOpenChange: (open: boolean) => setState(open ? "open" : "closed"),
  }
}
