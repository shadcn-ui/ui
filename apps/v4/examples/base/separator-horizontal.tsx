import { Separator } from "@/examples/base/ui/separator"

export function SeparatorHorizontal() {
  return (
    <div className="style-lyra:text-xs/relaxed flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          The Foundation for your Design System
        </div>
      </div>
      <Separator />
      <div>
        A set of beautifully designed components that you can customize, extend,
        and build on.
      </div>
    </div>
  )
}
