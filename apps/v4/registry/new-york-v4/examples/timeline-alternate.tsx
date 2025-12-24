import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineAlternateDemo() {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineMarker />
        <TimelineContent>
          <TimelineTitle>Project Started</TimelineTitle>
          <TimelineDescription>
            Initial project setup and planning phase completed.
          </TimelineDescription>
          <TimelineTime>January 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="primary" />
        <TimelineContent>
          <TimelineTitle>Design Phase</TimelineTitle>
          <TimelineDescription>
            UI/UX design completed with stakeholder approval.
          </TimelineDescription>
          <TimelineTime>February 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="success" />
        <TimelineContent>
          <TimelineTitle>Development</TimelineTitle>
          <TimelineDescription>
            Core features implemented and tested.
          </TimelineDescription>
          <TimelineTime>March 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="warning" />
        <TimelineContent>
          <TimelineTitle>Beta Release</TimelineTitle>
          <TimelineDescription>
            Beta version released to early adopters for feedback.
          </TimelineDescription>
          <TimelineTime>April 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="primary" />
        <TimelineContent>
          <TimelineTitle>Launch</TimelineTitle>
          <TimelineDescription>
            Official product launch to the public.
          </TimelineDescription>
          <TimelineTime>May 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
