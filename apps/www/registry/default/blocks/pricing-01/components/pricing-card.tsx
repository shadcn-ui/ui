import { ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/default/ui/card"

interface Feature {
  name: string
  highlight?: boolean
  included: boolean
}

interface PricingCardProps {
  name: string
  price: number
  description: string
  features: Feature[]
  highlight?: boolean
  cta?: string
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlight,
  cta = "Get started",
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "group relative transition-all duration-500",
        highlight ? "bg-black dark:bg-white" : "bg-black dark:bg-white"
      )}
    >
      <CardHeader className="space-y-4 p-10">
        <h3
          className={cn(
            "text-lg font-medium uppercase tracking-wider",
            "text-white dark:text-neutral-900"
          )}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-5xl font-light",
              "text-white dark:text-neutral-900"
            )}
          >
            ${price}
          </span>
          <span className="text-sm text-neutral-400 dark:text-neutral-600">
            one-time
          </span>
        </div>
        <p
          className={cn(
            "border-b pb-6 text-sm",
            "border-neutral-800 text-neutral-400 dark:border-neutral-200 dark:text-neutral-600"
          )}
        >
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-10 pt-0">
        {features.map((feature) => (
          <div key={feature.name} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                feature.included
                  ? "text-white dark:text-neutral-900"
                  : "text-neutral-600 dark:text-neutral-500"
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm text-neutral-300 dark:text-neutral-600">
              {feature.name}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-10 pt-0">
        <Button
          aria-label={cta}
          className={cn(
            "group relative h-12 w-full",
            "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            "border border-neutral-800 dark:border-neutral-200",
            "hover:border-neutral-700 dark:hover:border-neutral-300"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}
