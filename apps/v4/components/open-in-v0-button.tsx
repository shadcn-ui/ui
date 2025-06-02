import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"

// v0 uses the default style.
const V0_STYLE = "default"

export function OpenInV0Button({
  name,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  name: string
}) {
  return (
    <Button
      size="sm"
      asChild
      className={cn("h-[1.8rem] gap-1", className)}
      {...props}
    >
      <a
        href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${process.env.NEXT_PUBLIC_APP_URL}/r/styles/${V0_STYLE}/${name}.json`}
        target="_blank"
      >
        Open in <Icons.v0 className="size-5" />
      </a>
    </Button>
  )
}
