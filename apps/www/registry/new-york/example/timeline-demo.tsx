import { CalendarIcon, CheckCircleIcon, StarIcon } from "lucide-react"

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
} from "@/registry/new-york/ui/timeline"

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineDot>
          <CalendarIcon className="h-3 w-3" />
        </TimelineDot>
        <TimelineConnector />
        <TimelineContent>
          <h3 className="font-semibold">Project Started</h3>
          <p className="text-sm text-muted-foreground">
            Kickoff meeting with the team
          </p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineDot variant="success">
          <CheckCircleIcon className="h-3 w-3" />
        </TimelineDot>
        <TimelineConnector />
        <TimelineContent>
          <h3 className="font-semibold">Design Phase Complete</h3>
          <p className="text-sm text-muted-foreground">
            UI/UX designs approved by stakeholders
          </p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineDot variant="warning">
          <StarIcon className="h-3 w-3" />
        </TimelineDot>
        <TimelineContent>
          <h3 className="font-semibold">Development In Progress</h3>
          <p className="text-sm text-muted-foreground">
            Frontend implementation started
          </p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
