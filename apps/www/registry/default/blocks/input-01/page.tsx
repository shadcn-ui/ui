import type { JSX } from "react"

import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

export default function Page(): JSX.Element {
  return (
    <div className="relative grid w-full max-w-sm items-center gap-1.5 pt-4">
      <Input type="email" id="email" placeholder="Email" className="peer" />
      <Label
        htmlFor="email"
        className="absolute left-0 top-0 transition-all duration-200 peer-placeholder-shown:left-3 peer-placeholder-shown:top-7 peer-placeholder-shown:opacity-0"
      >
        Email
      </Label>
    </div>
  )
}
