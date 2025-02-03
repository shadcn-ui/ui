import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    description:
      "Perfect for small businesses getting started with our platform",
    price: "$10",
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Advanced features for growing businesses with higher demands",
    price: "$20",
  },
] as const

export function RadioGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="default" id="r1" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="comfortable" id="r2" />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Compact</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="starter" className="max-w-sm">
        {plans.map((plan) => (
          <Label
            className="flex items-start gap-3 border rounded-lg p-3 has-[[data-state=checked]]:bg-green-50 has-[[data-state=checked]]:border-green-600 hover:bg-accent/50 dark:has-[[data-state=checked]]:bg-green-950 dark:has-[[data-state=checked]]:border-green-900"
            key={plan.id}
          >
            <RadioGroupItem
              value={plan.id}
              id={plan.name}
              className="*:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 shadow-none"
            />
            <div className="grid gap-1.5 font-normal">
              <div className="font-medium">{plan.name}</div>
              <div className="text-muted-foreground leading-snug">
                {plan.description}
              </div>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
