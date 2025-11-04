import { Button } from "@/registry/radix-nova/ui/button"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function ButtonDemo() {
  return (
    <div className="w-fill flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>
            <IconPlaceholder name="ButtonSend" />
            Button
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">
            <IconPlaceholder name="ButtonSend" /> Send
          </Button>
          <Button variant="outline">
            Learn More <IconPlaceholder name="ButtonNext" />
          </Button>
          <Button disabled variant="outline">
            <IconPlaceholder name="ButtonLoading" className="animate-spin" />
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
            <IconPlaceholder name="ButtonSend" /> Send
          </Button>
          <Button variant="outline" size="sm">
            Learn More <IconPlaceholder name="ButtonNext" />
          </Button>
          <Button disabled size="sm" variant="outline">
            <IconPlaceholder name="ButtonLoading" className="animate-spin" />
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
            <IconPlaceholder name="ButtonSend" /> Send
          </Button>
          <Button variant="outline" size="lg">
            Learn More <IconPlaceholder name="ButtonNext" />
          </Button>
          <Button disabled size="lg" variant="outline">
            <IconPlaceholder name="ButtonLoading" className="animate-spin" />
            Please wait
          </Button>
        </div>
      </div>
    </div>
  )
}
