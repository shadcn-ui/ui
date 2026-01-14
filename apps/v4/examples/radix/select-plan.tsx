"use client"

import * as React from "react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/examples/radix/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals getting started.",
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses.",
  },
  {
    name: "Enterprise",
    description: "Advanced features for large organizations.",
  },
]

function SelectPlanItem({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <Item size="xs" className="w-full p-0">
      <ItemContent className="gap-0">
        <ItemTitle>{plan.name}</ItemTitle>
        <ItemDescription className="text-xs">
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

export function SelectPlan() {
  const [plan, setPlan] = React.useState<string>(plans[0].name)

  const selectedPlan = plans.find((p) => p.name === plan)

  return (
    <Select value={plan} onValueChange={setPlan}>
      <SelectTrigger className="h-auto! w-72">
        <SelectValue>
          {selectedPlan && <SelectPlanItem plan={selectedPlan} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {plans.map((plan) => (
            <SelectItem key={plan.name} value={plan.name}>
              <SelectPlanItem plan={plan} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
