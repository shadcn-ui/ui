import type { JSX } from "react"
import { CheckCircle2, Circle } from "lucide-react"

interface OrderTrackingProps {
  steps: {
    name: string
    timestamp: string
    isCompleted: boolean
  }[]
}

export default function OrderTracking({
  steps = [],
}: Readonly<OrderTrackingProps>): JSX.Element {
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold">Order Tracking</h3>
      {steps.length > 0 ? (
        <div className="w-full max-w-md">
          <div className="">
            {steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center">
                  {step.isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-primary/70" />
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-muted-foreground" />
                  )}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-[1.5px] grow ${
                        steps[index + 1].isCompleted
                          ? "bg-primary/70"
                          : "bg-muted-foreground"
                      }`}
                    />
                  )}
                </div>
                <div className="ml-3 pb-6">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground/80">
          This order has no tracking information.
        </p>
      )}
    </>
  )
}
