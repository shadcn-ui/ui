"use client"

import { cn } from "@/registry/bases/react-aria/lib/utils"
import {Keyboard as KbdPrimitive} from "react-aria-components"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <KbdPrimitive
      data-slot="kbd"
      className={cn(
        "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <KbdPrimitive
      data-slot="kbd-group"
      className={cn("cn-kbd-group inline-flex items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
