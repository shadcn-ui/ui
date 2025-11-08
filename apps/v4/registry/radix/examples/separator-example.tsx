import { Separator } from "@/registry/radix/ui/separator"
import { CanvaFrame } from "@/app/(design)/design/components/canva"

export default function SeparatorDemo() {
  return (
    <CanvaFrame>
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
      </CanvaFrame>
  )
}
