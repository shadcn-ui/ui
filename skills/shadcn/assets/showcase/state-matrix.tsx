import * as React from "react"

import { cn } from "@/lib/utils"

const defaultStates = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
] as const

export function StateMatrix<Row extends string>({
  rows,
  states = defaultStates,
  render,
  className,
}: {
  rows: readonly Row[]
  states?: readonly string[]
  render: (row: Row, state: string) => React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-x-2 border-spacing-y-3">
        <thead>
          <tr>
            <th />
            {states.map((state) => (
              <th
                key={state}
                scope="col"
                className="text-left font-mono text-xs font-normal text-muted-foreground"
              >
                {state}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th
                scope="row"
                className="pr-4 text-left font-mono text-xs font-normal text-muted-foreground"
              >
                {row}
              </th>
              {states.map((state) => (
                <td key={state}>{render(row, state)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Spread onto a component to pin a state without interaction.
export function previewState(state: string) {
  if (state === "disabled") {
    return { disabled: true }
  }

  if (["hover", "focus", "active"].includes(state)) {
    return { "data-preview": state }
  }

  return {}
}
