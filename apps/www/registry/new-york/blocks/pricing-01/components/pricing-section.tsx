"use client"

import * as React from "react"
import { Check, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import type {
  PricingProps,
  PricingTier,
} from "@/registry/new-york/blocks/pricing-01/types/pricing"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/new-york/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

type BillingCycle = "yearly" | "quarterly"

export function PricingSection({ title, subtitle, tiers }: PricingProps) {
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("yearly")

  const getPrice = (tier: PricingTier, cycle: BillingCycle) => {
    if (tier.price[cycle] === null) return null
    return tier.price[cycle]
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 space-y-4 text-center">
        <div className="font-medium text-primary">Pricing</div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      </div>

      <div className="mb-8 flex flex-col items-center justify-center gap-4">
        <Tabs
          className="w-full max-w-[400px]"
          defaultValue="yearly"
          value={billingCycle}
          onValueChange={(value: string) =>
            setBillingCycle(value as BillingCycle)
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yearly">
              Yearly
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Save 25%
              </span>
            </TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            className={cn(
              "relative flex flex-col",
              tier.highlighted && "border-2 border-primary shadow-lg"
            )}
          >
            {tier.highlighted && (
              <div className="absolute inset-x-0 -top-4 flex justify-center">
                <div className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Most Popular
                </div>
              </div>
            )}
            <CardHeader>
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="text-muted-foreground">{tier.description}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mt-4 flex items-baseline gap-x-2">
                <span className="text-3xl font-bold sm:text-4xl">
                  {getPrice(tier, billingCycle)
                    ? `$${getPrice(tier, billingCycle)}`
                    : "Free"}
                </span>
                {tier.price[billingCycle] && (
                  <>
                    <span className="text-muted-foreground">
                      {tier.price.suffix}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingCycle}
                    </span>
                  </>
                )}
                {tier.savings && billingCycle === "yearly" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size="icon"
                          className="h-6 w-6"
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">
                            Yearly savings information
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save ${tier.savings} per year</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start">
                    <Check
                      className="h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="ml-3 text-muted-foreground">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                size="lg"
                variant={tier.buttonVariant || "default"}
              >
                <a href={tier.buttonHref}>{tier.buttonText}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
