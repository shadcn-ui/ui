"use client"

import { Checkbox } from "@/registry/new-york/ui/checkbox"
import { Label } from "@/registry/new-york/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="toggle" disabled />
        <Label htmlFor="toggle">Enable notifications</Label>
      </div>
      <Label className="flex items-start gap-3 border rounded-lg p-3 has-[[aria-checked=true]]:bg-blue-50 has-[[aria-checked=true]]:border-blue-600 hover:bg-accent/50 dark:has-[[aria-checked=true]]:bg-blue-950 dark:has-[[aria-checked=true]]:border-blue-900">
        <Checkbox
          id="toggle-2"
          defaultChecked
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-700 dark:data-[state=checked]:border-blue-700 data-[state=checked]:text-white"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm font-medium leading-none">
            Enable notifications
          </p>
          <p className="text-sm text-muted-foreground">
            You can enable or disable notifications at any time.
          </p>
        </div>
      </Label>
    </div>
  )
}
