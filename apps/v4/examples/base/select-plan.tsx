import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/examples/base/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

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
  return (
    <Select
      defaultValue={plans[0]}
      itemToStringValue={(plan: (typeof plans)[number]) => plan.name}
    >
      <SelectTrigger className="h-auto! w-72">
        <SelectValue>
          {(value: (typeof plans)[number]) => <SelectPlanItem plan={value} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {plans.map((plan) => (
            <SelectItem key={plan.name} value={plan}>
              <SelectPlanItem plan={plan} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
