import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineRightDemo() {
  return (
    <Timeline position="right">
      <TimelineItem>
        <TimelineMarker />
        <TimelineContent>
          <TimelineTitle>Order Placed</TimelineTitle>
          <TimelineDescription>
            Your order has been placed successfully
          </TimelineDescription>
          <TimelineTime>January 15, 2024 at 9:00 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker variant="primary" />
        <TimelineContent>
          <TimelineTitle>Order Confirmed</TimelineTitle>
          <TimelineDescription>
            Your order has been confirmed and is being prepared
          </TimelineDescription>
          <TimelineTime>January 15, 2024 at 10:30 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker variant="success" />
        <TimelineContent>
          <TimelineTitle>Out for Delivery</TimelineTitle>
          <TimelineDescription>
            Your order is out for delivery
          </TimelineDescription>
          <TimelineTime>January 16, 2024 at 2:00 PM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
        <TimelineContent>
          <TimelineTitle>Delivered</TimelineTitle>
          <TimelineDescription>
            Your order has been delivered successfully
          </TimelineDescription>
          <TimelineTime>January 16, 2024 at 4:30 PM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
