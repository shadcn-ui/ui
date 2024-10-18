"use client"

import { Checkbox } from "@/registry/new-york/ui/checkbox"

export default function CheckboxDemo() {
  return (
    <div className="flex items-center">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none pl-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}
