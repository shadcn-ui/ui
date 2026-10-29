"use client"

import { Button } from "@/styles/radix-rhea/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/styles/radix-rhea/ui/hover-card"
import { Progress } from "@/styles/radix-rhea/ui/progress"

const usage = {
  input: 8420,
  output: 1260,
  reasoning: 980,
  limit: 128000,
}

const used = usage.input + usage.output + usage.reasoning
const percent = Math.round((used / usage.limit) * 100)

function formatTokens(value: number) {
  if (value < 1000) {
    return String(value)
  }

  return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

const rows = [
  { label: "Input", value: usage.input },
  { label: "Output", value: usage.output },
  { label: "Reasoning", value: usage.reasoning },
]

export function ContextDemo() {
  return (
    <div className="flex justify-center py-12">
      <HoverCard openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="sm">
            {percent}% context
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="flex w-64 flex-col gap-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Context</span>
            <span className="text-muted-foreground">
              {formatTokens(used)} / {formatTokens(usage.limit)}
            </span>
          </div>
          <Progress value={percent} aria-label="Context used" />
          <div className="flex flex-col gap-1 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{row.label}</span>
                <span>{formatTokens(row.value)}</span>
              </div>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
