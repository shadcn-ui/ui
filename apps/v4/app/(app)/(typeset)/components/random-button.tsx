"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/styles/base-nova/ui/button"
import { useShuffle } from "@/app/(app)/(typeset)/hooks/use-shuffle"

export function TypesetRandomButton({
  variant = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { shuffle } = useShuffle()

  return (
    <Button
      variant={variant}
      onClick={shuffle}
      className={cn(
        "touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!",
        className
      )}
      {...props}
    >
      <span className="w-full truncate text-center font-medium">Shuffle</span>
    </Button>
  )
}
