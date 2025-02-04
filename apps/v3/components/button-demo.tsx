import { Loader2Icon, MailOpenIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-2 md:flex-row">
      <Button>Button</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link">Link</Button>
      <Button>
        <MailOpenIcon /> Login with Email
      </Button>
      <Button disabled>
        <Loader2Icon className="animate-spin" />
        Please wait
      </Button>
    </div>
  )
}
