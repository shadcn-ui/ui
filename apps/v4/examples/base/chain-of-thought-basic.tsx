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

export function ChainOfThoughtBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Researched in 3 steps</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Read the build log for dpl_8Kx2</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Searched the web for next.js image cache key
              </TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Searched the code for cacheKey</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
