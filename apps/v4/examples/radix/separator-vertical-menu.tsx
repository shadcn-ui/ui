import { Separator } from "@/examples/radix/ui/separator"

export function SeparatorVerticalMenu() {
  return (
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
  )
}
