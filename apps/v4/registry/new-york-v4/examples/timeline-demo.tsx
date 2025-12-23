import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineMarker />
        <TimelineContent>
          <TimelineTitle>Order Placed</TimelineTitle>
          <TimelineDescription>
            Your order has been confirmed and is being processed.
          </TimelineDescription>
          <TimelineTime>2024-01-15 10:30 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="success" />
        <TimelineContent>
          <TimelineTitle>Shipped</TimelineTitle>
          <TimelineDescription>
            Your package has been shipped and is on its way.
          </TimelineDescription>
          <TimelineTime>2024-01-16 02:20 PM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker variant="primary" />
        <TimelineContent>
          <TimelineTitle>Out for Delivery</TimelineTitle>
          <TimelineDescription>
            Your package is out for delivery and will arrive soon.
          </TimelineDescription>
          <TimelineTime>2024-01-17 09:15 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker />
        <TimelineContent>
          <TimelineTitle>Delivered</TimelineTitle>
          <TimelineDescription>
            Your package has been successfully delivered.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
