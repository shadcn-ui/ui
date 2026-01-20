import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineConnector />
        <TimelineHeader>
          <TimelineIcon />
          <TimelineTitle>Order placed</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Your order #12345 has been confirmed.
          </TimelineDescription>
          <TimelineTime dateTime="2024-01-15T10:00:00">
            Jan 15, 2024 at 10:00 AM
          </TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineConnector />
        <TimelineHeader>
          <TimelineIcon />
          <TimelineTitle>Processing</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Your items are being prepared for shipment.
          </TimelineDescription>
          <TimelineTime dateTime="2024-01-16T14:30:00">
            Jan 16, 2024 at 2:30 PM
          </TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineConnector />
        <TimelineHeader>
          <TimelineIcon />
          <TimelineTitle>Shipped</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>Your package is on its way.</TimelineDescription>
          <TimelineTime dateTime="2024-01-17T09:15:00">
            Jan 17, 2024 at 9:15 AM
          </TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
