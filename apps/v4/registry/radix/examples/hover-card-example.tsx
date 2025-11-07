import { Avatar, AvatarFallback, AvatarImage } from "@/registry/radix/ui/avatar"
import { Button } from "@/registry/radix/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/radix/ui/hover-card"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function HoverCardDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@nextjs</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" side="right">
            <div className="flex justify-between gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold">@nextjs</h4>
                <p className="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <IconPlaceholder
                    icon="PlaceholderIcon"
                    className="text-muted-foreground size-4"
                  />{" "}
                  <span className="text-muted-foreground text-xs">
                    Joined December 2021
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}
