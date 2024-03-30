import * as React from "react"

import { Checkbox } from "@/registry/default/ui/checkbox"

export default function CheckboxIndeterminate() {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>("indeterminate")

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms2"
        checked={checked}
        onCheckedChange={() => {
          setChecked(prevState => {
            if (prevState === 'indeterminate') return true
            if (prevState === true) return false
            return 'indeterminate'
          })
        }}
      />
      <label
        htmlFor="terms2"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Choose your preference
      </label>
    </div>
  )
}
