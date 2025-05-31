import type { JSX } from "react"

import { cn } from "@/lib/utils"

interface OrderStateProps {
  states: {
    status: string
    icon: JSX.Element
    description: string
    isActive: boolean
  }[]
}

export default function OrderState({
  states,
}: Readonly<OrderStateProps>): JSX.Element {
  return (
    <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {states.map((state) => (
        <li
          key={state.status}
          className={cn(
            "flex items-center gap-2 rounded-lg border p-1",
            state.isActive
              ? "bg-primary text-primary-foreground"
              : "border-border"
          )}
        >
          <span
            className={cn(
              "rounded-sm p-2",
              state.isActive
                ? "bg-primary-foreground text-primary"
                : "bg-foreground text-primary-foreground"
            )}
          >
            {state.icon}
          </span>
          <div className="">
            <p className="text-sm font-medium">{state.status}</p>
            <p
              className={cn(
                "text-xs",
                state.isActive
                  ? "text-primary-foreground/80"
                  : "text-foreground/80"
              )}
            >
              {state.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
