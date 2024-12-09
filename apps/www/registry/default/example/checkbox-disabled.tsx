import { Checkbox } from "@/registry/default/ui/checkbox"

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center">
      <Checkbox id="terms2" disabled />
      <label
        htmlFor="terms2"
        className="text-sm font-medium leading-none pl-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}
