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

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItemLabel>1 Nov, 2024</TimelineItemLabel>
      <TimelineItem>
        <TimelineConnector>
          <TimelineDot size="sm" />
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
          <TimelineDot size="sm" />
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
        <TimelineConnector>
          <TimelineDot size="sm" />
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
