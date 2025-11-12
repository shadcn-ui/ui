import { Separator } from "@/registry/bases/radix/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="bg-background min-h-screen p-4">
      <div>
        <div className="flex flex-col gap-1">
          <div className="text-sm leading-none font-medium">Tailwind CSS</div>
          <div className="text-muted-foreground text-sm">
            A utility-first CSS framework.
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
          <Separator orientation="vertical" />
          <div>Source</div>
        </div>
      </div>
    </div>
  )
}
