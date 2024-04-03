"use client"

import { useState } from 'react'
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/registry/new-york/ui/tabs'

export const description =
  "A pricing page with 3 tiers. You can also customize it with 4 tiers or less than 3 tiers - it always looks good. The monthly plan is highlighted with a 20% discount nudging users to pick the annual plan."

export const iframeHeight = "640px"

export const containerClassName = "w-full h-full p-4 lg:p-0"

type TierCardComponentProps = {
  className?: string
  cta: string
  description: string
  features: string[]
  mostPopular?: boolean
  name: string
  price: string
  priceSuffix?: string
}

function TierCardComponent({
  className,
  cta,
  description,
  features,
  mostPopular = false,
  name,
  price,
  priceSuffix,
}: TierCardComponentProps) {
  return (
    <Card
      className={cn(
        'w-full',
        mostPopular && 'ring-2 ring-primary dark:bg-border/50',
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn(
              'text-lg font-semibold',
              mostPopular && 'text-primary',
            )}
          >
            {name}
          </CardTitle>

          {mostPopular && (
            <Badge
              className="rounded-full border-primary bg-primary/10 text-primary dark:border-transparent dark:bg-primary dark:text-primary-foreground"
              variant="outline"
            >
              Most popular
            </Badge>
          )}
        </div>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>

          {priceSuffix && (
            <span className="text-sm font-semibold text-muted-foreground">
              {priceSuffix}
            </span>
          )}
        </p>

        <Button className="w-full">{cta}</Button>

        <ul className="space-y-3">
          {features.map(feature => (
            <li
              key={feature}
              className="flex items-center gap-x-3 text-sm text-muted-foreground"
            >
              <CheckIcon
                aria-hidden="true"
                className="size-5 flex-none text-primary dark:text-foreground"
              />

              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

type PricingChartComponentProps = {
  tiers: TierCardComponentProps[]
}

function PricingChartComponent({ tiers }: PricingChartComponentProps) {
  return (
    <ul
      className={cn(
        'mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3',
        tiers.length > 3 && '2xl:grid-cols-4',
      )}
    >
      {tiers.map(tier => (
        <li className="flex" key={tier.name}>
          <TierCardComponent
            className={cn(tiers.length === 1 && 'xl-col-span-2 xl:col-start-2')}
            {...tier}
          />
        </li>
      ))}
    </ul>
  )
}

const createTiers = (billingPeriod: 'monthly' | 'annually') => [
  {
    cta: 'Subscribe now',
    description: 'For hobbyists and beginners who want to learn.',
    features: ['Unlimited public projects', 'Community support'],
    name: 'Starter',
    price: 'Free',
  },
  {
    cta: 'Subscribe now',
    description: 'For professionals and businesses who want to grow.',
    features: [
      'Unlimited public and private projects',
      'Priority support',
      'Remove branding',
    ],
    mostPopular: true,
    name: 'Pro',
    price: billingPeriod === 'monthly' ? '49.99' : '39.99',
    priceSuffix:
      billingPeriod === 'monthly' ? 'per month' : 'per month billed anually',
  },
  {
    cta: 'Contact sales',
    description: 'For large organizations who need custom solutions.',
    features: [
      'Unlimited public and private projects',
      'Dedicated support',
      'Custom branding',
    ],
    name: 'Enterprise',
    price: 'Custom',
  },
]

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('annually')

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-4 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-primary">Pricing</h1>

        <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
          Choose your plan
        </h2>

        <p className="mt-6 text-pretty text-lg text-muted-foreground">
          Choose the plan that fits your needs. All plans come with a 30-day money-back guarantee.
        </p>
      </div>

      <Tabs
        className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl xl:mx-0 xl:max-w-none"
        value={billingPeriod}
        onValueChange={setBillingPeriod}
      >
        <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>

            <TabsTrigger value="annually">Annually</TabsTrigger>
          </TabsList>

          {billingPeriod === 'monthly' && (
            <p className="text-sm leading-6 text-primary">
              Save 20% on the annual plan.
            </p>
          )}
        </div>

        <TabsContent value="monthly">
          <PricingChartComponent tiers={createTiers('monthly')} />
        </TabsContent>

        <TabsContent value="annually">
          <PricingChartComponent tiers={createTiers('annually')} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
