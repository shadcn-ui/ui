import {
  CheckCircle2Icon,
  CircleDotIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineWithIconsDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineMarker
          variant="success"
          icon={<CheckCircle2Icon className="size-3" />}
        />
        <TimelineContent>
          <TimelineTitle>Order Confirmed</TimelineTitle>
          <TimelineDescription>
            Your order #12345 has been confirmed.
          </TimelineDescription>
          <TimelineTime>January 15, 2024 at 10:30 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker
          variant="primary"
          icon={<PackageIcon className="size-3" />}
        />
        <TimelineContent>
          <TimelineTitle>Processing</TimelineTitle>
          <TimelineDescription>
            Your order is being prepared for shipment.
          </TimelineDescription>
          <TimelineTime>January 16, 2024 at 08:00 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker
          variant="warning"
          icon={<TruckIcon className="size-3" />}
        />
        <TimelineContent>
          <TimelineTitle>In Transit</TimelineTitle>
          <TimelineDescription>
            Your package is on its way to the delivery location.
          </TimelineDescription>
          <TimelineTime>January 17, 2024 at 02:45 PM</TimelineTime>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineMarker icon={<CircleDotIcon className="size-3" />} />
        <TimelineContent>
          <TimelineTitle>Awaiting Delivery</TimelineTitle>
          <TimelineDescription>
            Estimated delivery on January 18, 2024.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
