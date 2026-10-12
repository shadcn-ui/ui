import { BotIcon, FileTextIcon, SearchIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

export function AgentBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <BotIcon />
            </TraceIcon>
            <TraceTitle>Ran the research agent</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <Trace>
            <TraceLine>
              <TraceIcon>
                <SearchIcon />
              </TraceIcon>
              <TraceTitle>
                Searched the web for next.js image cache key
              </TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <FileTextIcon />
              </TraceIcon>
              <TraceTitle>Read scripts/optimize-images.ts</TraceTitle>
            </TraceLine>
          </Trace>
          <p>The image cache is keyed on the commit hash.</p>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
