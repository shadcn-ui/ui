import { CircleCheckIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/base-rhea/ui/trace"

export function SubagentBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Ran the research agent</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-3">
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Ran sed -n 13,15p scripts/optimize-images.ts
              </TraceTitle>
            </TraceLine>
          </Trace>
          <p>The cache is keyed on the commit SHA.</p>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
