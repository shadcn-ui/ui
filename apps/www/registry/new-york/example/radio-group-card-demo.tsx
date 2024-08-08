import { RadioGroup, RadioGroupCard } from "@/registry/new-york/ui/radio-group"

export default function RadioGroupCardDemo() {
  return (
    <RadioGroup defaultValue="ground" className="flex space-x-2">
      <RadioGroupCard value="ground">
        <div className="p-6">
          <p className="font-semibold">Ground Shipping</p>
          <p className="text-sm">Deliver within 5-8 business days</p>
        </div>
      </RadioGroupCard>

      <RadioGroupCard value="air">
        <div className="p-6">
          <p className="font-semibold">Air Shipping</p>
          <p className="text-sm">Deliver within 3-5 business days</p>
        </div>
      </RadioGroupCard>
    </RadioGroup>
  )
}
