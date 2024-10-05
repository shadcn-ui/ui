import { Checkbox } from "@/registry/new-york/ui/checkbox"

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms2" disabled />
      <label
        htmlFor="terms2"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}
