import { memo, type JSX } from "react"
import OrderTracking from './order-tracking';

const trackingSteps = [
    {
      name: "Shipment scheduled by seller",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Handed over to courier",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Arrived at distribution hub",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Shipped from Philadelphia facility",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Arrived at Philadelphia facility",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Arrived at Chicago facility",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "With courier en route (Debris)",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "With courier en route (Ryan)",
      timestamp: "08/22/2022 15:29",
      isCompleted: true,
    },
    {
      name: "Delivered to recipient",
      timestamp: "08/22/2022 15:29",
      isCompleted: false,
    },
  ]

export const RightSide = memo((): JSX.Element => {
  return <div className="w-full  border-border py-4 pl-4 xl:w-1/4 xl:border-l">
    <OrderTracking steps={trackingSteps} />
  </div>
})

RightSide.displayName = "RightSide"
