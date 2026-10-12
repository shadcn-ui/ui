import { TerminalIcon } from "lucide-react"

import { TraceIcon, TraceLine, TraceTitle } from "@/styles/radix-rhea/ui/trace"

export function TraceStatic() {
  return (
    <div className="w-full max-w-sm">
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran node --version</TraceTitle>
      </TraceLine>
    </div>
  )
}
