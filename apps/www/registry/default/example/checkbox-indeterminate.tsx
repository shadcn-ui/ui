"use client"

import { useMemo, useState } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"

import { Checkbox } from "@/registry/default/ui/checkbox"

export default function CheckboxDemo() {
  const [buildingsChecked, setBuildingsChecked] = useState<CheckedState>(false)
  const [giantsChecked, setGiantsChecked] = useState<CheckedState>(false)

  const tallChecked = useMemo<CheckedState>(() => {
    const partialChecked =
      (buildingsChecked && !giantsChecked) ||
      (!buildingsChecked && giantsChecked)
    return partialChecked ? "indeterminate" : buildingsChecked && giantsChecked
  }, [buildingsChecked, giantsChecked])

  return (
    <div className="flex items-center space-x-2">
      <ul>
        <div className="flex items-center space-x-2">
          <li className="space-x-2">
            <Checkbox
              id="tall"
              checked={tallChecked}
              onCheckedChange={(e) => {
                setBuildingsChecked(e)
                setGiantsChecked(e)
              }}
            />
            <label
              htmlFor="tall"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tall
            </label>
          </li>
        </div>
        <ul className="pl-4">
          <li className="space-x-2">
            <Checkbox
              id="buildings"
              checked={buildingsChecked}
              onCheckedChange={(checked) => setBuildingsChecked(checked)}
            />
            <label
              htmlFor="buildings"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Buildings
            </label>
          </li>
          <li className="space-x-2">
            <Checkbox
              id="giants"
              checked={giantsChecked}
              onCheckedChange={(checked) => setGiantsChecked(checked)}
            />
            <label
              htmlFor="giants"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Giants
            </label>
          </li>
        </ul>
      </ul>
    </div>
  )
}
