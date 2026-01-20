import { Check, Circle, Package, Truck } from "lucide-react"

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

export default function TimelineWithIcons() {
  return (
    <Timeline>
      <TimelineItem status="completed">
        <TimelineConnector status="completed" />
        <TimelineHeader>
          <TimelineIcon variant="primary">
            <Check />
          </TimelineIcon>
          <TimelineTitle>Order confirmed</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Your order and payment have been received.
          </TimelineDescription>
          <TimelineTime>2 days ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="completed">
        <TimelineConnector status="completed" />
        <TimelineHeader>
          <TimelineIcon variant="primary">
            <Package />
          </TimelineIcon>
          <TimelineTitle>Packed</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Your items have been packed and labeled.
          </TimelineDescription>
          <TimelineTime>1 day ago</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="current">
        <TimelineConnector status="current" />
        <TimelineHeader>
          <TimelineIcon variant="primary">
            <Truck />
          </TimelineIcon>
          <TimelineTitle>In transit</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Your package is on its way to you.
          </TimelineDescription>
          <TimelineTime>Now</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="upcoming">
        <TimelineHeader>
          <TimelineIcon variant="outline">
            <Circle />
          </TimelineIcon>
          <TimelineTitle>Delivered</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription>
            Estimated delivery tomorrow.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
