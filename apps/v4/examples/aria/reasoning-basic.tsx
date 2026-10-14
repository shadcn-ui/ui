import { CircleCheckIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

export function ReasoningBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Thought</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="whitespace-pre-wrap">
          The dev script runs next dev with no flags. Nothing in .env or
          package.json sets PORT, so it falls back to 3000.
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
