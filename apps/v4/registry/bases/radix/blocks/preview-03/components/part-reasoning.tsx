"use client"

import * as React from "react"
import { type ReasoningUIPart } from "ai"

import { Markdown } from "@/components/markdown"
import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const REASONING_LEVEL_LABELS = [
  "Understanding",
  "Analyzing",
  "Prioritizing",
  "Refining",
] as const

export function getReasoningLevelLabel(index: number) {
  return REASONING_LEVEL_LABELS[index] ?? `Reasoning ${index + 1}`
}

function PartReasoningTrigger({ label }: { label?: string }) {
  return (
    <div>
      <IconPlaceholder
        lucide="BrainIcon"
        tabler="IconBrain"
        hugeicons="AiBrainIcon"
        phosphor="BrainIcon"
        remixicon="RiBrainLine"
        data-slot="reasoning-trigger-icon"
        className="cn-reasoning-trigger-icon size-4 shrink-0"
      />
      <span
        data-slot="reasoning-trigger-label"
        className="cn-reasoning-trigger-label min-w-0 flex-1"
      >
        {label}
      </span>
    </div>
  )
}

export function PartReasoning({
  part,
  label,
  className,
}: { part: ReasoningUIPart; label?: string } & Omit<
  React.ComponentProps<"div">,
  "part"
>) {
  if (part.type !== "reasoning") {
    return null
  }

  const isStreaming = part.state === "streaming"

  return (
    <div
      data-slot="part-reasoning"
      className={cn("w-full max-w-full min-w-0", className)}
    >
      <div className="w-full shimmer">
        <span className="whitespace-pre-wrap">{part.text}</span>
      </div>
    </div>
  )
}
