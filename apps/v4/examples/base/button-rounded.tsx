import { ArrowUpIcon } from "@/examples/material-symbols"

import { Button } from "@/styles/base-force-ui/ui/button"

export default function ButtonRounded() {
  return (
    <div className="flex gap-2">
      <Button className="rounded-full">Get Started</Button>
      <Button variant="outline" size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
