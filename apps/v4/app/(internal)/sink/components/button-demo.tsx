import { ArrowRightIcon, Loader2Icon, SendIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button>Button</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="link">Link</Button>
        <Button variant="outline">
          <SendIcon /> Send
        </Button>
        <Button variant="outline">
          Learn More <ArrowRightIcon />
        </Button>
        <Button disabled variant="outline">
          <Loader2Icon className="animate-spin" />
          Please wait
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button size="sm">Small</Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
        <Button variant="ghost" size="sm">
          Ghost
        </Button>
        <Button variant="destructive" size="sm">
          Destructive
        </Button>
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="link" size="sm">
          Link
        </Button>
        <Button variant="outline" size="sm">
          <SendIcon /> Send
        </Button>
        <Button variant="outline" size="sm">
          Learn More <ArrowRightIcon />
        </Button>
        <Button disabled size="sm" variant="outline">
          <Loader2Icon className="animate-spin" />
          Please wait
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button size="lg">Large</Button>
        <Button variant="outline" size="lg">
          Outline
        </Button>
        <Button variant="ghost" size="lg">
          Ghost
        </Button>
        <Button variant="destructive" size="lg">
          Destructive
        </Button>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="link" size="lg">
          Link
        </Button>
        <Button variant="outline" size="lg">
          <SendIcon /> Send
        </Button>
        <Button variant="outline" size="lg">
          Learn More <ArrowRightIcon />
        </Button>
        <Button disabled size="lg" variant="outline">
          <Loader2Icon className="animate-spin" />
          Please wait
        </Button>
      </div>
    </div>
  )
}
