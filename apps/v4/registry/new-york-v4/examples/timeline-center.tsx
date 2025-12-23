import { CheckIcon, CircleIcon, XIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineSpacer,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineCenterDemo() {
  return (
    <Timeline position="center" className="mx-auto max-w-xl">
      {/* Item 1 - Left side */}
      <TimelineItem>
        <TimelineContent>
          <TimelineTitle className="flex items-center justify-end gap-2">
            Plan <CheckIcon className="size-4 text-green-500" />
          </TimelineTitle>
          <TimelineDescription>
            Define project scope and objectives.
          </TimelineDescription>
        </TimelineContent>
        <TimelineMarker variant="success" />
        <TimelineSpacer />
      </TimelineItem>

      {/* Item 2 - Right side */}
      <TimelineItem>
        <TimelineSpacer />
        <TimelineMarker variant="destructive" />
        <TimelineContent>
          <TimelineTitle className="flex items-center gap-2">
            <XIcon className="text-destructive size-4" /> Design
          </TimelineTitle>
          <TimelineDescription>
            Create UI/UX wireframes and prototypes.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      {/* Item 3 - Left side */}
      <TimelineItem>
        <TimelineContent>
          <TimelineTitle className="flex items-center justify-end gap-2">
            Code <CircleIcon className="size-4" />
          </TimelineTitle>
          <TimelineDescription>
            Implement features and functionality.
          </TimelineDescription>
        </TimelineContent>
        <TimelineMarker />
        <TimelineSpacer />
      </TimelineItem>

      {/* Item 4 - Right side */}
      <TimelineItem>
        <TimelineSpacer />
        <TimelineMarker variant="primary" />
        <TimelineContent>
          <TimelineTitle>Deploy</TimelineTitle>
          <TimelineDescription>
            Launch to production environment.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
