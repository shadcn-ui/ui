import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Separator } from "@/registry/bases/radix/ui/separator"

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
      <div className="style-lyra:text-xs/relaxed flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <div className="leading-none font-medium">shadcn/ui</div>
          <div className="text-muted-foreground">
            The Foundation for your Design System
          </div>
        </div>
        <Separator />
        <div>
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
      <div className="style-lyra:text-xs/relaxed flex h-5 items-center gap-4 text-sm">
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
      <div className="style-lyra:text-xs/relaxed flex items-center gap-2 text-sm md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Settings</span>
          <span className="text-muted-foreground text-xs">
            Manage preferences
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Account</span>
          <span className="text-muted-foreground text-xs">
            Profile & security
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
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
      <div className="style-lyra:text-xs/relaxed flex flex-col gap-2 text-sm">
        <dl className="flex items-center justify-between">
          <dt>Item 1</dt>
          <dd className="text-muted-foreground">Value 1</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 2</dt>
          <dd className="text-muted-foreground">Value 2</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 3</dt>
          <dd className="text-muted-foreground">Value 3</dd>
        </dl>
      </div>
    </Example>
  )
}
