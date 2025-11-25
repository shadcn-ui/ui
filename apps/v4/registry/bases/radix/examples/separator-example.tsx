import { Separator } from "@/registry/bases/radix/ui/separator"
import Frame from "@/app/(design)/design/components/frame"

export default function SeparatorExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SeparatorHorizontal />
        <SeparatorVertical />
        <SeparatorVerticalMenu />
        <SeparatorInList />
      </div>
    </div>
  )
}

function SeparatorHorizontal() {
  return (
    <Frame title="Horizontal">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm leading-none font-medium">shadcn/ui</div>
          <div className="text-muted-foreground text-sm">
            The Foundation for your Design System
          </div>
        </div>
        <Separator />
        <div className="text-sm">
          A set of beautifully designed components that you can customize,
          extend, and build on.
        </div>
      </div>
    </Frame>
  )
}

function SeparatorVertical() {
  return (
    <Frame title="Vertical">
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </Frame>
  )
}

function SeparatorVerticalMenu() {
  return (
    <Frame title="Vertical Menu">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Settings</span>
          <span className="text-muted-foreground text-xs">
            Manage preferences
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Account</span>
          <span className="text-muted-foreground text-xs">
            Profile & security
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Help</span>
          <span className="text-muted-foreground text-xs">Support & docs</span>
        </div>
      </div>
    </Frame>
  )
}

function SeparatorInList() {
  return (
    <Frame title="In List">
      <div className="flex flex-col gap-2">
        <dl className="flex items-center justify-between text-sm">
          <dt>Item 1</dt>
          <dd className="text-muted-foreground">Value 1</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between text-sm">
          <dt>Item 2</dt>
          <dd className="text-muted-foreground">Value 2</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between text-sm">
          <dt>Item 3</dt>
          <dd className="text-muted-foreground">Value 3</dd>
        </dl>
      </div>
    </Frame>
  )
}
