import { FilePenIcon, FileTextIcon, SearchIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

export function TaskDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceTitle>Found the project files</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <SearchIcon />
              </TraceIcon>
              <TraceTitle>Searched for generateMetadata</TraceTitle>
            </TraceLine>
            <a href="#task">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read app/layout.tsx</TraceTitle>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceTitle>Updating the page metadata</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <a href="#task">
              <TraceLine>
                <TraceIcon>
                  <FilePenIcon />
                </TraceIcon>
                <TraceTitle>Edited app/layout.tsx</TraceTitle>
              </TraceLine>
            </a>
            <TraceLine status="running">
              <TraceIcon>
                <FilePenIcon />
              </TraceIcon>
              <TraceTitle>Editing app/page.tsx</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
