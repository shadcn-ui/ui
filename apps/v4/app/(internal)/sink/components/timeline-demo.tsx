import { CheckCircle2, Circle, Package, Truck } from "lucide-react"

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

export function TimelineDemo() {
  return (
    <div className="grid w-full gap-12">
      {/* Vertical Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vertical (Default)</h3>
        <Timeline>
          <TimelineItem status="completed">
            <TimelineConnector status="completed" />
            <TimelineHeader>
              <TimelineIcon variant="primary">
                <CheckCircle2 />
              </TimelineIcon>
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
          <TimelineItem status="completed">
            <TimelineConnector status="current" />
            <TimelineHeader>
              <TimelineIcon variant="primary">
                <Package />
              </TimelineIcon>
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
          <TimelineItem status="current">
            <TimelineConnector status="upcoming" />
            <TimelineHeader>
              <TimelineIcon variant="outline">
                <Truck />
              </TimelineIcon>
              <TimelineTitle>Shipped</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineDescription>
                Your package is on its way.
              </TimelineDescription>
              <TimelineTime dateTime="2024-01-17T09:15:00">
                Jan 17, 2024 at 9:15 AM
              </TimelineTime>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem status="upcoming">
            <TimelineHeader>
              <TimelineIcon>
                <Circle />
              </TimelineIcon>
              <TimelineTitle>Delivered</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineDescription>Estimated delivery date.</TimelineDescription>
              <TimelineTime dateTime="2024-01-19T12:00:00">
                Jan 19, 2024
              </TimelineTime>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      {/* Horizontal Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Horizontal</h3>
        <Timeline orientation="horizontal" className="w-full">
          <TimelineItem orientation="horizontal">
            <TimelineConnector orientation="horizontal" />
            <TimelineIcon size="sm" />
            <TimelineContent className="ms-0 items-center text-center">
              <TimelineTitle>Step 1</TimelineTitle>
              <TimelineDescription>Create account</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem orientation="horizontal">
            <TimelineConnector orientation="horizontal" />
            <TimelineIcon size="sm" />
            <TimelineContent className="ms-0 items-center text-center">
              <TimelineTitle>Step 2</TimelineTitle>
              <TimelineDescription>Verify email</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem orientation="horizontal">
            <TimelineConnector orientation="horizontal" />
            <TimelineIcon size="sm" />
            <TimelineContent className="ms-0 items-center text-center">
              <TimelineTitle>Step 3</TimelineTitle>
              <TimelineDescription>Complete profile</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem orientation="horizontal">
            <TimelineIcon size="sm" />
            <TimelineContent className="ms-0 items-center text-center">
              <TimelineTitle>Step 4</TimelineTitle>
              <TimelineDescription>Get started</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  )
}
