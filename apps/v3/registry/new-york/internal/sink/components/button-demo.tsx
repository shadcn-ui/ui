import { Loader2Icon, MailOpenIcon } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex items-center gap-2">
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
