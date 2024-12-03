import { FileIcon, LeafIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineContentDescription,
  TimelineContentLabel,
  TimelineDot,
  TimelineItem,
  TimelineItemLabel,
} from "@/registry/default/ui/timeline"

export default function TimelineWithIcon() {
  return (
    <Timeline>
      <TimelineItemLabel>1 Nov, 2024</TimelineItemLabel>
      <TimelineItem>
        <TimelineConnector>
          <TimelineDot size="lg" variant="outline">
            <FileIcon />
          </TimelineDot>
        </TimelineConnector>
        <TimelineContent>
          <TimelineContentLabel>Created Task</TimelineContentLabel>
          <TimelineContentDescription>
            Find more detailed insctructions here.
          </TimelineContentDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineConnector>
          <TimelineDot size="lg" variant="outline">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </TimelineDot>
        </TimelineConnector>
        <TimelineContent>
          <TimelineContentLabel>
            Release v5.2.0 quick bug fix
          </TimelineContentLabel>
          <TimelineContentDescription>
            Nov 26, 01:38 PM
          </TimelineContentDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItemLabel>20 Nov, 2024</TimelineItemLabel>
      <TimelineItem>
        <TimelineConnector hideLine>
          <TimelineDot size="lg" variant="outline">
            <LeafIcon />
          </TimelineDot>
        </TimelineConnector>
        <TimelineContent>
          <TimelineContentLabel>Take a break</TimelineContentLabel>
          <TimelineContentDescription>
            Just chill for now
          </TimelineContentDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
