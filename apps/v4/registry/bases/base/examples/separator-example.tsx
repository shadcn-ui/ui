import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Separator } from "@/registry/bases/base/ui/separator"

export default function SeparatorExample() {
  return (
    <ExampleWrapper>
      <SeparatorHorizontal />
      <SeparatorVertical />
      <SeparatorVerticalMenu />
      <SeparatorInList />
    </ExampleWrapper>
  )
}

function SeparatorHorizontal() {
  return (
    <Example title="Horizontal">
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
    </Example>
  )
}

function SeparatorVertical() {
  return (
    <Example title="Vertical">
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </Example>
  )
}

function SeparatorVerticalMenu() {
  return (
    <Example title="Vertical Menu">
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
    </Example>
  )
}

function SeparatorInList() {
  return (
    <Example title="In List">
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
    </Example>
  )
}
