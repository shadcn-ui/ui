"use client"

import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"

export default function CheckboxWithText() {
  return (
    <div className="items-top flex gap-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
        <p className="text-muted-foreground text-sm">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
